import * as v from 'valibot';
import type { TransportMode } from './modes';
import {
	SearchFiltersSchema,
	SearchQuerySchema,
	type SearchFilters,
	type SearchQuery
} from './search';

/** Query-string keys, kept short so shared links stay readable. */
const KEYS = {
	from: 'from',
	to: 'to',
	date: 'date',
	passengers: 'pax',
	operators: 'op',
	classes: 'cls',
	windows: 'win',
	maxFare: 'max',
	minRating: 'rating',
	sort: 'sort',
	page: 'page'
} as const;

const list = (value: string | null) =>
	value
		? value
				.split(',')
				.map((entry) => entry.trim())
				.filter(Boolean)
		: [];

const numberOrUndefined = (value: string | null) => {
	if (value === null || value.trim() === '') return undefined;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : undefined;
};

export interface ParsedSearch {
	query: SearchQuery;
	filters: SearchFilters;
}

/**
 * Reads a results URL. Returns `null` when the essentials are missing or invalid,
 * which the page renders as an empty search rather than an error.
 */
export function parseSearchUrl(
	mode: TransportMode,
	params: Pick<URLSearchParams, 'get'>
): ParsedSearch | null {
	const query = v.safeParse(SearchQuerySchema, {
		mode,
		origin: params.get(KEYS.from) ?? '',
		destination: params.get(KEYS.to) ?? '',
		date: params.get(KEYS.date) ?? '',
		passengers: numberOrUndefined(params.get(KEYS.passengers)) ?? 1
	});

	if (!query.success) return null;

	// Unknown or malformed filter values fall back to defaults instead of failing the page.
	const filters = v.safeParse(SearchFiltersSchema, {
		operators: list(params.get(KEYS.operators)),
		classes: list(params.get(KEYS.classes)),
		windows: list(params.get(KEYS.windows)),
		maxFareMinor: numberOrUndefined(params.get(KEYS.maxFare)),
		minRating: numberOrUndefined(params.get(KEYS.minRating)),
		sort: params.get(KEYS.sort) ?? undefined,
		page: numberOrUndefined(params.get(KEYS.page)) ?? 1
	});

	return {
		query: query.output,
		filters: filters.success ? filters.output : v.parse(SearchFiltersSchema, {})
	};
}

export function buildSearchPath(query: SearchQuery, filters?: Partial<SearchFilters>): string {
	const params = new URLSearchParams();
	params.set(KEYS.from, query.origin);
	params.set(KEYS.to, query.destination);
	params.set(KEYS.date, query.date);
	if (query.passengers > 1) params.set(KEYS.passengers, String(query.passengers));

	if (filters?.operators?.length) params.set(KEYS.operators, filters.operators.join(','));
	if (filters?.classes?.length) params.set(KEYS.classes, filters.classes.join(','));
	if (filters?.windows?.length) params.set(KEYS.windows, filters.windows.join(','));
	if (filters?.maxFareMinor !== undefined) params.set(KEYS.maxFare, String(filters.maxFareMinor));
	if (filters?.minRating !== undefined) params.set(KEYS.minRating, String(filters.minRating));
	if (filters?.sort && filters.sort !== 'departure') params.set(KEYS.sort, filters.sort);
	if (filters?.page && filters.page > 1) params.set(KEYS.page, String(filters.page));

	return `/search/${query.mode}?${params}`;
}
