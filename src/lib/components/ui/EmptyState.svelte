<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		eyebrow?: string;
		title: string;
		message: string;
		action?: Snippet;
	}

	let { eyebrow = 'Nothing here', title, message, action }: Props = $props();
</script>

<div class="max-w-(--container-measure) space-y-4 py-16">
	<p class="type-label">{eyebrow}</p>
	<p class="type-section">{title}</p>
	<p class="text-base text-muted">{message}</p>
	{#if action}
		<div class="pt-2">{@render action()}</div>
	{/if}
</div>
