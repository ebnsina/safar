import { and, asc, count, desc, eq, gt, gte, inArray, lte, or, sql, type SQL } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { getLayout, LAYOUTS } from '#lib/domain/layouts';
import {
	RESULTS_PER_PAGE,
	windowById,
	type SearchFilters,
	type SearchQuery
} from '#lib/domain/search';
import { fareForClass, type SeatLayout } from '#lib/domain/seating';
import type { FareOption, PlaceView, TripCall, TripDetail, TripSummary } from '#lib/domain/trip';
import { db } from '../db';
import { operator, place, route, routeStop, stop, trip } from '../db/schema';
import { findPlaces } from './places';

/** Asia/Dhaka has a fixed UTC+6 offset, so local-hour maths needs no timezone database. */
const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000;

const originPlace = alias(place, 'origin_place');
const destinationPlace = alias(place, 'destination_place');
const originStop = alias(stop, 'origin_stop');
const destinationStop = alias(stop, 'destination_stop');

const SELECTION = {
	trip,
	operator,
	origin: originPlace,
	destination: destinationPlace,
	originStop,
	destinationStop
} as const;

type JoinedTrip = {
	trip: typeof trip.$inferSelect;
	operator: typeof operator.$inferSelect;
	origin: typeof place.$inferSelect;
	destination: typeof place.$inferSelect;
	originStop: typeof stop.$inferSelect;
	destinationStop: typeof stop.$inferSelect;
};

function faresFor(layout: SeatLayout, baseFareMinor: number): FareOption[] {
	return layout.classes
		.map((spec) => ({
			code: spec.code,
			name: spec.name,
			priceMinor: fareForClass(baseFareMinor, spec),
			baggageKg: spec.baggageKg,
			refundable: spec.refundable,
			perks: spec.perks
		}))
		.sort((a, b) => a.priceMinor - b.priceMinor);
}

function toSummary(row: JoinedTrip): TripSummary | null {
	const layout = getLayout(row.trip.layoutId);
	if (!layout) return null;

	const fares = faresFor(layout, row.trip.baseFareMinor);

	return {
		id: row.trip.id,
		code: row.trip.code,
		mode: row.trip.mode,
		layoutId: row.trip.layoutId,
		operator: {
			id: row.operator.id,
			name: row.operator.name,
			code: row.operator.code,
			rating: row.operator.rating,
			ratingCount: row.operator.ratingCount,
			amenities: row.operator.amenities
		},
		origin: {
			id: row.origin.id,
			name: row.origin.name,
			nameLocal: row.origin.nameLocal,
			division: row.origin.division
		},
		destination: {
			id: row.destination.id,
			name: row.destination.name,
			nameLocal: row.destination.nameLocal,
			division: row.destination.division
		},
		originStop: {
			id: row.originStop.id,
			name: row.originStop.name,
			code: row.originStop.code,
			placeName: row.origin.name
		},
		destinationStop: {
			id: row.destinationStop.id,
			name: row.destinationStop.name,
			code: row.destinationStop.code,
			placeName: row.destination.name
		},
		departAt: row.trip.departAt,
		arriveAt: row.trip.arriveAt,
		durationMinutes: row.trip.durationMinutes,
		currency: row.trip.currency,
		baseFareMinor: row.trip.baseFareMinor,
		fromFareMinor: fares[0]?.priceMinor ?? row.trip.baseFareMinor,
		fares,
		seatsTotal: row.trip.seatsTotal,
		seatsAvailable: row.trip.seatsAvailable
	};
}

const localHour = sql<number>`cast(strftime('%H', (${trip.departAt} + ${DHAKA_OFFSET_MS}) / 1000, 'unixepoch') as integer)`;

/** Conditions that apply to the trip table alone — shared by results and facets. */
function coreConditions(query: SearchQuery, now: number): SQL[] {
	return [
		eq(trip.mode, query.mode),
		eq(trip.originPlaceId, query.origin),
		eq(trip.destinationPlaceId, query.destination),
		eq(trip.departDate, query.date),
		gt(trip.departAt, now),
		gte(trip.seatsAvailable, query.passengers)
	];
}

