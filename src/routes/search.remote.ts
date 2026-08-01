import { redirect } from '@sveltejs/kit';
import { form, query } from '$app/server';
import * as v from 'valibot';
import { TRANSPORT_MODES } from '#lib/domain/modes';
import { SearchQuerySchema, SearchRequestSchema } from '#lib/domain/search';
import { buildSearchPath } from '#lib/domain/search-url';
import { raise } from '#lib/errors';
import { listPopularPlaces, searchPlaces } from '#lib/server/repos/places';
import { searchFacets, searchTrips } from '#lib/server/repos/trips';

const PlaceLookupSchema = v.object({
	mode: v.picklist(TRANSPORT_MODES),
	term: v.pipe(v.string(), v.trim(), v.maxLength(64))
});

export const placeOptions = query(PlaceLookupSchema, async ({ mode, term }) => {
	return searchPlaces(mode, term);
});

export const popularPlaces = query(v.picklist(TRANSPORT_MODES), async (mode) => {
	return listPopularPlaces(mode, 6);
});

export const tripResults = query(SearchRequestSchema, async ({ query: search, filters }) => {
	const result = await searchTrips(search, filters);
	if (result.total === 0 && result.page > 1) raise('NOT_FOUND');
	return result;
});

export const tripFacets = query(SearchRequestSchema, async ({ query: search }) => {
	return searchFacets(search);
});

/** The home page search: validated once, then handed to the results URL. */
export const startSearch = form(SearchQuerySchema, async (search) => {
	redirect(303, buildSearchPath(search));
});
