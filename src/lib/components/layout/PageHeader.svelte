<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		eyebrow?: string;
		title: string;
		standfirst?: string;
		id?: string;
		actions?: Snippet;
	}

	let { eyebrow, title, standfirst, id, actions }: Props = $props();
</script>

<header class="space-y-4">
	{#if eyebrow}
		<p class="type-label">{eyebrow}</p>
	{/if}

	<h1 {id} class="type-title">{title}</h1>

	{#if standfirst}
		<p class="type-body text-muted">{standfirst}</p>
	{/if}

	{#if actions}
		<div class="flex flex-wrap gap-3 pt-2">{@render actions()}</div>
	{/if}
</header>
