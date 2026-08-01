<script lang="ts">
	import { getRegion } from '#lib/config/region';
	import { TRANSPORT_MODES, describeMode, type TransportMode } from '#lib/domain/modes';
	import { MAX_PASSENGERS, SearchQuerySchema } from '#lib/domain/search';
	import type { PlaceView } from '#lib/domain/trip';
	import { toCalendarDate } from '#lib/format';
	import { startSearch } from '../../../routes/search.remote';
	import Button from '../ui/Button.svelte';
	import Icon from '../ui/Icon.svelte';
	import { ICONS, MODE_ICONS } from '../ui/icons';
	import PlaceCombobox from './PlaceCombobox.svelte';

	interface Props {
		mode?: TransportMode;
		origin?: PlaceView | null;
		destination?: PlaceView | null;
		date?: string;
		passengers?: number;
		/** Set on a results page, where switching mode must re-run the search. */
		onmodechange?: (mode: TransportMode) => void;
	}

	let {
		mode = $bindable('bus'),
		origin = $bindable(null),
		destination = $bindable(null),
		date = $bindable(''),
		passengers = $bindable(1),
		onmodechange
	}: Props = $props();

	const region = getRegion();
	const today = toCalendarDate(Date.now());
	const latest = toCalendarDate(Date.now() + region.maxAdvanceDays * 86_400_000);

	if (!date) date = today;

	const form = $derived(startSearch.preflight(SearchQuerySchema));
	const fields = $derived(form.fields);

	const issues = $derived([
		...(fields.origin.issues() ?? []),
		...(fields.destination.issues() ?? []),
		...(fields.date.issues() ?? []),
		...(fields.passengers.issues() ?? [])
	]);

	function swap() {
		[origin, destination] = [destination, origin];
	}

	function chooseMode(next: TransportMode) {
		if (next === mode) return;
		mode = next;
		onmodechange?.(next);
	}
</script>

<form {...form} class="space-y-8">
	<input {...fields.mode.as('hidden', mode)} />

	<div role="tablist" aria-label="Travel mode" class="flex gap-8">
		{#each TRANSPORT_MODES as option (option)}
			<button
				type="button"
				role="tab"
				aria-selected={mode === option}
				onclick={() => chooseMode(option)}
				class="type-button -mb-px inline-flex items-center gap-2 border-b border-transparent pb-3 text-faint transition-colors duration-160 hover:text-ink aria-selected:border-ink aria-selected:text-ink"
			>
				<Icon icon={MODE_ICONS[option]} size={16} />
				{describeMode(option).label}
			</button>
		{/each}
	</div>

	<div class="grid gap-6 lg:grid-cols-[1fr_auto_1fr_10rem_9rem_auto] lg:items-end lg:gap-5">
		<PlaceCombobox
			id="search-origin"
			name={fields.origin.as('hidden', origin?.id ?? '').name}
			label="From"
			{mode}
			bind:value={origin}
			invalid={(fields.origin.issues() ?? []).length > 0}
			placeholder="Leaving from"
		/>

		<button
			type="button"
			onclick={swap}
			class="mb-3 hidden self-end text-faint transition-colors duration-160 hover:text-ink lg:block"
			aria-label="Swap origin and destination"
		>
			<Icon icon={ICONS.swap} size={16} />
		</button>

		<PlaceCombobox
			id="search-destination"
			name={fields.destination.as('hidden', destination?.id ?? '').name}
			label="To"
			{mode}
			bind:value={destination}
			invalid={(fields.destination.issues() ?? []).length > 0}
			placeholder="Going to"
		/>

		<div class="flex flex-col gap-2">
			<label for="search-date" class="type-label">Date</label>
			<input
				id="search-date"
				type="date"
				name={fields.date.as('date').name}
				bind:value={date}
				min={today}
				max={latest}
				aria-invalid={(fields.date.issues() ?? []).length > 0 || undefined}
				class="tnum h-11 border-0 border-b border-rule-strong bg-transparent p-0 pb-1 text-sm text-ink focus:ring-0"
			/>
		</div>

		<div class="flex flex-col gap-2">
			<label for="search-passengers" class="type-label">Travellers</label>
			<select
				id="search-passengers"
				name={fields.passengers.as('number').name}
				bind:value={passengers}
				class="h-11 border-0 border-b border-rule-strong bg-transparent p-0 pb-1 text-sm text-ink focus:ring-0"
			>
				{#each Array.from({ length: MAX_PASSENGERS }, (_, index) => index + 1) as count (count)}
					<option value={count}>{count}</option>
				{/each}
			</select>
		</div>

		<Button type="submit" loading={form.pending > 0} arrow>Search</Button>
	</div>

	{#each issues as issue, index (index)}
		<p class="text-sm text-ink">{issue.message}</p>
	{/each}
</form>
