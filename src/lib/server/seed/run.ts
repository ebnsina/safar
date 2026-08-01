import type { SQLiteTable } from 'drizzle-orm/sqlite-core';
import { getRegion } from '#lib/config/region';
import {
	booking,
	operator,
	passenger,
	place,
	route,
	routeStop,
	stop,
	trip,
	tripSeat
} from '../db/schema';
import { buildSeedData } from './build';
import { createSeedClient } from './client';

const CHUNK_SIZE = 400;

/** Insert statements grouped into a single round trip when the database is remote. */
const STATEMENTS_PER_REQUEST = 4;

function chunk<T>(items: T[], size: number): T[][] {
	const chunks: T[][] = [];
	for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
	return chunks;
}

function parseDays(fallback: number): number {
	const flag = process.argv.find((arg) => arg.startsWith('--days='));
	const value = flag ? Number(flag.slice('--days='.length)) : NaN;
	return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

async function main() {
	const { client, db, isRemote } = createSeedClient();
	const region = getRegion();
	const days = parseDays(region.maxAdvanceDays);
	const startedAt = Date.now();

	console.log(`Building ${days} days of departures for ${region.country}…`);
	const data = buildSeedData({ days, now: startedAt });

	console.log(
		[
			`  places       ${data.places.length.toLocaleString()}`,
			`  stops        ${data.stops.length.toLocaleString()}`,
			`  operators    ${data.operators.length.toLocaleString()}`,
			`  routes       ${data.routes.length.toLocaleString()}`,
			`  route stops  ${data.routeStops.length.toLocaleString()}`,
			`  trips        ${data.trips.length.toLocaleString()}`
		].join('\n')
	);

	// Bulk load settings only apply to a local file; a remote database rejects them.
	if (!isRemote) {
		await client.execute('PRAGMA journal_mode = WAL');
		await client.execute('PRAGMA synchronous = OFF');
	}

	console.log('Clearing existing data…');
	for (const table of [
		tripSeat,
		passenger,
		booking,
		trip,
		routeStop,
		route,
		operator,
		stop,
		place
	]) {
		await db.delete(table as SQLiteTable);
	}

	const load = async <T>(name: string, table: SQLiteTable, rows: T[]) => {
		if (rows.length === 0) return;
		process.stdout.write(`Loading ${name}… `);

		const inserts = chunk(rows, CHUNK_SIZE).map((batch) =>
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			db.insert(table).values(batch as any)
		);

		// Over the network, several inserts ride in one request; locally they are cheap anyway.
		let done = 0;
		for (const group of chunk(inserts, isRemote ? STATEMENTS_PER_REQUEST : 1)) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if (group.length > 1) await db.batch(group as any);
			else await group[0];

			done += group.length * CHUNK_SIZE;
			if (isRemote && rows.length > CHUNK_SIZE * STATEMENTS_PER_REQUEST) {
				process.stdout.write(
					`\rLoading ${name}… ${Math.min(done, rows.length).toLocaleString()}/${rows.length.toLocaleString()}`
				);
			}
		}

		process.stdout.write(`\rLoading ${name}… ${rows.length.toLocaleString()} rows            \n`);
	};

	await load('places', place, data.places);
	await load('stops', stop, data.stops);
	await load('operators', operator, data.operators);
	await load('routes', route, data.routes);
	await load('route stops', routeStop, data.routeStops);
	await load('trips', trip, data.trips);

	const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
	console.log(`\nDone in ${seconds}s.`);
	client.close();
}

main().catch((error) => {
	console.error('\nSeeding failed:', error);
	process.exitCode = 1;
});
