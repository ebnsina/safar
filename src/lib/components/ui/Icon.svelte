<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import type { ComponentProps } from 'svelte';

	type Props = Omit<ComponentProps<typeof HugeiconsIcon>, 'strokeWidth'> & {
		strokeWidth?: number;
	};

	// Stroke style at 1.5–1.8, sized 14–26 — the house iconography settings.
	let { size = 18, strokeWidth = 1.6, ...rest }: Props = $props();
</script>

<HugeiconsIcon {size} {strokeWidth} color="currentColor" {...rest} />
