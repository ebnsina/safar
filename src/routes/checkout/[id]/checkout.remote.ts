import { redirect } from '@sveltejs/kit';
import { form, query } from '$app/server';
import * as v from 'valibot';
import { PaymentFormSchema } from '#lib/domain/booking';
import { raise } from '#lib/errors';
import { confirmBooking, findBookingById } from '#lib/server/repos/bookings';

const BookingIdSchema = v.pipe(v.string(), v.trim(), v.nonEmpty(), v.maxLength(64));

export const pendingBooking = query(BookingIdSchema, async (id) => {
	const record = await findBookingById(id);
	if (!record) raise('BOOKING_NOT_FOUND');
	if (record.status === 'cancelled') raise('HOLD_EXPIRED');
	return record;
});

/** Mock settlement. Card details are validated for shape, then discarded. */
export const payForBooking = form(PaymentFormSchema, async ({ bookingId, ...payment }) => {
	const result = await confirmBooking(bookingId, payment);

	if (result === 'not_found') raise('BOOKING_NOT_FOUND');
	if (result === 'expired') raise('HOLD_EXPIRED');

	redirect(303, `/bookings/${result.reference}?e=${encodeURIComponent(result.email)}`);
});
