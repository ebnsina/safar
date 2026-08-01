<script lang="ts">
	import { DEPARTURE_WINDOWS, type SearchFilters } from '#lib/domain/search';
	import { formatMoney } from '#lib/format';
	import type { SearchFacets } from '#lib/server/repos/trips';
	import Icon from '../ui/Icon.svelte';
	import { ICONS } from '../ui/icons';

	interface Props {
		facets: SearchFacets;
		filters: SearchFilters;
		onchange: (next: Partial<SearchFilters>) => void;
	}

	let { facets, filters, onchange }: Props = $props();

	const cleared = {
		operators: [],
		classes: [],
		windows: [],
		maxFareMinor: undefined,
		minRating: undefined,
		page: 1
	};

	const hasFilters = $derived(
		filters.operators.length > 0 ||
			filters.classes.length > 0 ||
			filters.windows.length > 0 ||
			filters.maxFareMinor !== undefined ||
			filters.minRating !== undefined
	);

	function toggle<T extends string>(list: readonly T[], value: T): T[] {
		return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
	}
</script>

<aside aria-label="Filter results" class="space-y-8">
	<div class="flex items-baseline justify-between gap-3">
		<p class="type-label">Filter</p>
		{#if hasFilters}
			<button
				type="button"
				class="type-label inline-flex items-center gap-1.5 transition-colors duration-160 hover:text-ink"
				onclick={() => onchange(cleared)}
			>
				<Icon icon={ICONS.reset} size={11} />
				Clear
			</button>
		{/if}
	</div>

	{#if facets.maxFareMinor > facets.minFareMinor}
		<fieldset class="space-y-3">
			<legend class="type-label">Maximum fare</legend>
			<input
				type="range"
				min={facets.minFareMinor}
				max={facets.maxFareMinor}
				step="10000"
				value={filters.maxFareMinor ?? facets.maxFareMinor}
				class="w-full accent-ink"
				aria-label="Maximum fare"
				onchange={(event) => onchange({ maxFareMinor: Number(event.currentTarget.value), page: 1 })}
			/>
			<p class="tnum text-sm text-muted">
				{formatMoney(filters.maxFareMinor ?? facets.maxFareMinor)}
			</p>
		</fieldset>
	{/if}

	<fieldset class="space-y-2.5">
		<legend class="type-label mb-1">Departs</legend>
		{#each DEPARTURE_WINDOWS as window (window.id)}
			<label class="flex cursor-pointer items-center gap-2.5 text-sm">
				<input
					type="checkbox"
					checked={filters.windows.includes(window.id)}
					onchange={() => onchange({ windows: toggle(filters.windows, window.id), page: 1 })}
					class="rounded-xs border-rule-strong text-ink focus:ring-ink"
				/>
				<span class="text-muted">{window.label}</span>
			</label>
		{/each}
	</fieldset>

	{#if facets.classes.length > 1}
		<fieldset class="space-y-2.5">
			<legend class="type-label mb-1">Class</legend>
			{#each facets.classes as option (option.id)}
				<label class="flex cursor-pointer items-center gap-2.5 text-sm">
					<input
						type="checkbox"
						checked={filters.classes.includes(option.id)}
						onchange={() => onchange({ classes: toggle(filters.classes, option.id), page: 1 })}
						class="rounded-xs border-rule-strong text-ink focus:ring-ink"
					/>
					<span class="flex-1 text-muted">{option.label}</span>
					<span class="tnum text-xs text-faint">{option.count}</span>
				</label>
			{/each}
		</fieldset>
	{/if}

	{#if facets.operators.length > 1}
		<fieldset class="space-y-2.5">
			<legend class="type-label mb-1">Operator</legend>
			<div class="max-h-72 space-y-2.5 overflow-y-auto">
				{#each facets.operators as option (option.id)}
					<label class="flex cursor-pointer items-center gap-2.5 text-sm">
						<input
							type="checkbox"
							checked={filters.operators.includes(option.id)}
							onchange={() =>
								onchange({ operators: toggle(filters.operators, option.id), page: 1 })}
							class="rounded-xs border-rule-strong text-ink focus:ring-ink"
						/>
						<span class="flex-1 truncate text-muted">{option.label}</span>
						<span class="tnum text-xs text-faint">{option.count}</span>
					</label>
				{/each}
			</div>
		</fieldset>
	{/if}

	<fieldset class="space-y-2.5">
		<legend class="type-label mb-1">Rating</legend>
		{#each [40, 35, 30] as threshold (threshold)}
			<label class="flex cursor-pointer items-center gap-2.5 text-sm">
				<input
					type="radio"
					name="min-rating"
					checked={filters.minRating === threshold}
					onchange={() => onchange({ minRating: threshold, page: 1 })}
					class="border-rule-strong text-ink focus:ring-ink"
				/>
				<span class="tnum text-muted">{(threshold / 10).toFixed(1)}+</span>
			</label>
		{/each}
	</fieldset>
</aside>
