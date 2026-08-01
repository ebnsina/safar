<script lang="ts">
	import type { Snippet } from 'svelte';

	type Tone = 'quiet' | 'solid';

	interface Props {
		tone?: Tone;
		children: Snippet;
	}

	let { tone = 'quiet', children }: Props = $props();

	const TONES: Record<Tone, string> = {
		quiet: 'text-muted border-rule',
		solid: 'bg-inverse-paper text-inverse-ink border-transparent'
	};
</script>

<span
	class="type-button inline-flex items-center rounded-xs border px-2 py-1 text-[10px] whitespace-nowrap {TONES[
		tone
	]}"
>
	{@render children()}
</span>
