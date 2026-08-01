<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { TRANSPORT_MODES, describeMode } from '#lib/domain/modes';
	import Icon from '../ui/Icon.svelte';
	import { ICONS } from '../ui/icons';
	import Logo from './Logo.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	const links = TRANSPORT_MODES.map((mode) => ({
		href: `/search/${mode}`,
		label: describeMode(mode).vehicles
	}));

	const current = $derived(page.url.pathname);

	// At the top the header is part of the hero; past it, the page is frosted behind it.
	let lifted = $state(false);

	onMount(() => {
		const onScroll = () => (lifted = window.scrollY > 8);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<header
	class="sticky top-0 z-40 transition-colors duration-300 ease-out-quart {lifted
		? 'bg-paper/72 backdrop-blur-xl backdrop-saturate-150'
		: 'bg-transparent'}"
>
	<div class="mx-auto flex h-16 max-w-(--container-shell) items-center gap-8 px-(--spacing-gutter)">
		<Logo />

		<nav aria-label="Travel modes" class="hidden items-center gap-6 sm:flex">
			{#each links as link (link.href)}
				<a
					href={link.href}
					aria-current={current.startsWith(link.href) ? 'page' : undefined}
					class="type-button text-muted transition-colors duration-160 hover:text-ink aria-[current=page]:text-ink"
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<div class="ml-auto flex items-center gap-5">
			<a
				href="/bookings"
				class="type-button inline-flex items-center gap-2 text-muted transition-colors duration-160 hover:text-ink"
			>
				<Icon icon={ICONS.ticket} size={15} />
				<span class="hidden sm:inline">My booking</span>
			</a>
			<ThemeToggle />
		</div>
	</div>
</header>
