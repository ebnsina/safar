<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ICONS } from './icons';
	import Icon from './Icon.svelte';

	type Tone = 'info' | 'warning' | 'success';

	interface Props {
		tone?: Tone;
		title?: string;
		children?: Snippet;
	}

	let { tone = 'info', title, children }: Props = $props();

	const GLYPHS = { info: ICONS.info, warning: ICONS.warning, success: ICONS.confirmed };
</script>

<div class="flex gap-3 rounded-sm bg-surface p-4" role={tone === 'warning' ? 'alert' : 'status'}>
	<span class="mt-0.5 shrink-0 text-muted" aria-hidden="true">
		<Icon icon={GLYPHS[tone]} size={16} />
	</span>
	<div class="space-y-1">
		{#if title}<p class="text-sm font-medium text-ink">{title}</p>{/if}
		{#if children}<div class="text-sm text-muted">{@render children()}</div>{/if}
	</div>
</div>
