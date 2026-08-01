import { drizzle } from 'drizzle-orm/libsql';
import { DATABASE_AUTH_TOKEN, DATABASE_URL } from '$app/env/private';
import * as schema from './schema';

const isRemote = !DATABASE_URL.startsWith('file:');

// A local file database has no auth; a remote one must never run without a token.
if (isRemote && !DATABASE_AUTH_TOKEN) {
	throw new Error('DATABASE_AUTH_TOKEN is required for a remote libSQL database');
}

/**
 * The web client speaks HTTP only, so a serverless deployment never has to ship the
 * native libSQL binding. The node client is used locally, where `file:` needs it.
 */
const { createClient } = isRemote
	? await import('@libsql/client/web')
	: await import('@libsql/client');

const client = createClient({
	url: DATABASE_URL,
	...(isRemote ? { authToken: DATABASE_AUTH_TOKEN } : {})
});

export const db = drizzle(client, { schema });

export type Database = typeof db;
