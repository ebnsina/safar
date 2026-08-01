<script lang="ts">
	import Meta from '#lib/components/Meta.svelte';
	import PageHeader from '#lib/components/layout/PageHeader.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import { BookingLookupSchema } from '#lib/domain/booking';
	import { lookupBooking } from './bookings.remote';

	const form = $derived(lookupBooking.preflight(BookingLookupSchema));
	const fields = $derived(form.fields);

	const inputClass =
		'border-rule-strong text-ink h-11 w-full border-0 border-b bg-transparent p-0 pb-1 text-sm focus:ring-0';
</script>

<Meta
	title="Find my booking"
	description="Open your Safar ticket with your booking reference and the email you booked with."
/>

<div class="mx-auto max-w-(--container-shell) px-(--spacing-gutter) py-16">
	<PageHeader
		eyebrow="Bookings"
		title="Find my booking"
		standfirst="Enter the six-character reference from your ticket and the email you booked with."
	/>

	<form {...form} class="mt-12 max-w-md space-y-8">
		<div class="flex flex-col gap-2">
			<label for="reference" class="type-label">Booking reference</label>
			<input
				id="reference"
				{...fields.reference.as('text')}
				autocomplete="off"
				spellcheck="false"
				placeholder="7KQ4M2"
				class="tnum text-lg tracking-[0.12em] uppercase {inputClass}"
			/>
			{#each fields.reference.issues() ?? [] as issue, key (key)}
				<p class="text-sm text-ink">{issue.message}</p>
			{/each}
		</div>

		<div class="flex flex-col gap-2">
			<label for="email" class="type-label">Email</label>
			<input id="email" {...fields.email.as('email')} autocomplete="email" class={inputClass} />
			{#each fields.email.issues() ?? [] as issue, key (key)}
				<p class="text-sm text-ink">{issue.message}</p>
			{/each}
		</div>

		<Button type="submit" loading={form.pending > 0} arrow>Find booking</Button>
	</form>
</div>
