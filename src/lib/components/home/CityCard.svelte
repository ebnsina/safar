<script lang="ts">
	import { auroraFor } from '#lib/domain/aurora';
	import type { FeaturedCity } from '#lib/domain/featured';
	import Icon from '../ui/Icon.svelte';
	import { ICONS, MODE_ICONS } from '../ui/icons';

	interface Props {
		city: FeaturedCity;
		/** Departure date carried into the search. */
		date: string;
		/** Cities are reached from the capital unless stated otherwise. */
		from?: string;
	}

	let { city, date, from = 'dhaka' }: Props = $props();

	const href = $derived(`/search/${city.mode}?from=${from}&to=${city.id}&date=${date}`);
	const ribbons = $derived(auroraFor(city.id, city.latitude, city.longitude));
</script>

<a {href} class="group block">
	<!--
		Every blob is painted in currentColor, so the aurora is monochrome by construction
		and inverts with the theme. Only opacity and size carry the tonal range.
	-->
	<div class="relative aspect-4/5 overflow-hidden bg-surface text-ink">
		<div
			class="absolute inset-0 transition-transform duration-700 ease-out-quart group-hover:scale-105"
			aria-hidden="true"
		>
			{#each ribbons as ribbon, index (index)}
				<span
					class="aurora-ribbon"
					style="
						left: {ribbon.x}%;
						top: {ribbon.y}%;
						width: {ribbon.width}%;
						height: {ribbon.height}%;
						opacity: calc({ribbon.opacity} * var(--aurora-strength));
						filter: blur({ribbon.blur}px);
						--aurora-rotate: {ribbon.rotate}deg;
						--aurora-duration: {ribbon.duration}s;
						--aurora-delay: {ribbon.delay}s;
					"
				></span>
			{/each}
		</div>
	</div>

	<div class="flex items-start justify-between gap-4 pt-4">
		<div class="min-w-0">
			<p class="type-label flex items-center gap-2">
				<Icon icon={MODE_ICONS[city.mode]} size={13} />
				{city.division}
			</p>
			<h3 class="mt-2 text-xl text-ink" style="font-stretch: 88%;">{city.name}</h3>
			<p class="mt-1 text-sm text-muted">{city.blurb}</p>
		</div>
		<span
			class="mt-1 shrink-0 text-faint transition-transform duration-160 group-hover:translate-x-1 group-hover:text-ink"
			aria-hidden="true"
		>
			<Icon icon={ICONS.forward} size={16} />
		</span>
	</div>
</a>
