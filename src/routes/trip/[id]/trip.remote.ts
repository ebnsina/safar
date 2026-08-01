import { redirect } from '@sveltejs/kit';
import { form, query } from '$app/server';
import * as v from 'valibot';
import { CheckoutSchema } from '#lib/domain/booking';
import { raise } from '#lib/errors';
import { holdSeats } from '#lib/server/repos/bookings';
import { loadSeatMap } from '#lib/server/repos/seats';
import { findTrip } from '#lib/server/repos/trips';

const TripIdSchema = v.pipe(v.string(), v.trim(), v.nonEmpty(), v.maxLength(200));

export const tripDetail = query(TripIdSchema, async (id) => {
	const detail = await findTrip(id);
	if (!detail) raise('TRIP_NOT_FOUND');
	return detail;
});

export const tripSeatMap = query(TripIdSchema, async (id) => {
	const map = await loadSeatMap(id);
	if (!map) raise('TRIP_NOT_FOUND');
	return map;
});

/** Holds the chosen seats and hands the traveller to payment. */
export const beginCheckout = form(CheckoutSchema, async (input) => {
	const held = await holdSeats(input);

	if (held === 'trip_not_found') raise('TRIP_NOT_FOUND');
	if (held === 'seats_unavailable') {
		await tripSeatMap(input.tripId).refresh();
		raise('SEATS_UNAVAILABLE');
	}

	redirect(303, `/checkout/${held.id}`);
});
