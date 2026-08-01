import { and, eq, inArray, lt } from 'drizzle-orm';
import { getLayout } from '#lib/domain/layouts';
import { buildSeatMap, collectSeats, type SeatMap } from '#lib/domain/seating';
import { db } from '../db';
import { booking, trip, tripSeat } from '../db/schema';

/** Frees seats from holds that were never paid for, so inventory does not leak. */
export async function releaseExpiredHolds(now = Date.now()): Promise<void> {
	const expired = await db
		.select({ id: booking.id })
		.from(booking)
		.where(and(eq(booking.status, 'held'), lt(booking.expiresAt, now)));

	if (expired.length === 0) return;

	const ids = expired.map((row) => row.id);
	await db.delete(tripSeat).where(inArray(tripSeat.bookingId, ids));
	await db.update(booking).set({ status: 'cancelled' }).where(inArray(booking.id, ids));
}

export async function reservedSeatCodes(tripId: string): Promise<string[]> {
	const rows = await db
		.select({ seatCode: tripSeat.seatCode })
		.from(tripSeat)
		.where(eq(tripSeat.tripId, tripId));
	return rows.map((row) => row.seatCode);
}

/** Rebuilds the seat map for a trip: generated occupancy plus real reservations. */
export async function loadSeatMap(tripId: string, now = Date.now()): Promise<SeatMap | null> {
	await releaseExpiredHolds(now);

	const [row] = await db.select().from(trip).where(eq(trip.id, tripId)).limit(1);
	if (!row) return null;

	const layout = getLayout(row.layoutId);
	if (!layout) return null;

	return buildSeatMap({
		layout,
		baseFareMinor: row.baseFareMinor,
		seed: row.seed,
		occupancy: row.occupancy,
		takenSeats: await reservedSeatCodes(tripId)
	});
}

export interface SeatQuote {
	seatCode: string;
	classCode: string;
	fareMinor: number;
}

/**
 * Confirms every requested seat is real and free, returning the price for each.
 * `null` means at least one seat is gone, which the caller reports as a conflict.
 */
export function quoteSeats(map: SeatMap, seatCodes: string[]): SeatQuote[] | null {
	const byCode = new Map(collectSeats(map).map((seat) => [seat.code, seat]));
	const quotes: SeatQuote[] = [];

	for (const code of new Set(seatCodes)) {
		const seat = byCode.get(code);
		if (!seat || seat.status !== 'available') return null;
		quotes.push({ seatCode: seat.code, classCode: seat.classCode, fareMinor: seat.priceMinor });
	}

	return quotes.length === new Set(seatCodes).size ? quotes : null;
}
