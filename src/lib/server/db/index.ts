import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { DATABASE_AUTH_TOKEN, DATABASE_URL } from '$app/env/private';
import * as schema from './schema';

const isRemote = !DATABASE_URL.startsWith('file:');

// A local file database has no auth; a remote one must never run without a token.
if (isRemote && !DATABASE_AUTH_TOKEN) {
	throw new Error('DATABASE_AUTH_TOKEN is required for a remote libSQL database');
}

const client = createClient({
	url: DATABASE_URL,
	...(isRemote ? { authToken: DATABASE_AUTH_TOKEN } : {})
});

export const db = drizzle(client, { schema });

export type Database = typeof db;
