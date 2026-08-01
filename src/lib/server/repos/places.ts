import { and, desc, eq, inArray, like, sql } from 'drizzle-orm';
import type { TransportMode } from '#lib/domain/modes';
import type { PlaceView } from '#lib/domain/trip';
import { db } from '../db';
import { place, stop } from '../db/schema';

const toView = (row: typeof place.$inferSelect): PlaceView => ({
	id: row.id,
	name: row.name,
	nameLocal: row.nameLocal,
	division: row.division
});

/** Only places actually served by the chosen mode may appear in the pickers. */
const servedByMode = (mode: TransportMode) =>
	sql`exists (select 1 from ${stop} where ${stop.placeId} = ${place.id} and ${stop.mode} = ${mode})`;

export async function listPopularPlaces(mode: TransportMode, limit = 8): Promise<PlaceView[]> {
	const rows = await db
		.select()
		.from(place)
		.where(servedByMode(mode))
		.orderBy(desc(place.popularity))
		.limit(limit);
	return rows.map(toView);
}

export async function searchPlaces(
	mode: TransportMode,
	term: string,
	limit = 8
): Promise<PlaceView[]> {
	const trimmed = term.trim();
	if (trimmed.length === 0) return listPopularPlaces(mode, limit);

	const rows = await db
		.select()
		.from(place)
		.where(and(servedByMode(mode), like(place.name, `${trimmed}%`)))
		.orderBy(desc(place.popularity))
		.limit(limit);

	if (rows.length >= limit) return rows.map(toView);

	// Fall back to a contains match so mid-word typing still finds the city.
	const extra = await db
		.select()
		.from(place)
		.where(and(servedByMode(mode), like(place.name, `%${trimmed}%`)))
		.orderBy(desc(place.popularity))
		.limit(limit);

	const merged = new Map(rows.concat(extra).map((row) => [row.id, row]));
	return [...merged.values()].slice(0, limit).map(toView);
}

export async function findPlace(id: string): Promise<PlaceView | null> {
	const [row] = await db.select().from(place).where(eq(place.id, id)).limit(1);
	return row ? toView(row) : null;
}

export async function findPlaces(ids: string[]): Promise<Map<string, PlaceView>> {
	if (ids.length === 0) return new Map();
	const rows = await db.select().from(place).where(inArray(place.id, ids));
	return new Map(rows.map((row) => [row.id, toView(row)]));
}
