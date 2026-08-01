import type { TransportMode } from './modes';

/** All figures are minor units (paisa). */
const RATE_PER_KM: Record<TransportMode, number> = { bus: 220, train: 150, air: 900 };
const FIXED_COMPONENT: Record<TransportMode, number> = { bus: 5_000, train: 4_000, air: 200_000 };
const MINIMUM_FARE: Record<TransportMode, number> = { bus: 15_000, train: 12_000, air: 250_000 };

/** Distance-based fare before class, operator and demand adjustments. */
export function baseFareMinor(mode: TransportMode, distanceKm: number, fareIndex = 1): number {
	const raw = FIXED_COMPONENT[mode] + RATE_PER_KM[mode] * distanceKm;
	const adjusted = Math.max(raw, MINIMUM_FARE[mode]) * fareIndex;
	// Whole currency units keep quoted fares tidy.
	return Math.round(adjusted / 100) * 100;
}

export interface DemandInput {
	/** Days between booking and departure — scarcity lifts the fare near departure. */
	daysAhead: number;
	/** 0 = Sunday. Thursday and Friday travel peaks in Bangladesh. */
	weekday: number;
	/** Departure hour, 0–23. */
	hour: number;
}

export function demandMultiplier({ daysAhead, weekday, hour }: DemandInput): number {
	let multiplier = 1;

	if (daysAhead <= 1) multiplier *= 1.22;
	else if (daysAhead <= 3) multiplier *= 1.14;
	else if (daysAhead <= 7) multiplier *= 1.06;
	else if (daysAhead >= 40) multiplier *= 0.93;

	if (weekday === 4 || weekday === 5) multiplier *= 1.09;
	if (weekday === 6) multiplier *= 1.04;

	// Overnight and early-morning departures are cheaper than prime daytime slots.
	if (hour >= 23 || hour < 5) multiplier *= 0.94;
	else if (hour >= 7 && hour <= 10) multiplier *= 1.05;

	return multiplier;
}

const SERVICE_CHARGE_RATE = 0.025;
const MINIMUM_SERVICE_CHARGE = 2_000;

export interface FareBreakdown {
	fareMinor: number;
	feesMinor: number;
	totalMinor: number;
}

/** Booking fee applied once per booking, not per passenger. */
export function priceBooking(seatFaresMinor: number[]): FareBreakdown {
	const fareMinor = seatFaresMinor.reduce((sum, fare) => sum + fare, 0);
	const feesMinor = Math.max(
		MINIMUM_SERVICE_CHARGE,
		Math.round((fareMinor * SERVICE_CHARGE_RATE) / 100) * 100
	);
	return { fareMinor, feesMinor, totalMinor: fareMinor + feesMinor };
}
