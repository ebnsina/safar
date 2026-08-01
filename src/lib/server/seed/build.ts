import { liesBetween, networkDistanceKm, travelMinutes } from '#lib/domain/geo';
import { getLayout } from '#lib/domain/layouts';
import type { TransportMode } from '#lib/domain/modes';
import { baseFareMinor, demandMultiplier } from '#lib/domain/pricing';
import { createRandom, hashString, type RandomSource } from '#lib/domain/random';
import { totalCapacity } from '#lib/domain/seating';
import { BD_AIRPORTS, BD_AIR_ROUTES } from './catalog/bd/flights';
import { BD_BUS_CORRIDORS, busFrequency } from './catalog/bd/network';
import { BD_AIRLINES, BD_BUS_OPERATORS, type OperatorSeed } from './catalog/bd/operators';
import { BD_PLACES, type PlaceSeed } from './catalog/bd/places';
import { busTerminalNames, railStationName, BD_RAIL_STATIONS } from './catalog/bd/stations';
import { BD_TRAIN_SERVICES } from './catalog/bd/trains';

/** Asia/Dhaka is a fixed UTC+6 offset with no daylight saving, so the maths stays exact. */
const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000;

const REGION = 'BD';
const CURRENCY = 'BDT';

export interface PlaceRow {
	id: string;
	region: string;
	name: string;
	nameLocal: string | null;
	division: string;
	latitude: number;
	longitude: number;
	popularity: number;
}

export interface StopRow {
	id: string;
	placeId: string;
	mode: TransportMode;
	name: string;
	code: string | null;
	address: string | null;
	latitude: number;
	longitude: number;
}

export interface OperatorRow {
	id: string;
	mode: TransportMode;
	name: string;
	code: string;
	rating: number;
	ratingCount: number;
	foundedYear: number | null;
	amenities: string[];
}

export interface RouteRow {
	id: string;
	mode: TransportMode;
	originPlaceId: string;
	destinationPlaceId: string;
	distanceKm: number;
	durationMinutes: number;
}

export interface RouteStopRow {
	routeId: string;
	sequence: number;
	stopId: string;
	offsetMinutes: number;
	dwellMinutes: number;
}

export interface TripRow {
	id: string;
	code: string;
	mode: TransportMode;
	routeId: string;
	operatorId: string;
	layoutId: string;
	originPlaceId: string;
	destinationPlaceId: string;
	originStopId: string;
	destinationStopId: string;
	departAt: number;
	arriveAt: number;
	durationMinutes: number;
	departDate: string;
	baseFareMinor: number;
	currency: string;
	seed: number;
	occupancy: number;
	seatsTotal: number;
	seatsAvailable: number;
}

export interface SeedData {
	places: PlaceRow[];
	stops: StopRow[];
	operators: OperatorRow[];
	routes: RouteRow[];
	routeStops: RouteStopRow[];
	trips: TripRow[];
}

/** A timetabled departure, reused across every day the service runs. */
interface Service {
	routeId: string;
	operatorId: string;
	layoutId: string;
	code: string;
	/** Minutes after local midnight. */
	departMinutes: number;
	fareIndex: number;
	offDay?: number;
}

const placeById = new Map(BD_PLACES.map((p) => [p.id, p]));

function localMidnightUtc(dayIndex: number, from: number): number {
	const startOfDay = Math.floor((from + DHAKA_OFFSET_MS) / 86_400_000) * 86_400_000;
	return startOfDay - DHAKA_OFFSET_MS + dayIndex * 86_400_000;
}

function calendarDate(instant: number): string {
	return new Date(instant + DHAKA_OFFSET_MS).toISOString().slice(0, 10);
}

function localWeekday(instant: number): number {
	return new Date(instant + DHAKA_OFFSET_MS).getUTCDay();
}

function parseClock(value: string): number {
	const [hours, minutes] = value.split(':').map(Number);
	return hours * 60 + minutes;
}

/** Spreads `count` departures across the plausible operating window for the corridor. */
function spreadDepartures(count: number, longHaul: boolean, random: RandomSource): number[] {
	const windows: [number, number][] = longHaul
		? [
				[6 * 60, 10 * 60],
				[10 * 60, 16 * 60],
				[20 * 60, 24 * 60 + 90]
			]
		: [
				[6 * 60, 12 * 60],
				[12 * 60, 20 * 60]
			];

	const times = new Set<number>();
	let guard = 0;
	while (times.size < count && guard++ < count * 20) {
		const [start, end] = windows[times.size % windows.length];
		const minute = Math.round(random.normal(start, end) / 5) * 5;
		times.add(minute % (24 * 60));
	}
	return [...times].sort((a, b) => a - b);
}