function filterConditions(filters: SearchFilters): SQL[] {
	const conditions: SQL[] = [];

	if (filters.operators.length > 0) {
		conditions.push(inArray(trip.operatorId, filters.operators));
	}

	if (filters.maxFareMinor !== undefined) {
		conditions.push(lte(trip.baseFareMinor, filters.maxFareMinor));
	}

	if (filters.minRating !== undefined) {
		conditions.push(gte(operator.rating, filters.minRating));
	}

	if (filters.windows.length > 0) {
		const ranges = filters.windows
			.map((id) => windowById(id))
			.filter((window) => window !== undefined)
			.map(
				(window) => and(gte(localHour, window.fromHour), lte(localHour, window.toHour - 1)) as SQL
			);
		if (ranges.length > 0) conditions.push(or(...ranges) as SQL);
	}

	// Fare classes come from the layout, so they filter on the layouts offering them.
	if (filters.classes.length > 0) {
		const layoutIds = layoutsOfferingClasses(filters.classes);
		conditions.push(layoutIds.length > 0 ? inArray(trip.layoutId, layoutIds) : sql`1 = 0`);
	}

	return conditions;
}

function layoutsOfferingClasses(classes: string[]): string[] {
	const wanted = new Set(classes);
	return LAYOUTS.filter((layout) => layout.classes.some((spec) => wanted.has(spec.code))).map(
		(layout) => layout.id
	);
}

export interface SearchResult {
	trips: TripSummary[];
	total: number;
	page: number;
	pageCount: number;
	/** Resolved endpoints, so headings read as names even when nothing matched. */
	origin: PlaceView | null;
	destination: PlaceView | null;
}

const ORDER_BY = {
	departure: () => [asc(trip.departAt)],
	price_asc: () => [asc(trip.baseFareMinor), asc(trip.departAt)],
	price_desc: () => [desc(trip.baseFareMinor), asc(trip.departAt)],
	duration: () => [asc(trip.durationMinutes), asc(trip.departAt)],
	rating: () => [desc(operator.rating), asc(trip.departAt)]
};

export async function searchTrips(
	query: SearchQuery,
	filters: SearchFilters,
	now = Date.now()
): Promise<SearchResult> {
	const where = and(...coreConditions(query, now), ...filterConditions(filters));

	const [totals] = await db
		.select({ total: count() })
		.from(trip)
		.innerJoin(operator, eq(operator.id, trip.operatorId))
		.where(where);
	const total = totals?.total ?? 0;

	const pageCount = Math.max(1, Math.ceil(total / RESULTS_PER_PAGE));
	const page = Math.min(filters.page, pageCount);

	const rows = await db
		.select(SELECTION)
		.from(trip)
		.innerJoin(operator, eq(operator.id, trip.operatorId))
		.innerJoin(originPlace, eq(originPlace.id, trip.originPlaceId))
		.innerJoin(destinationPlace, eq(destinationPlace.id, trip.destinationPlaceId))
		.innerJoin(originStop, eq(originStop.id, trip.originStopId))
		.innerJoin(destinationStop, eq(destinationStop.id, trip.destinationStopId))
		.where(where)
		.orderBy(...ORDER_BY[filters.sort]())
		.limit(RESULTS_PER_PAGE)
		.offset((page - 1) * RESULTS_PER_PAGE);

	const trips = rows.map(toSummary).filter((summary): summary is TripSummary => summary !== null);
	const endpoints = await findPlaces([query.origin, query.destination]);

	return {
		trips,
		total,
		page,
		pageCount,
		origin: endpoints.get(query.origin) ?? null,
		destination: endpoints.get(query.destination) ?? null
	};
}

export interface FacetOption {
	id: string;
	label: string;
	count: number;
}

export interface SearchFacets {
	operators: FacetOption[];
	classes: FacetOption[];
	minFareMinor: number;
	maxFareMinor: number;
	total: number;
}

