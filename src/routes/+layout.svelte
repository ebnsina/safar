<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import Meta from '#lib/components/Meta.svelte';
	import Footer from '#lib/components/layout/Footer.svelte';
	import Header from '#lib/components/layout/Header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content="#0a0a0c" media="(prefers-color-scheme: dark)" />
</svelte:head>

<Meta />

<a
	href="#main"
	class="type-button sr-only rounded-xs bg-inverse-paper px-4 py-2 text-inverse-ink focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
>
	Skip to content
</a>

<div class="flex min-h-dvh flex-col">
	<Header />
	<main id="main" class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
