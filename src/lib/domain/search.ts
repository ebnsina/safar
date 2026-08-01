import * as v from 'valibot';
import { TRANSPORT_MODES } from './modes';

/** Departure bands travellers filter by, in local time. */
export const DEPARTURE_WINDOWS = [
	{ id: 'early', label: 'Before 6 am', fromHour: 0, toHour: 6 },
	{ id: 'morning', label: '6 am – 12 pm', fromHour: 6, toHour: 12 },
	{ id: 'afternoon', label: '12 pm – 6 pm', fromHour: 12, toHour: 18 },
	{ id: 'evening', label: 'After 6 pm', fromHour: 18, toHour: 24 }
] as const;

export type DepartureWindowId = (typeof DEPARTURE_WINDOWS)[number]['id'];

export const SORT_OPTIONS = [
	{ id: 'departure', label: 'Departure time' },
	{ id: 'price_asc', label: 'Lowest fare' },
	{ id: 'price_desc', label: 'Highest fare' },
	{ id: 'duration', label: 'Shortest journey' },
	{ id: 'rating', label: 'Best rated' }
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]['id'];

export const MAX_PASSENGERS = 9;
export const RESULTS_PER_PAGE = 20;

const placeId = v.pipe(
	v.string(),
	v.trim(),
	v.nonEmpty('Choose where you are travelling from and to.'),
	v.maxLength(64),
	v.regex(/^[a-z0-9-]+$/, 'That place is not one we recognise.')
);

const calendarDate = v.pipe(
	v.string(),
	v.trim(),
	v.regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a travel date.')
);

/** The search a traveller submits. Shared by the form preflight and the server query. */
export const SearchQuerySchema = v.pipe(
	v.object({
		mode: v.picklist(TRANSPORT_MODES, 'Choose bus, train or flight.'),
		origin: placeId,
		destination: placeId,
		date: calendarDate,
		passengers: v.pipe(
			v.number('Choose how many are travelling.'),
			v.integer(),
			v.minValue(1, 'At least one traveller is needed.'),
			v.maxValue(MAX_PASSENGERS, `We can book up to ${MAX_PASSENGERS} travellers at once.`)
		)
	}),
	v.forward(
		v.partialCheck(
			[['origin'], ['destination']],
			(input) => input.origin !== input.destination,
			'Choose two different places.'
		),
		['destination']
	)
);

export type SearchQuery = v.InferOutput<typeof SearchQuerySchema>;

const WINDOW_IDS = DEPARTURE_WINDOWS.map((w) => w.id) as unknown as DepartureWindowId[];
const SORT_IDS = SORT_OPTIONS.map((s) => s.id) as unknown as SortId[];

const slug = v.pipe(v.string(), v.trim(), v.maxLength(64));

export const SearchFiltersSchema = v.object({
	operators: v.optional(v.pipe(v.array(slug), v.maxLength(40)), []),
	classes: v.optional(v.pipe(v.array(slug), v.maxLength(20)), []),
	windows: v.optional(v.array(v.picklist(WINDOW_IDS)), []),
	maxFareMinor: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
	minRating: v.optional(v.pipe(v.number(), v.minValue(0), v.maxValue(50))),
	sort: v.optional(v.picklist(SORT_IDS), 'departure'),
	page: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(500)), 1)
});

export type SearchFilters = v.InferOutput<typeof SearchFiltersSchema>;

export const SearchRequestSchema = v.object({
	query: SearchQuerySchema,
	filters: v.optional(SearchFiltersSchema, {})
});

export type SearchRequest = v.InferOutput<typeof SearchRequestSchema>;

export function windowById(id: DepartureWindowId) {
	return DEPARTURE_WINDOWS.find((w) => w.id === id);
}
