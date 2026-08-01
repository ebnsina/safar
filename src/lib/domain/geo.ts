export interface Coordinates {
	latitude: number;
	longitude: number;
}

const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** Great-circle distance in kilometres. */
export function haversineKm(a: Coordinates, b: Coordinates): number {
	const dLat = toRadians(b.latitude - a.latitude);
	const dLon = toRadians(b.longitude - a.longitude);
	const lat1 = toRadians(a.latitude);
	const lat2 = toRadians(b.latitude);

	const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
	return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/** Straight-line distance inflated to approximate the real network for each mode. */
const PATH_FACTOR = { bus: 1.32, train: 1.24, air: 1.02 } as const;

const AVERAGE_SPEED_KMH = { bus: 45, train: 52, air: 480 } as const;

/** Time on the ground before and after an air sector — taxi, climb and descent. */
const AIR_FIXED_MINUTES = 25;

export function networkDistanceKm(
	mode: keyof typeof PATH_FACTOR,
	a: Coordinates,
	b: Coordinates
): number {
	return Math.round(haversineKm(a, b) * PATH_FACTOR[mode]);
}

export function travelMinutes(mode: keyof typeof AVERAGE_SPEED_KMH, distanceKm: number): number {
	const cruise = (distanceKm / AVERAGE_SPEED_KMH[mode]) * 60;
	const total = mode === 'air' ? cruise + AIR_FIXED_MINUTES : cruise;
	// Round to a five-minute grid so published timetables look plausible.
	return Math.max(mode === 'air' ? 35 : 30, Math.round(total / 5) * 5);
}

/** True when `via` lies roughly on the path from `a` to `b`, within a detour tolerance. */
export function liesBetween(a: Coordinates, b: Coordinates, via: Coordinates, tolerance = 1.15) {
	const direct = haversineKm(a, b);
	if (direct === 0) return false;
	return (haversineKm(a, via) + haversineKm(via, b)) / direct <= tolerance;
}
