import { createClient, type Client } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../db/schema';

/**
 * Standalone client for CLI seeding. The app itself goes through `$app/env/private`,
 * which is only available inside the SvelteKit runtime.
 */
export function createSeedClient() {
	const url = process.env.DATABASE_URL;
	if (!url) throw new Error('DATABASE_URL is not set — run with `--env-file=.env`');

	const authToken = process.env.DATABASE_AUTH_TOKEN;
	const isRemote = !url.startsWith('file:');
	if (isRemote && !authToken) {
		throw new Error('DATABASE_AUTH_TOKEN is required for a remote libSQL database');
	}

	const client: Client = createClient({ url, ...(isRemote ? { authToken } : {}) });
	return { client, db: drizzle(client, { schema }), isRemote };
}