/** Counts computed against the unfiltered search so options never disappear mid-refine. */
export async function searchFacets(query: SearchQuery, now = Date.now()): Promise<SearchFacets> {
	const where = and(...coreConditions(query, now));

	const rows = await db
		.select({
			operatorId: trip.operatorId,
			operatorName: operator.name,
			layoutId: trip.layoutId,
			trips: count(),
			minFare: sql<number>`min(${trip.baseFareMinor})`,
			maxFare: sql<number>`max(${trip.baseFareMinor})`
		})
		.from(trip)
		.innerJoin(operator, eq(operator.id, trip.operatorId))
		.where(where)
		.groupBy(trip.operatorId, trip.layoutId);

	const operators = new Map<string, FacetOption>();
	const classes = new Map<string, FacetOption>();
	let minFareMinor = Number.POSITIVE_INFINITY;
	let maxFareMinor = 0;
	let total = 0;

	for (const row of rows) {
		total += row.trips;
		minFareMinor = Math.min(minFareMinor, row.minFare);
		maxFareMinor = Math.max(maxFareMinor, row.maxFare);

		const existing = operators.get(row.operatorId);
		operators.set(row.operatorId, {
			id: row.operatorId,
			label: row.operatorName,
			count: (existing?.count ?? 0) + row.trips
		});

		for (const spec of getLayout(row.layoutId)?.classes ?? []) {
			const seen = classes.get(spec.code);
			classes.set(spec.code, {
				id: spec.code,
				label: spec.name,
				count: (seen?.count ?? 0) + row.trips
			});
		}
	}

	return {
		operators: [...operators.values()].sort((a, b) => b.count - a.count),
		classes: [...classes.values()].sort((a, b) => b.count - a.count),
		minFareMinor: Number.isFinite(minFareMinor) ? minFareMinor : 0,
		maxFareMinor,
		total
	};
}

export async function findTrip(id: string): Promise<TripDetail | null> {
	const [row] = await db
		.select(SELECTION)
		.from(trip)
		.innerJoin(operator, eq(operator.id, trip.operatorId))
		.innerJoin(originPlace, eq(originPlace.id, trip.originPlaceId))
		.innerJoin(destinationPlace, eq(destinationPlace.id, trip.destinationPlaceId))
		.innerJoin(originStop, eq(originStop.id, trip.originStopId))
		.innerJoin(destinationStop, eq(destinationStop.id, trip.destinationStopId))
		.where(eq(trip.id, id))
		.limit(1);

	if (!row) return null;

	const summary = toSummary(row);
	if (!summary) return null;

	const [routeRow] = await db.select().from(route).where(eq(route.id, row.trip.routeId)).limit(1);
	const calls = await buildCalls(row, routeRow?.durationMinutes ?? summary.durationMinutes);

	return { ...summary, distanceKm: routeRow?.distanceKm ?? 0, calls };
}

async function buildCalls(row: JoinedTrip, durationMinutes: number): Promise<TripCall[]> {
	const intermediate = await db
		.select({ routeStop, stop })
		.from(routeStop)
		.innerJoin(stop, eq(stop.id, routeStop.stopId))
		.where(eq(routeStop.routeId, row.trip.routeId))
		.orderBy(asc(routeStop.sequence));

	const calls: TripCall[] = [
		{
			sequence: 0,
			stop: {
				id: row.originStop.id,
				name: row.originStop.name,
				code: row.originStop.code,
				placeName: row.origin.name
			},
			arriveAt: row.trip.departAt,
			departAt: row.trip.departAt
		}
	];

	for (const entry of intermediate) {
		const arriveAt = row.trip.departAt + entry.routeStop.offsetMinutes * 60_000;
		calls.push({
			sequence: entry.routeStop.sequence,
			stop: {
				id: entry.stop.id,
				name: entry.stop.name,
				code: entry.stop.code,
				placeName: entry.stop.name
			},
			arriveAt,
			departAt: arriveAt + entry.routeStop.dwellMinutes * 60_000
		});
	}

	calls.push({
		sequence: intermediate.length + 1,
		stop: {
			id: row.destinationStop.id,
			name: row.destinationStop.name,
			code: row.destinationStop.code,
			placeName: row.destination.name
		},
		arriveAt: row.trip.departAt + durationMinutes * 60_000,
		departAt: row.trip.departAt + durationMinutes * 60_000
	});

	return calls;
}
