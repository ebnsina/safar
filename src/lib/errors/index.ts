import { error } from '@sveltejs/kit';
import { describeError, isErrorCode, type ErrorCode } from './codes';

export { ERROR_CATALOG, describeError, isErrorCode, type ErrorCode } from './codes';

/** Builds the payload `+error.svelte` renders — never includes internals. */
export function appError(code: ErrorCode, detail?: string): App.Error {
	const { status, title, message } = describeError(code);
	return { code, status, title, message, ...(detail ? { detail } : {}) };
}

/** Throws a SvelteKit error carrying a catalog code — the only way this app raises failures. */
export function raise(code: ErrorCode, detail?: string): never {
	error(describeError(code).status, appError(code, detail));
}

/** Normalises anything thrown anywhere into the shape `+error.svelte` renders. */
export function toAppError(cause: unknown, fallback: ErrorCode = 'UNKNOWN'): App.Error {
	if (cause && typeof cause === 'object' && 'code' in cause && isErrorCode(cause.code)) {
		return cause as App.Error;
	}
	return appError(fallback);
}