function buildPlaces(): PlaceRow[] {
	return BD_PLACES.map((place) => ({
		id: place.id,
		region: REGION,
		name: place.name,
		nameLocal: place.nameLocal,
		division: place.division,
		latitude: place.latitude,
		longitude: place.longitude,
		popularity: place.popularity
	}));
}

function buildStops(): StopRow[] {
	const stops: StopRow[] = [];

	for (const place of BD_PLACES) {
		busTerminalNames(place.id, place.name).forEach((name, index) => {
			stops.push({
				id: `${place.id}-bus-${index + 1}`,
				placeId: place.id,
				mode: 'bus',
				name,
				code: null,
				address: `${name}, ${place.name}`,
				// Nudge each counter off the city centre so map positions are not identical.
				latitude: place.latitude + index * 0.008,
				longitude: place.longitude + index * 0.008
			});
		});

		if (BD_RAIL_STATIONS[place.id]) {
			stops.push({
				id: `${place.id}-rail`,
				placeId: place.id,
				mode: 'train',
				name: railStationName(place.id, place.name),
				code: place.id.slice(0, 3).toUpperCase(),
				address: `${place.name}, ${place.division}`,
				latitude: place.latitude,
				longitude: place.longitude
			});
		}
	}

	for (const airport of BD_AIRPORTS) {
		const place = placeById.get(airport.placeId);
		if (!place) continue;
		stops.push({
			id: `${airport.placeId}-air`,
			placeId: airport.placeId,
			mode: 'air',
			name: airport.name,
			code: airport.iata,
			address: `${place.name}, ${place.division}`,
			latitude: airport.latitude,
			longitude: airport.longitude
		});
	}

	return stops;
}

function toOperatorRow(seed: OperatorSeed): OperatorRow {
	return {
		id: seed.id,
		mode: seed.mode,
		name: seed.name,
		code: seed.code,
		rating: seed.rating,
		ratingCount: seed.ratingCount,
		foundedYear: seed.foundedYear,
		amenities: seed.amenities
	};
}

function buildOperators(): OperatorRow[] {
	const trains: OperatorRow[] = BD_TRAIN_SERVICES.map((service) => ({
		id: service.id,
		mode: 'train',
		name: service.name,
		code: service.numbers[0],
		rating: service.rating,
		ratingCount: service.ratingCount,
		foundedYear: null,
		amenities: ['Bangladesh Railway', 'Onboard catering', 'Reserved seating', 'Luggage van']
	}));

	return [...BD_BUS_OPERATORS.map(toOperatorRow), ...BD_AIRLINES.map(toOperatorRow), ...trains];
}

/** Every ordered city pair a bus corridor implies, de-duplicated. */
function busPairs(): [string, string][] {
	const pairs = new Set<string>();

	for (const place of BD_PLACES) {
		if (place.id !== 'dhaka') {
			pairs.add(`dhaka|${place.id}`);
			pairs.add(`${place.id}|dhaka`);
		}
	}

	for (const [hub, spokes] of Object.entries(BD_BUS_CORRIDORS)) {
		for (const spoke of spokes) {
			if (!placeById.has(spoke) || hub === spoke) continue;
			pairs.add(`${hub}|${spoke}`);
			pairs.add(`${spoke}|${hub}`);
		}
	}

	return [...pairs].map((pair) => pair.split('|') as [string, string]);
}

/**
 * Picks realistic intermediate calls: only places that sit almost exactly on the
 * straight line between the endpoints, preferring the busiest of them.
 */
function intermediateStops(
	mode: TransportMode,
	origin: PlaceSeed,
	destination: PlaceSeed,
	stopByPlace: Map<string, StopRow>,
	limit: number
): PlaceSeed[] {
	const onCorridor = BD_PLACES.filter(
		(candidate) =>
			candidate.id !== origin.id &&
			candidate.id !== destination.id &&
			stopByPlace.has(candidate.id) &&
			liesBetween(origin, destination, candidate, 1.05)
	);

	return onCorridor
		.sort((a, b) => b.popularity - a.popularity)
		.slice(0, limit)
		.sort((a, b) => networkDistanceKm(mode, origin, a) - networkDistanceKm(mode, origin, b));
}

interface RouteBuild {
	routes: RouteRow[];
	routeStops: RouteStopRow[];
	services: Service[];
}

