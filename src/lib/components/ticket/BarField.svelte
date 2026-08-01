<script lang="ts">
	import { mulberry32, hashString } from '#lib/domain/random';

	interface Props {
		/** Bars are derived from this, so one reference always draws the same field. */
		value: string;
		height?: number;
	}

	let { value, height = 68 }: Props = $props();

	// Decorative only — the reference printed beneath it is what staff actually read.
	const bars = $derived.by(() => {
		const next = mulberry32(hashString(value));
		const widths: number[] = [];
		for (let i = 0; i < 78; i++) {
			widths.push(next() < 0.62 ? 1 : next() < 0.8 ? 2 : 3);
		}
		return widths;
	});

	const total = $derived(bars.reduce((sum, width) => sum + width + 1, 0));
</script>

<svg
	viewBox="0 0 {total} {height}"
	preserveAspectRatio="none"
	class="h-(--bar-height) w-full text-ink"
	style="--bar-height: {height}px"
	role="img"
	aria-label="Barcode for booking {value}"
>
	{#each bars as width, index (index)}
		{@const x = bars.slice(0, index).reduce((sum, w) => sum + w + 1, 0)}
		{#if index % 2 === 0}
			<rect {x} y="0" {width} {height} fill="currentColor" />
		{/if}
	{/each}
</svg>
