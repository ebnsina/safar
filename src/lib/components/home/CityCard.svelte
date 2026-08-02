<script lang="ts">
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
</script>

<a {href} class="group block">
	<!--
		The artwork is a mask rather than an image, so it is painted in the current ink
		and inverts with the theme instead of carrying colour of its own.
	-->
	<div class="relative aspect-4/5 overflow-hidden bg-surface">
		<div
			class="absolute inset-0 bg-current text-faint transition-transform duration-500 ease-out-quart group-hover:scale-[1.04]"
			style="
				mask-image: url('/cities/{city.id}.svg');
				mask-size: cover;
				mask-position: center;
				mask-repeat: no-repeat;
			"
			aria-hidden="true"
		></div>
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
