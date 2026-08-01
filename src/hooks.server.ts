import type { HandleServerError, HandleValidationError } from '@sveltejs/kit';
import { appError, toAppError } from '#lib/errors';

/** Unexpected throws are logged with context but reach the traveller as catalog copy only. */
export const handleError: HandleServerError = ({ error, event, status, message }) => {
	if (status !== 404) {
		console.error(`[${event.request.method} ${event.url.pathname}]`, message, error);
	}
	return toAppError(error, status === 404 ? 'NOT_FOUND' : 'UNKNOWN');
};

/** Rejected remote-function input never leaks field paths or schema details. */
export const handleValidationError: HandleValidationError = () => {
	return appError('INVALID_INPUT');
};
