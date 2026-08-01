import { defineConfig } from 'drizzle-kit';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

const isRemote = !url.startsWith('file:');
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (isRemote && !authToken) {
	throw new Error('DATABASE_AUTH_TOKEN is required for a remote libSQL database');
}

// A local file database needs no auth, so it uses the plain sqlite dialect.
export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	verbose: true,
	strict: true,
	...(isRemote
		? { dialect: 'turso' as const, dbCredentials: { url, authToken } }
		: { dialect: 'sqlite' as const, dbCredentials: { url } })
});
