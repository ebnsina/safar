import { redirect } from '@sveltejs/kit';
import { form, query } from '$app/server';
import { BookingLookupSchema } from '#lib/domain/booking';
import { raise } from '#lib/errors';
import { findBookingByReference } from '#lib/server/repos/bookings';

/** A reference is never enough on its own — the booking email must match too. */
export const bookingByReference = query(BookingLookupSchema, async ({ reference, email }) => {
	const record = await findBookingByReference(reference, email);
	if (!record) raise('BOOKING_NOT_FOUND');
	return record;
});

export const lookupBooking = form(BookingLookupSchema, async ({ reference, email }) => {
	const record = await findBookingByReference(reference, email);
	if (!record) raise('BOOKING_NOT_FOUND');
	redirect(303, `/bookings/${record.reference}?e=${encodeURIComponent(email)}`);
});