function buildBusNetwork(stops: StopRow[]): RouteBuild {
	const routes: RouteRow[] = [];
	const routeStops: RouteStopRow[] = [];
	const services: Service[] = [];

	const terminalsByPlace = new Map<string, StopRow[]>();
	for (const stop of stops) {
		if (stop.mode !== 'bus') continue;
		const list = terminalsByPlace.get(stop.placeId) ?? [];
		list.push(stop);
		terminalsByPlace.set(stop.placeId, list);
	}
	const primaryTerminal = new Map(
		[...terminalsByPlace].map(([placeId, list]) => [placeId, list[0]])
	);

	const numbering = new Map<string, number>();

	for (const [originId, destinationId] of busPairs()) {
		const origin = placeById.get(originId);
		const destination = placeById.get(destinationId);
		if (!origin || !destination) continue;

		const distanceKm = networkDistanceKm('bus', origin, destination);
		if (distanceKm < 30) continue;

		const durationMinutes = travelMinutes('bus', distanceKm);
		const routeId = `bus-${originId}-${destinationId}`;
		routes.push({
			id: routeId,
			mode: 'bus',
			originPlaceId: originId,
			destinationPlaceId: destinationId,
			distanceKm,
			durationMinutes
		});

		const vias = intermediateStops('bus', origin, destination, primaryTerminal, 3);
		vias.forEach((via, index) => {
			const stop = primaryTerminal.get(via.id);
			if (!stop) return;
			const share = networkDistanceKm('bus', origin, via) / distanceKm;
			routeStops.push({
				routeId,
				sequence: index + 1,
				stopId: stop.id,
				offsetMinutes: Math.round((durationMinutes * share) / 5) * 5,
				dwellMinutes: 10
			});
		});

		const random = createRandom(routeId);
		const longHaul = distanceKm > 220;
		const frequency = busFrequency(Math.max(origin.popularity, destination.popularity));
		const eligible = BD_BUS_OPERATORS.filter((operator) =>
			longHaul ? operator.fareIndex >= 0.8 : operator.fareIndex <= 1.25
		);
		const chosen = random.sample(eligible, Math.min(frequency, eligible.length));

		spreadDepartures(frequency, longHaul, random).forEach((departMinutes, index) => {
			const operator = chosen[index % chosen.length];
			const next = (numbering.get(operator.id) ?? 400) + 1;
			numbering.set(operator.id, next);

			services.push({
				routeId,
				operatorId: operator.id,
				layoutId: random.pick(operator.layouts),
				code: `${operator.code}-${next}`,
				departMinutes,
				fareIndex: operator.fareIndex
			});
		});
	}

	return { routes, routeStops, services };
}

function buildTrainNetwork(stops: StopRow[]): RouteBuild {
	const routes: RouteRow[] = [];
	const routeStops: RouteStopRow[] = [];
	const services: Service[] = [];

	const stationByPlace = new Map(
		stops.filter((stop) => stop.mode === 'train').map((stop) => [stop.placeId, stop])
	);
	const seenRoutes = new Set<string>();

	for (const service of BD_TRAIN_SERVICES) {
		const directions: [string, string, string[], string][] = [
			[service.origin, service.destination, service.departTimes, service.numbers[0]],
			[service.destination, service.origin, service.returnTimes, service.numbers[1]]
		];

		for (const [originId, destinationId, times, number] of directions) {
			const origin = placeById.get(originId);
			const destination = placeById.get(destinationId);
			if (!origin || !destination) continue;
			if (!stationByPlace.has(originId) || !stationByPlace.has(destinationId)) continue;

			const routeId = `train-${originId}-${destinationId}`;
			if (!seenRoutes.has(routeId)) {
				seenRoutes.add(routeId);
				const distanceKm = networkDistanceKm('train', origin, destination);
				const durationMinutes = travelMinutes('train', distanceKm);
				routes.push({
					id: routeId,
					mode: 'train',
					originPlaceId: originId,
					destinationPlaceId: destinationId,
					distanceKm,
					durationMinutes
				});

				intermediateStops('train', origin, destination, stationByPlace, 4).forEach((via, index) => {
					const stop = stationByPlace.get(via.id);
					if (!stop) return;
					const share = networkDistanceKm('train', origin, via) / distanceKm;
					routeStops.push({
						routeId,
						sequence: index + 1,
						stopId: stop.id,
						offsetMinutes: Math.round((durationMinutes * share) / 5) * 5,
						dwellMinutes: 5
					});
				});
			}

			times.forEach((time, index) => {
				services.push({
					routeId,
					operatorId: service.id,
					layoutId: service.layoutId,
					code: index === 0 ? number : `${number}${String.fromCharCode(64 + index)}`,
					departMinutes: parseClock(time),
					fareIndex: service.fareIndex,
					offDay: service.offDay
				});
			});
		}
	}

	return { routes, routeStops, services };
}

