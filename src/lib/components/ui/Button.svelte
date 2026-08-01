<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { ICONS } from './icons';
	import Icon from './Icon.svelte';

	type Variant = 'solid' | 'ghost';

	type Props = {
		variant?: Variant;
		loading?: boolean;
		full?: boolean;
		/** Adds the trailing arrow that shifts 4px towards the pointer on hover. */
		arrow?: boolean;
		compact?: boolean;
		children: Snippet;
	} & (({ href: string } & HTMLAnchorAttributes) | ({ href?: never } & HTMLButtonAttributes));

	let {
		variant = 'solid',
		loading = false,
		full = false,
		arrow = false,
		compact = false,
		href,
		children,
		...rest
	}: Props = $props();

	const VARIANTS: Record<Variant, string> = {
		solid: 'bg-inverse-paper text-inverse-ink border-transparent hover:opacity-88',
		ghost: 'bg-transparent text-ink border-rule-strong hover:border-ink'
	};

	const classes = $derived(
		[
			'group type-button inline-flex items-center justify-center gap-2.5 rounded-none border px-5',
			compact ? 'h-9' : 'h-[46px]',
			'transition-[opacity,border-color,background-color] duration-160 ease-out-quart',
			'disabled:pointer-events-none disabled:opacity-40',
			VARIANTS[variant],
			full ? 'w-full' : ''
		].join(' ')
	);
</script>

{#snippet content()}
	{#if loading}
		<span
			class="size-3.5 animate-spin rounded-full border border-current border-t-transparent"
			aria-hidden="true"
		></span>
	{/if}
	{@render children()}
	{#if arrow}
		<span
			class="inline-flex transition-transform duration-160 ease-out-quart group-hover:translate-x-1"
			aria-hidden="true"
		>
			<Icon icon={ICONS.forward} size={14} />
		</span>
	{/if}
{/snippet}

{#if href}
	<a {href} class={classes} aria-busy={loading || undefined} {...rest as HTMLAnchorAttributes}>
		{@render content()}
	</a>
{:else}
	<button
		class={classes}
		disabled={loading || (rest as HTMLButtonAttributes).disabled}
		aria-busy={loading || undefined}
		{...rest as HTMLButtonAttributes}
	>
		{@render content()}
	</button>
{/if}
