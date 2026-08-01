<script lang="ts">
	import type { Seat } from '#lib/domain/seating';
	import { formatMoney } from '#lib/format';

	interface Props {
		seat: Seat;
		selected: boolean;
		/** Selection is blocked once the traveller has picked their allowance. */
		blocked: boolean;
		legroom: boolean;
		ontoggle: (seat: Seat) => void;
	}

	let { seat, selected, blocked, legroom, ontoggle }: Props = $props();

	// Coach-prefixed codes such as "KA-12A" display as just "12A" inside the coach.
	const label = $derived(seat.code.includes('-') ? seat.code.split('-').pop()! : seat.code);
	const taken = $derived(seat.status === 'sold');
	const disabled = $derived(taken || (blocked && !selected));

	const description = $derived(
		taken
			? `Seat ${label}, taken`
			: `Seat ${label}, ${seat.position}${legroom ? ', extra legroom' : ''}, ${formatMoney(seat.priceMinor)}`
	);
</script>

<!--
	A taken seat stays a filled block rather than an empty cell, so the shape of the
	vehicle still reads at a glance.
-->
<button
	type="button"
	{disabled}
	aria-pressed={selected}
	aria-label={description}
	title={description}
	onclick={() => ontoggle(seat)}
	class="tnum relative flex size-8 items-center justify-center border text-[9.5px] leading-none transition-colors duration-160
		{selected
		? 'border-ink bg-inverse-paper text-inverse-ink'
		: taken
			? 'border-rule bg-rule text-transparent'
			: 'border-rule-strong text-muted hover:border-ink hover:text-ink'}
		{disabled && !taken ? 'opacity-30' : ''}
		disabled:cursor-not-allowed"
>
	<!-- The headrest edge is what makes a cell read as a seat. -->
	<span
		class="absolute inset-x-1.5 top-[3px] h-px {selected
			? 'bg-inverse-ink/60'
			: taken
				? 'bg-rule-strong'
				: 'bg-rule-strong'}"
		aria-hidden="true"
	></span>
	{taken ? '' : label}
</button>
