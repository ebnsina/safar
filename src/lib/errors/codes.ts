/**
 * Every failure the app can surface. Each message says what went wrong and what to do
 * next, in one sentence, with no technical detail.
 */
export const ERROR_CATALOG = {
	NOT_FOUND: {
		status: 404,
		title: 'Page not found',
		message: 'This page has moved or no longer exists — start again from the search.'
	},
	TRIP_NOT_FOUND: {
		status: 404,
		title: 'Journey not listed',
		message: 'This journey has departed or been withdrawn — search again for current times.'
	},
	BOOKING_NOT_FOUND: {
		status: 404,
		title: 'Booking not found',
		message: 'No booking matches that reference and email — check both and try again.'
	},
	ROUTE_NOT_SERVED: {
		status: 404,
		title: 'Route not served',
		message: 'Nobody runs this route yet — try a nearby city.'
	},
	INVALID_SEARCH: {
		status: 400,
		title: 'Search needs checking',
		message: 'Something in this search is missing — check the places and date, then search again.'
	},
	INVALID_INPUT: {
		status: 400,
		title: 'Details need checking',
		message: 'Some details are not valid — correct the marked fields and continue.'
	},
	SEATS_UNAVAILABLE: {
		status: 409,
		title: 'Seats taken',
		message: 'Someone booked those seats first — choose different ones to continue.'
	},
	HOLD_EXPIRED: {
		status: 410,
		title: 'Hold expired',
		message: 'We held your seats for ten minutes and that time has passed — choose them again.'
	},
	PAYMENT_DECLINED: {
		status: 402,
		title: 'Payment not completed',
		message:
			'The payment did not go through and no money was taken — try again or use another card.'
	},
	TOO_MANY_REQUESTS: {
		status: 429,
		title: 'Too many attempts',
		message: 'That has been tried several times in a row — wait a moment, then try again.'
	},
	UNAVAILABLE: {
		status: 503,
		title: 'Booking unavailable',
		message: 'Booking is down for a moment — try again shortly.'
	},
	UNKNOWN: {
		status: 500,
		title: 'Something went wrong',
		message: 'That did not finish — try again.'
	}
} as const;

export type ErrorCode = keyof typeof ERROR_CATALOG;

export function describeError(code: ErrorCode) {
	return ERROR_CATALOG[code];
}

export function isErrorCode(value: unknown): value is ErrorCode {
	return typeof value === 'string' && value in ERROR_CATALOG;
}
