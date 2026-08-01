import {
	index,
	integer,
	primaryKey,
	real,
	sqliteTable,
	text,
	uniqueIndex
} from 'drizzle-orm/sqlite-core';
import type { TransportMode } from '#lib/domain/modes';

/** Cities and towns a journey can start or end at. */
export const place = sqliteTable(
	'place',
	{
		id: text('id').primaryKey(),
		region: text('region').notNull(),
		name: text('name').notNull(),
		nameLocal: text('name_local'),
		division: text('division').notNull(),
		latitude: real('latitude').notNull(),
		longitude: real('longitude').notNull(),
		/** Higher sorts first in autocomplete; roughly tracks traffic. */
		popularity: integer('popularity').notNull().default(0)
	},
	(t) => [
		index('place_region_popularity_idx').on(t.region, t.popularity),
		index('place_name_idx').on(t.name)
	]
);

/** A boarding point — bus counter, railway station or airport. */
export const stop = sqliteTable(
	'stop',
	{
		id: text('id').primaryKey(),
		placeId: text('place_id')
			.notNull()
			.references(() => place.id),
		mode: text('mode').$type<TransportMode>().notNull(),
		name: text('name').notNull(),
		/** Station or IATA code where one exists. */
		code: text('code'),
		address: text('address'),
		latitude: real('latitude').notNull(),
		longitude: real('longitude').notNull()
	},
	(t) => [index('stop_place_mode_idx').on(t.placeId, t.mode)]
);

export const operator = sqliteTable(
	'operator',
	{
		id: text('id').primaryKey(),
		mode: text('mode').$type<TransportMode>().notNull(),
		name: text('name').notNull(),
		code: text('code').notNull(),
		/** Rating in tenths (43 = 4.3) so it stays an integer. */
		rating: integer('rating').notNull(),
		ratingCount: integer('rating_count').notNull(),
		foundedYear: integer('founded_year'),
		amenities: text('amenities', { mode: 'json' }).$type<string[]>().notNull()
	},
	(t) => [index('operator_mode_idx').on(t.mode), uniqueIndex('operator_code_idx').on(t.code)]
);

/** A served city pair. Trips are instances of a route on a given day. */
export const route = sqliteTable(
	'route',
	{
		id: text('id').primaryKey(),
		mode: text('mode').$type<TransportMode>().notNull(),
		originPlaceId: text('origin_place_id')
			.notNull()
			.references(() => place.id),
		destinationPlaceId: text('destination_place_id')
			.notNull()
			.references(() => place.id),
		distanceKm: integer('distance_km').notNull(),
		durationMinutes: integer('duration_minutes').notNull()
	},
	(t) => [index('route_lookup_idx').on(t.mode, t.originPlaceId, t.destinationPlaceId)]
);

/** Intermediate calls, stored once per route as offsets from departure. */
export const routeStop = sqliteTable(
	'route_stop',
	{
		routeId: text('route_id')
			.notNull()
			.references(() => route.id),
		sequence: integer('sequence').notNull(),
		stopId: text('stop_id')
			.notNull()
			.references(() => stop.id),
		offsetMinutes: integer('offset_minutes').notNull(),
		dwellMinutes: integer('dwell_minutes').notNull().default(0)
	},
	(t) => [primaryKey({ columns: [t.routeId, t.sequence] })]
);

