<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Meta from '#lib/components/Meta.svelte';
	import ResultsFilters from '#lib/components/search/ResultsFilters.svelte';
	import SearchPanel from '#lib/components/search/SearchPanel.svelte';
	import TripCard from '#lib/components/trip/TripCard.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import EmptyState from '#lib/components/ui/EmptyState.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { ICONS } from '#lib/components/ui/icons';
	import { describeMode, isTransportMode, type TransportMode } from '#lib/domain/modes';
	import { contentFor } from '#lib/domain/mode-content';
	import { SORT_OPTIONS, type SearchFilters } from '#lib/domain/search';
	import { buildSearchPath, parseSearchUrl } from '#lib/domain/search-url';
	import { formatCount, formatDateLong, toCalendarDate } from '#lib/format';
	import { tripFacets, tripResults } from '../../search.remote';

	const tomorrow = toCalendarDate(Date.now() + 86_400_000);

	const mode = $derived(isTransportMode(page.params.mode) ? page.params.mode : null);
	const parsed = $derived(mode ? parseSearchUrl(mode, page.url.searchParams) : null);

	const results = $derived(parsed ? tripResults(parsed) : undefined);
	const facets = $derived(parsed ? tripFacets(parsed) : undefined);

	const originPlace = $derived(results?.current?.origin ?? null);
	const destinationPlace = $derived(results?.current?.destination ?? null);
	const heading = $derived(
		originPlace && destinationPlace
			? `${originPlace.name} — ${destinationPlace.name}`
			: 'Your journey'
	);

	const cleared = {
		operators: [],
		classes: [],
		windows: [],
		maxFareMinor: undefined,
		minRating: undefined,
		page: 1
	};

	function applyFilters(next: Partial<SearchFilters>) {
		if (!parsed) return;
		// `reset: false` keeps scroll and focus put while refining filters.
		goto(buildSearchPath(parsed.query, { ...parsed.filters, ...next }), { reset: false });
	}

	/** Switching mode re-runs the same journey; filters are dropped as they are mode-specific. */
	function changeMode(next: TransportMode) {
		goto(parsed ? buildSearchPath({ ...parsed.query, mode: next }) : `/search/${next}`);
	}
</script>

<Meta
	title={parsed && originPlace && destinationPlace
		? `${originPlace.name} to ${destinationPlace.name} by ${describeMode(parsed.query.mode).label.toLowerCase()}`
		: mode
			? contentFor(mode).heading
			: 'Search journeys'}
	description={parsed
		? `Compare ${describeMode(parsed.query.mode).vehicles} on ${formatDateLong(Date.parse(parsed.query.date))}. Live seat availability and the full fare up front.`
		: mode
			? contentFor(mode).standfirst
			: undefined}
	noindex={!mode}
/>

