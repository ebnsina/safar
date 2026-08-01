<script lang="ts">
	import { isFillingFast, type TripSummary } from '#lib/domain/trip';
	import { formatCount, formatDuration, formatMoney, formatTime } from '#lib/format';
	import Button from '../ui/Button.svelte';
	import Icon from '../ui/Icon.svelte';
	import { ICONS } from '../ui/icons';

	interface Props {
		trip: TripSummary;
		/** Carried into the trip page so the seat picker knows the allowance. */
		passengers: number;
	}

	let { trip, passengers }: Props = $props();

	const rating = $derived((trip.operator.rating / 10).toFixed(1));
	const href = $derived(`/trip/${encodeURIComponent(trip.id)}?pax=${passengers}`);
</script>

<article class="grid gap-6 border-b border-rule py-7 lg:grid-cols-[1fr_auto] lg:gap-12">
	<div class="min-w-0 space-y-5">
		<div class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
			<h3 class="text-lg font-bold text-ink" style="font-stretch: 90%;">
				{trip.operator.name}
			</h3>
			<span class="type-label">{trip.code}</span>
			<span class="type-label inline-flex items-center gap-1.5">
				<Icon icon={ICONS.rating} size={12} />
				<span class="tnum">{rating}</span>
				<span>/ {formatCount(trip.operator.ratingCount)}</span>
			</span>
		</div>

		<div class="flex items-start gap-5">
			<div class="min-w-0">
				<p class="tnum text-2xl text-ink">{formatTime(trip.departAt)}</p>
				<p class="truncate text-sm text-muted">{trip.originStop.name}</p>
			</div>

			<div class="flex min-w-24 flex-1 flex-col items-center gap-1.5 pt-3">
				<span class="type-label">{formatDuration(trip.durationMinutes)}</span>
				<span class="w-full border-t border-dashed border-rule-strong" aria-hidden="true"></span>
			</div>

			<div class="min-w-0 text-right">
				<p class="tnum text-2xl text-ink">{formatTime(trip.arriveAt)}</p>
				<p class="truncate text-sm text-muted">{trip.destinationStop.name}</p>
			</div>
		</div>

		<ul class="flex flex-wrap gap-x-5 gap-y-1">
			{#each trip.fares as fare (fare.code)}
				<li class="type-label">
					{fare.name} · <span class="tnum">{formatMoney(fare.priceMinor)}</span>
				</li>
			{/each}
		</ul>
	</div>

	<div class="flex shrink-0 items-end justify-between gap-6 lg:flex-col lg:items-end">
		<div class="text-right">
			<p class="type-label">From</p>
			<p class="tnum mt-1 text-2xl text-ink">{formatMoney(trip.fromFareMinor)}</p>
			<p class="type-label mt-1">
				{#if isFillingFast(trip)}
					Only {trip.seatsAvailable} left
				{:else}
					{trip.seatsAvailable} seats left
				{/if}
			</p>
		</div>

		<Button {href} arrow>Select seats</Button>
	</div>
</article>
