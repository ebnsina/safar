import type { TransportMode } from './modes';

export interface OperatorView {
	id: string;
	name: string;
	code: string;
	/** Rating in tenths; divide by 10 to display. */
	rating: number;
	ratingCount: number;
	amenities: string[];
}

export interface PlaceView {
	id: string;
	name: string;
	nameLocal: string | null;
	division: string;
}

export interface StopView {
	id: string;
	name: string;
	code: string | null;
	placeName: string;
}

export interface FareOption {
	code: string;
	name: string;
	priceMinor: number;
	baggageKg: number;
	refundable: boolean;
	perks: readonly string[];
}

export interface TripSummary {
	id: string;
	code: string;
	mode: TransportMode;
	layoutId: string;
	operator: OperatorView;
	origin: PlaceView;
	destination: PlaceView;
	originStop: StopView;
	destinationStop: StopView;
	departAt: number;
	arriveAt: number;
	durationMinutes: number;
	currency: string;
	baseFareMinor: number;
	/** Cheapest class on this departure — the headline price. */
	fromFareMinor: number;
	fares: FareOption[];
	seatsTotal: number;
	seatsAvailable: number;
}

export interface TripCall {
	sequence: number;
	stop: StopView;
	arriveAt: number;
	departAt: number;
}

export interface TripDetail extends TripSummary {
	distanceKm: number;
	/** Origin, intermediate calls and destination in order. */
	calls: TripCall[];
}

export function isSoldOut(trip: TripSummary): boolean {
	return trip.seatsAvailable <= 0;
}

/** Under a tenth of the vehicle left is worth flagging to the traveller. */
export function isFillingFast(trip: TripSummary): boolean {
	return trip.seatsAvailable > 0 && trip.seatsAvailable / trip.seatsTotal <= 0.1;
}
