<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Rail label — only use it when it names real structure. */
		label?: string;
		/** A hairline is justified only when it separates things that would otherwise blur. */
		rule?: boolean;
		labelledBy?: string;
		children: Snippet;
	}

	let { label, rule = false, labelledBy, children }: Props = $props();
</script>

<section aria-labelledby={labelledBy} class="group/section {rule ? 'border-t border-rule' : ''}">
	<div
		class="mx-auto grid max-w-(--container-shell) gap-x-8 gap-y-4 px-(--spacing-gutter) py-12 min-[900px]:grid-cols-[var(--spacing-rail)_1fr] min-[900px]:py-16"
	>
		{#if label}
			<p class="type-label">{label}</p>
		{:else}
			<div class="hidden min-[900px]:block" aria-hidden="true"></div>
		{/if}

		<div class="min-w-0">
			{@render children()}
		</div>
	</div>
</section>
