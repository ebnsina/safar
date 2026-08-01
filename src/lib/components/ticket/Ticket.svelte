<script lang="ts">
	import type { TransportMode } from '#lib/domain/modes';
	import { describeMode } from '#lib/domain/modes';
	import type { TripDetail } from '#lib/domain/trip';
	import { formatDateShort, formatDuration, formatMoney, formatTime } from '#lib/format';
	import Icon from '../ui/Icon.svelte';
	import { MODE_ICONS } from '../ui/icons';
	import BarField from './BarField.svelte';

	interface Props {
		trip: TripDetail;
		reference: string;
		passengerName: string;
		seatCode: string;
		className: string;
		fareMinor: number;
		/** A cancelled or unpaid booking prints faded, with the state called out. */
		state?: 'confirmed' | 'held' | 'cancelled';
	}

	let {
		trip,
		reference,
		passengerName,
		seatCode,
		className,
		fareMinor,
		state = 'confirmed'
	}: Props = $props();

	const mode = $derived(trip.mode as TransportMode);
	// Coach-prefixed codes split into the coach and the seat within it.
	const coach = $derived(seatCode.includes('-') ? seatCode.split('-')[0] : null);
	const seat = $derived(seatCode.includes('-') ? seatCode.split('-').slice(1).join('-') : seatCode);

	const facts = $derived(
		[
			coach
				? { label: describeMode(mode).stopLabel === 'Station' ? 'Coach' : 'Deck', value: coach }
				: null,
			{ label: describeMode(mode).label, value: trip.code },
			{ label: 'Seat', value: seat }
		].filter((fact) => fact !== null)
	);
</script>

<!--
	The notches are punched with a mask rather than drawn with overlapping circles,
	so the tear survives any background the ticket is placed on.
-->
<article
	class="relative w-full max-w-sm rounded-sm bg-surface {state === 'cancelled' ? 'opacity-55' : ''}"
	style="
		--notch: 13px;
		--tear: calc(100% - 142px);
		mask-image:
			radial-gradient(var(--notch) at left var(--tear), transparent 99%, #000 100%),
			radial-gradient(var(--notch) at right var(--tear), transparent 99%, #000 100%);
		mask-composite: intersect;
		-webkit-mask-composite: source-in;
	"
>
	<div class="space-y-7 p-7">
		<div class="space-y-1.5">
			<p class="type-label">Passenger</p>
			<p class="text-2xl leading-tight font-bold text-ink" style="font-stretch: 86%;">
				{passengerName}
			</p>
		</div>

		<div class="space-y-3">
			<div class="flex items-baseline justify-between gap-3">
				<span class="tnum text-sm text-muted">{formatTime(trip.departAt)}</span>
				<span class="type-label text-ink">{formatDuration(trip.durationMinutes)}</span>
				<span class="tnum text-sm text-muted">{formatTime(trip.arriveAt)}</span>
			</div>

			<div class="flex items-center gap-2" aria-hidden="true">
				<span class="size-2 shrink-0 rounded-full bg-ink"></span>
				<span class="flex-1 border-t border-dashed border-ink"></span>
				<span class="shrink-0 text-ink"><Icon icon={MODE_ICONS[mode]} size={20} /></span>
				<span class="flex-1 border-t border-dashed border-ink"></span>
				<span class="size-2 shrink-0 rounded-full border-[1.5px] border-ink"></span>
			</div>

			<div class="flex items-start justify-between gap-4">
				<div class="min-w-0">
					<p class="truncate text-xl font-bold text-ink" style="font-stretch: 84%;">
						{trip.origin.name}
					</p>
					<p class="truncate text-xs text-muted">{trip.originStop.name}</p>
				</div>
				<div class="min-w-0 text-right">
					<p class="truncate text-xl font-bold text-ink" style="font-stretch: 84%;">
						{trip.destination.name}
					</p>
					<p class="truncate text-xs text-muted">{trip.destinationStop.name}</p>
				</div>
			</div>
		</div>

		<div class="space-y-1.5">
			<p class="type-label">Booking reference</p>
			<p class="tnum text-2xl tracking-[0.08em] text-ink">{reference}</p>
		</div>

		<dl class="flex justify-between gap-4">
			{#each facts as fact (fact.label)}
				<div class="min-w-0 text-center first:text-left last:text-right">
					<dt class="type-label">{fact.label}</dt>
					<dd class="tnum mt-1 truncate text-lg text-ink">{fact.value}</dd>
				</div>
			{/each}
		</dl>

		<div class="flex items-baseline justify-between gap-4">
			<p class="type-label">{formatDateShort(trip.departAt)} · {className}</p>
			<p class="tnum text-ink">{formatMoney(fareMinor)}</p>
		</div>
	</div>

	<!-- The tear line is pinned to the same offset as the notch centres. -->
	<div
		class="absolute right-7 left-7 border-t border-dashed border-rule-strong"
		style="top: var(--tear);"
		aria-hidden="true"
	></div>

	<div class="h-[142px] space-y-2 px-7 pt-6 pb-7">
		{#if state !== 'confirmed'}
			<p class="type-label text-ink">
				{state === 'held' ? 'Not yet paid' : 'Cancelled'}
			</p>
		{/if}
		<BarField value={reference} />
		<p class="type-label text-center">{reference} · {trip.code}</p>
	</div>
</article>
