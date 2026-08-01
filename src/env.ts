import { defineEnvVars } from '@sveltejs/kit/env';
import * as v from 'valibot';

const required = v.pipe(v.string('This variable must be set.'), v.trim(), v.nonEmpty());

export const variables = defineEnvVars({
	DATABASE_URL: {
		description:
			'libSQL connection string — `file:local.db` in development, `libsql://…` for Turso.',
		schema: v.pipe(required, v.regex(/^(file:|libsql:|https?:)/, 'Must be a libSQL URL.'))
	},
	DATABASE_AUTH_TOKEN: {
		description: 'Turso auth token. Empty for a local file database, required for a remote one.',
		schema: v.pipe(v.optional(v.string(), ''), v.trim())
	},
	PUBLIC_SITE_URL: {
		public: true,
		description:
			'Absolute origin of this deployment. Used for canonical links and Open Graph tags.',
		schema: v.pipe(required, v.url('Must be an absolute URL, e.g. https://safar.app'))
	}
});
