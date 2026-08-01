<script lang="ts">
	import { page } from '$app/state';
	import Meta from '#lib/components/Meta.svelte';
	import PageHeader from '#lib/components/layout/PageHeader.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import { describeError, isErrorCode } from '#lib/errors';

	// The API layer supplies the wording; anything unrecognised falls back to the catalog.
	const known = $derived(isErrorCode(page.error?.code) ? page.error : null);
	const fallback = $derived(describeError(page.status === 404 ? 'NOT_FOUND' : 'UNKNOWN'));
	const title = $derived(known?.title ?? fallback.title);
	const message = $derived(known?.message ?? fallback.message);
</script>

<Meta {title} description={message} noindex />

<div class="mx-auto max-w-(--container-shell) px-(--spacing-gutter) py-24">
	<PageHeader eyebrow="Error {page.status}" {title} standfirst={message}>
		{#snippet actions()}
			<Button href="/" arrow>Search journeys</Button>
			<Button href="/bookings" variant="ghost">Find my booking</Button>
		{/snippet}
	</PageHeader>
</div>
