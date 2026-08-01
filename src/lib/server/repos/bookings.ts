import { and, eq, sql } from 'drizzle-orm';
import { HOLD_DURATION_MS, type CheckoutInput, type PaymentInput } from '#lib/domain/booking';
import { priceBooking } from '#lib/domain/pricing';
import type { TripDetail } from '#lib/domain/trip';
import { db } from '../db';
import { booking, passenger, trip, tripSeat } from '../db/schema';
import { loadSeatMap, quoteSeats, releaseExpiredHolds } from './seats';
import { findTrip } from './trips';

/** Ambiguous characters are left out so references are easy to read aloud. */
const REFERENCE_ALPHABET = 'ACDEFGHJKLMNPQRTUVWXY3456789';

function generateReference(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(6));
	return Array.from(bytes, (byte) => REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length]).join('');
}

export type HoldFailure = 'trip_not_found' | 'seats_unavailable';

export interface HeldBooking {
	id: string;
	reference: string;
	expiresAt: number;
	fareMinor: number;
	feesMinor: number;
	totalMinor: number;
	currency: string;
	trip: TripDetail;
	seats: { seatCode: string; classCode: string; fareMinor: number }[];
}

/**
 * Reserves seats for a short window while the traveller pays. Seat rows are inserted
 * inside the transaction, so the composite primary key settles any race.
 */
export async function holdSeats(
	input: CheckoutInput,
	now = Date.now()
): Promise<HeldBooking | HoldFailure> {
	await releaseExpiredHolds(now);

	const detail = await findTrip(input.tripId);
	if (!detail || detail.departAt <= now) return 'trip_not_found';

	const map = await loadSeatMap(input.tripId, now);
	if (!map) return 'trip_not_found';

	const seatCodes = input.passengers.map((entry) => entry.seatCode);
	const quotes = quoteSeats(map, seatCodes);
	if (!quotes || quotes.length !== input.passengers.length) return 'seats_unavailable';

	const priceBySeat = new Map(quotes.map((quote) => [quote.seatCode, quote]));
	const { fareMinor, feesMinor, totalMinor } = priceBooking(quotes.map((q) => q.fareMinor));

	const bookingId = crypto.randomUUID();
	const reference = generateReference();
	const expiresAt = now + HOLD_DURATION_MS;

	try {
		await db.transaction(async (tx) => {
			await tx.insert(booking).values({
				id: bookingId,
				reference,
				tripId: input.tripId,
				status: 'held',
				contactName: input.contactName,
				contactEmail: input.contactEmail.toLowerCase(),
				contactPhone: input.contactPhone,
				fareMinor,
				feesMinor,
				totalMinor,
				currency: detail.currency,
				paymentReference: null,
				createdAt: now,
				expiresAt
			});

			await tx.insert(tripSeat).values(
				quotes.map((quote) => ({
					tripId: input.tripId,
					seatCode: quote.seatCode,
					bookingId
				}))
			);

			await tx.insert(passenger).values(
				input.passengers.map((entry) => {
					const quote = priceBySeat.get(entry.seatCode);
					return {
						id: crypto.randomUUID(),
						bookingId,
						seatCode: entry.seatCode,
						classCode: quote?.classCode ?? '',
						fullName: entry.fullName,
						type: entry.type,
						gender: entry.gender,
						age: entry.age ?? null,
						documentId: entry.documentId ?? null,
						fareMinor: quote?.fareMinor ?? 0
					};
				})
			);

			await tx
				.update(trip)
				.set({ seatsAvailable: sql`max(0, ${trip.seatsAvailable} - ${quotes.length})` })
				.where(eq(trip.id, input.tripId));
		});
	} catch {
		// A duplicate seat key means someone else won the race for one of these seats.
		return 'seats_unavailable';
	}

	return {
		id: bookingId,
		reference,
		expiresAt,
		fareMinor,
		feesMinor,
		totalMinor,
		currency: detail.currency,
		trip: detail,
		seats: quotes
	};
}

export type ConfirmFailure = 'not_found' | 'expired';

export interface ConfirmedBooking {
	reference: string;
	email: string;
}

export async function confirmBooking(
	bookingId: string,
	payment: PaymentInput,
	now = Date.now()
): Promise<ConfirmedBooking | ConfirmFailure> {
	const [row] = await db.select().from(booking).where(eq(booking.id, bookingId)).limit(1);
	if (!row) return 'not_found';
	if (row.status === 'confirmed') return { reference: row.reference, email: row.contactEmail };
	if (row.status === 'cancelled' || (row.expiresAt !== null && row.expiresAt < now)) {
		return 'expired';
	}

	// The settlement reference is minted here — the client never supplies one.
	const paymentReference = `${payment.method.toUpperCase()}-${generateReference()}`;

	await db
		.update(booking)
		.set({ status: 'confirmed', expiresAt: null, paymentReference })
		.where(eq(booking.id, bookingId));

	return { reference: row.reference, email: row.contactEmail };
}

export interface BookingRecord {
	reference: string;
	status: 'held' | 'confirmed' | 'cancelled';
	contactName: string;
	contactEmail: string;
	contactPhone: string;
	fareMinor: number;
	feesMinor: number;
	totalMinor: number;
	currency: string;
	createdAt: number;
	expiresAt: number | null;
	trip: TripDetail;
	passengers: {
		fullName: string;
		seatCode: string;
		classCode: string;
		type: 'adult' | 'child';
		fareMinor: number;
	}[];
}

async function toRecord(row: typeof booking.$inferSelect): Promise<BookingRecord | null> {
	const detail = await findTrip(row.tripId);
	if (!detail) return null;

	const people = await db.select().from(passenger).where(eq(passenger.bookingId, row.id));

	return {
		reference: row.reference,
		status: row.status,
		contactName: row.contactName,
		contactEmail: row.contactEmail,
		contactPhone: row.contactPhone,
		fareMinor: row.fareMinor,
		feesMinor: row.feesMinor,
		totalMinor: row.totalMinor,
		currency: row.currency,
		createdAt: row.createdAt,
		expiresAt: row.expiresAt,
		trip: detail,
		passengers: people
			.map((person) => ({
				fullName: person.fullName,
				seatCode: person.seatCode,
				classCode: person.classCode,
				type: person.type,
				fareMinor: person.fareMinor
			}))
			.sort((a, b) => a.seatCode.localeCompare(b.seatCode, undefined, { numeric: true }))
	};
}

export async function findBookingById(id: string): Promise<BookingRecord | null> {
	const [row] = await db.select().from(booking).where(eq(booking.id, id)).limit(1);
	return row ? toRecord(row) : null;
}

/** Lookup needs both the reference and the booking email, so references alone leak nothing. */
export async function findBookingByReference(
	reference: string,
	email: string
): Promise<BookingRecord | null> {
	const [row] = await db
		.select()
		.from(booking)
		.where(
			and(
				eq(booking.reference, reference.toUpperCase()),
				eq(booking.contactEmail, email.trim().toLowerCase())
			)
		)
		.limit(1);

	return row ? toRecord(row) : null;
}