/** A single departure. Seat inventory derives from `layoutId` + `seed`, not stored per seat. */
export const trip = sqliteTable(
	'trip',
	{
		id: text('id').primaryKey(),
		code: text('code').notNull(),
		mode: text('mode').$type<TransportMode>().notNull(),
		routeId: text('route_id')
			.notNull()
			.references(() => route.id),
		operatorId: text('operator_id')
			.notNull()
			.references(() => operator.id),
		layoutId: text('layout_id').notNull(),
		/** Denormalised from the route so searches hit a single index. */
		originPlaceId: text('origin_place_id')
			.notNull()
			.references(() => place.id),
		destinationPlaceId: text('destination_place_id')
			.notNull()
			.references(() => place.id),
		originStopId: text('origin_stop_id')
			.notNull()
			.references(() => stop.id),
		destinationStopId: text('destination_stop_id')
			.notNull()
			.references(() => stop.id),
		departAt: integer('depart_at').notNull(),
		arriveAt: integer('arrive_at').notNull(),
		durationMinutes: integer('duration_minutes').notNull(),
		/** Calendar date at origin (YYYY-MM-DD) — the exact value search filters on. */
		departDate: text('depart_date').notNull(),
		baseFareMinor: integer('base_fare_minor').notNull(),
		currency: text('currency').notNull(),
		seed: integer('seed').notNull(),
		occupancy: real('occupancy').notNull(),
		seatsTotal: integer('seats_total').notNull(),
		seatsAvailable: integer('seats_available').notNull()
	},
	(t) => [
		index('trip_search_idx').on(t.mode, t.originPlaceId, t.destinationPlaceId, t.departDate),
		index('trip_depart_idx').on(t.departAt),
		uniqueIndex('trip_code_date_idx').on(t.code, t.departDate)
	]
);

export type BookingStatus = 'held' | 'confirmed' | 'cancelled';

export const booking = sqliteTable(
	'booking',
	{
		id: text('id').primaryKey(),
		/** Six-character reference the traveller quotes. */
		reference: text('reference').notNull(),
		tripId: text('trip_id')
			.notNull()
			.references(() => trip.id),
		status: text('status').$type<BookingStatus>().notNull(),
		contactName: text('contact_name').notNull(),
		contactEmail: text('contact_email').notNull(),
		contactPhone: text('contact_phone').notNull(),
		fareMinor: integer('fare_minor').notNull(),
		feesMinor: integer('fees_minor').notNull(),
		totalMinor: integer('total_minor').notNull(),
		currency: text('currency').notNull(),
		paymentReference: text('payment_reference'),
		createdAt: integer('created_at').notNull(),
		/** Held bookings lapse at this instant and release their seats. */
		expiresAt: integer('expires_at')
	},
	(t) => [
		uniqueIndex('booking_reference_idx').on(t.reference),
		index('booking_email_idx').on(t.contactEmail),
		index('booking_trip_idx').on(t.tripId)
	]
);

export const passenger = sqliteTable(
	'passenger',
	{
		id: text('id').primaryKey(),
		bookingId: text('booking_id')
			.notNull()
			.references(() => booking.id, { onDelete: 'cascade' }),
		seatCode: text('seat_code').notNull(),
		classCode: text('class_code').notNull(),
		fullName: text('full_name').notNull(),
		type: text('type').$type<'adult' | 'child'>().notNull(),
		gender: text('gender').$type<'male' | 'female' | 'unspecified'>().notNull(),
		age: integer('age'),
		documentId: text('document_id'),
		fareMinor: integer('fare_minor').notNull()
	},
	(t) => [index('passenger_booking_idx').on(t.bookingId)]
);

/** Authoritative seat reservations. The composite key is what stops double booking. */
export const tripSeat = sqliteTable(
	'trip_seat',
	{
		tripId: text('trip_id')
			.notNull()
			.references(() => trip.id),
		seatCode: text('seat_code').notNull(),
		bookingId: text('booking_id')
			.notNull()
			.references(() => booking.id, { onDelete: 'cascade' })
	},
	(t) => [
		primaryKey({ columns: [t.tripId, t.seatCode] }),
		index('trip_seat_booking_idx').on(t.bookingId)
	]
);

export type Place = typeof place.$inferSelect;
export type Stop = typeof stop.$inferSelect;
export type Operator = typeof operator.$inferSelect;
export type Route = typeof route.$inferSelect;
export type RouteStop = typeof routeStop.$inferSelect;
export type Trip = typeof trip.$inferSelect;
export type Booking = typeof booking.$inferSelect;
export type Passenger = typeof passenger.$inferSelect;
export type TripSeat = typeof tripSeat.$inferSelect;