function buildAirNetwork(stops: StopRow[]): RouteBuild {
	const routes: RouteRow[] = [];
	const services: Service[] = [];

	const airportByPlace = new Map(
		stops.filter((stop) => stop.mode === 'air').map((stop) => [stop.placeId, stop])
	);
	const airlineById = new Map(BD_AIRLINES.map((airline) => [airline.id, airline]));
	const numbering = new Map<string, number>();

	for (const sector of BD_AIR_ROUTES) {
		for (const [originId, destinationId] of [
			[sector.origin, sector.destination],
			[sector.destination, sector.origin]
		]) {
			const origin = placeById.get(originId);
			const destination = placeById.get(destinationId);
			if (!origin || !destination) continue;
			if (!airportByPlace.has(originId) || !airportByPlace.has(destinationId)) continue;

			const distanceKm = networkDistanceKm('air', origin, destination);
			const durationMinutes = travelMinutes('air', distanceKm);
			const routeId = `air-${originId}-${destinationId}`;
			routes.push({
				id: routeId,
				mode: 'air',
				originPlaceId: originId,
				destinationPlaceId: destinationId,
				distanceKm,
				durationMinutes
			});

			const random = createRandom(routeId);
			// Flights cluster into morning, midday and evening banks.
			const departures = spreadDepartures(sector.dailyFrequency, false, random);

			departures.forEach((departMinutes, index) => {
				const airline = airlineById.get(sector.airlines[index % sector.airlines.length]);
				if (!airline) return;
				const next = (numbering.get(airline.id) ?? 100) + 1;
				numbering.set(airline.id, next);

				services.push({
					routeId,
					operatorId: airline.id,
					layoutId: random.pick(airline.layouts),
					code: `${airline.code}-${next}`,
					departMinutes,
					fareIndex: airline.fareIndex
				});
			});
		}
	}

	return { routes, routeStops: [], services };
}

interface TripBuildInput {
	routes: RouteRow[];
	services: Service[];
	stops: StopRow[];
	days: number;
	now: number;
}

function buildTrips({ routes, services, stops, days, now }: TripBuildInput): TripRow[] {
	const routeById = new Map(routes.map((route) => [route.id, route]));
	const originStop = new Map<string, StopRow>();
	for (const stop of stops) {
		const key = `${stop.placeId}:${stop.mode}`;
		if (!originStop.has(key)) originStop.set(key, stop);
	}

	const trips: TripRow[] = [];

	for (const service of services) {
		const route = routeById.get(service.routeId);
		if (!route) continue;

		const layout = getLayout(service.layoutId);
		if (!layout) continue;
		const seatsTotal = totalCapacity(layout);

		const from = originStop.get(`${route.originPlaceId}:${route.mode}`);
		const to = originStop.get(`${route.destinationPlaceId}:${route.mode}`);
		if (!from || !to) continue;

		for (let day = 0; day < days; day++) {
			const departAt = localMidnightUtc(day, now) + service.departMinutes * 60_000;
			if (departAt <= now) continue;

			const weekday = localWeekday(departAt);
			if (service.offDay !== undefined && weekday === service.offDay) continue;

			const departDate = calendarDate(departAt);
			const id = `${service.routeId}#${service.code}#${departDate}`;
			const seed = hashString(id);
			const random = createRandom(seed);

			const hour = Math.floor(service.departMinutes / 60) % 24;
			const daysAhead = Math.floor((departAt - now) / 86_400_000);
			const multiplier = demandMultiplier({ daysAhead, weekday, hour });

			const occupancy = Math.min(
				0.94,
				Math.max(0.08, random.normal(0.2, 0.75) * (multiplier > 1.1 ? 1.2 : 1))
			);

			trips.push({
				id,
				code: service.code,
				mode: route.mode,
				routeId: route.id,
				operatorId: service.operatorId,
				layoutId: service.layoutId,
				originPlaceId: route.originPlaceId,
				destinationPlaceId: route.destinationPlaceId,
				originStopId: from.id,
				destinationStopId: to.id,
				departAt,
				arriveAt: departAt + route.durationMinutes * 60_000,
				durationMinutes: route.durationMinutes,
				departDate,
				baseFareMinor:
					Math.round(
						(baseFareMinor(route.mode, route.distanceKm, service.fareIndex) * multiplier) / 100
					) * 100,
				currency: CURRENCY,
				seed,
				occupancy,
				seatsTotal,
				seatsAvailable: Math.round(seatsTotal * (1 - occupancy))
			});
		}
	}

	return trips;
}

export interface BuildOptions {
	/** How many days of departures to generate. */
	days: number;
	/** Reference instant; trips before it are skipped. */
	now: number;
}

export function buildSeedData({ days, now }: BuildOptions): SeedData {
	const places = buildPlaces();
	const stops = buildStops();
	const operators = buildOperators();

	const networks = [buildBusNetwork(stops), buildTrainNetwork(stops), buildAirNetwork(stops)];
	const routes = networks.flatMap((n) => n.routes);
	const routeStops = networks.flatMap((n) => n.routeStops);
	const services = networks.flatMap((n) => n.services);

	const trips = buildTrips({ routes, services, stops, days, now });

	return { places, stops, operators, routes, routeStops, trips };
}