<div class="mx-auto max-w-(--container-shell) px-(--spacing-gutter) py-10">
	{#if !mode}
		<EmptyState
			eyebrow="Not found"
			title="We do not travel that way"
			message="Choose bus, train or flight to see journeys."
		>
			{#snippet action()}
				<Button href="/" arrow>Start a search</Button>
			{/snippet}
		</EmptyState>
	{:else}
		{#if !parsed}
			{@const content = contentFor(mode)}
			<div class="max-w-(--container-measure) pt-8 pb-14">
				<p class="type-label">{describeMode(mode).label}</p>
				<h1 class="type-title mt-3">{content.heading}</h1>
				<p class="type-body mt-5 text-muted">{content.standfirst}</p>
				<ul class="mt-6 flex flex-wrap gap-x-3 gap-y-2">
					{#each content.notes as note (note)}
						<li class="type-label before:mr-3 before:content-['·'] first:before:hidden">
							{note}
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<div class="border-b border-rule pb-10">
			<SearchPanel
				{mode}
				origin={originPlace}
				destination={destinationPlace}
				date={parsed?.query.date ?? ''}
				passengers={parsed?.query.passengers ?? 1}
				onmodechange={changeMode}
			/>
		</div>

		{#if !parsed}
			{@const content = contentFor(mode)}
			<div class="py-12">
				<p class="type-label mb-4">Popular {describeMode(mode).vehicles}</p>
				<ul class="grid gap-x-12 sm:grid-cols-2">
					{#each content.corridors as corridor (corridor.label)}
						<li>
							<a
								href="/search/{mode}?from={corridor.from}&to={corridor.to}&date={tomorrow}"
								class="group flex items-center justify-between gap-4 border-b border-rule py-4 transition-transform duration-160 hover:translate-x-2.5"
							>
								<span class="text-lg text-ink" style="font-stretch: 92%;">{corridor.label}</span>
								<span class="text-faint transition-colors duration-160 group-hover:text-ink">
									<Icon icon={ICONS.forward} size={16} />
								</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{:else}
			{@const list = results?.current}
			{@const facetData = facets?.current}

			<div class="flex flex-wrap items-end justify-between gap-4 py-8">
				<div class="space-y-2">
					<p class="type-label">
						{formatDateLong(Date.parse(parsed.query.date))}
						{#if list}· {formatCount(list.total)} {list.total === 1 ? 'journey' : 'journeys'}{/if}
					</p>
					<h1 class="type-section">{heading}</h1>
				</div>

				<label class="flex items-center gap-3">
					<span class="type-label">Sort</span>
					<select
						value={parsed.filters.sort}
						onchange={(event) =>
							applyFilters({ sort: event.currentTarget.value as SearchFilters['sort'], page: 1 })}
						class="border-0 border-b border-rule-strong bg-transparent p-0 pb-1 text-sm text-ink focus:ring-0"
					>
						{#each SORT_OPTIONS as option (option.id)}
							<option value={option.id}>{option.label}</option>
						{/each}
					</select>
				</label>
			</div>

			<div class="grid gap-12 min-[900px]:grid-cols-[var(--spacing-rail)_1fr]">
				<div class="min-[900px]:sticky min-[900px]:top-8 min-[900px]:self-start">
					{#if facetData}
						<ResultsFilters facets={facetData} filters={parsed.filters} onchange={applyFilters} />
					{/if}
				</div>

				<!-- A tall floor keeps a one-result filter from collapsing the page under the filters. -->
				<div class="min-h-[70vh] min-w-0">
					{#if results?.loading && !list}
						<div class="space-y-7">
							{#each Array.from({ length: 4 }, (_, index) => index) as skeleton (skeleton)}
								<div class="h-32 animate-pulse border-b border-rule bg-surface"></div>
							{/each}
						</div>
					{:else if results?.error}
						<EmptyState
							eyebrow="Error"
							title="These journeys did not load"
							message="Something failed at our end — try the search again."
						>
							{#snippet action()}
								<Button onclick={() => results?.refresh()}>Try again</Button>
							{/snippet}
						</EmptyState>
					{:else if list && list.trips.length === 0}
						<EmptyState
							eyebrow="No matches"
							title="Nothing matches these filters"
							message="Widen the departure window, drop an operator, or try another date."
						>
							{#snippet action()}
								<Button variant="ghost" onclick={() => applyFilters(cleared)}>Clear filters</Button>
							{/snippet}
						</EmptyState>
					{:else if list}
						<div class="border-t border-rule">
							{#each list.trips as trip (trip.id)}
								<TripCard {trip} passengers={parsed.query.passengers} />
							{/each}
						</div>

						{#if list.pageCount > 1}
							<nav aria-label="Results pages" class="flex items-center justify-between gap-4 pt-8">
								<Button
									variant="ghost"
									compact
									disabled={list.page <= 1}
									onclick={() => applyFilters({ page: list.page - 1 })}
								>
									<Icon icon={ICONS.back} size={14} />
									Previous
								</Button>

								<p class="type-label tnum">{list.page} / {list.pageCount}</p>

								<Button
									variant="ghost"
									compact
									disabled={list.page >= list.pageCount}
									onclick={() => applyFilters({ page: list.page + 1 })}
									arrow
								>
									Next
								</Button>
							</nav>
						{/if}
					{/if}
				</div>
			</div>
		{/if}
	{/if}
</div>
