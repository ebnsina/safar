<script lang="ts">
	import { page } from '$app/state';
	import Meta from '#lib/components/Meta.svelte';
	import PageHeader from '#lib/components/layout/PageHeader.svelte';
	import Ticket from '#lib/components/ticket/Ticket.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import EmptyState from '#lib/components/ui/EmptyState.svelte';
	import { findClass, type SeatLayout } from '#lib/domain/seating';
	import { getLayout } from '#lib/domain/layouts';
	import { formatDateLong, formatMoney, formatTime } from '#lib/format';
	import { bookingByReference } from '../bookings.remote';

	const reference = $derived(page.params.reference ?? '');
	const email = $derived(page.url.searchParams.get('e') ?? '');

	const booking = $derived(email ? bookingByReference({ reference, email }) : undefined);
	const record = $derived(booking?.current);

	const layout = $derived<SeatLayout | undefined>(
		record ? getLayout(record.trip.layoutId) : undefined
	);

	function classLabel(code: string): string {
		return (layout ? findClass(layout, code)?.name : undefined) ?? code;
	}
</script>

<Meta title="Booking {reference}" noindex />

<div class="mx-auto max-w-(--container-shell) px-(--spacing-gutter) py-16">
	{#if !email}
		<EmptyState
			eyebrow="Bookings"
			title="We need your email as well"
			message="Open this booking from the lookup page so we can check it belongs to you."
		>
			{#snippet action()}
				<Button href="/bookings" arrow>Find my booking</Button>
			{/snippet}
		</EmptyState>
	{:else if booking?.loading && !record}
		<div class="h-96 max-w-sm animate-pulse rounded-sm bg-surface"></div>
	{:else if record}
		<PageHeader
			eyebrow={record.status === 'confirmed'
				? 'Confirmed'
				: record.status === 'held'
					? 'Awaiting payment'
					: 'Cancelled'}
			title={record.status === 'confirmed' ? 'You are booked' : 'Your booking'}
			standfirst={record.status === 'confirmed'
				? `We sent the ticket to ${record.contactEmail}. Show the reference at the counter.`
				: undefined}
		/>

		<div class="grid gap-12 pt-12 lg:grid-cols-[auto_1fr] lg:gap-16">
			<div class="space-y-8">
				{#each record.passengers as person (person.seatCode)}
					<Ticket
						trip={record.trip}
						reference={record.reference}
						passengerName={person.fullName}
						seatCode={person.seatCode}
						className={classLabel(person.classCode)}
						fareMinor={person.fareMinor}
						state={record.status}
					/>
				{/each}
			</div>

			<div class="max-w-(--container-measure) space-y-10">
				<section aria-labelledby="journey-heading" class="space-y-4">
					<h2 id="journey-heading" class="type-label">Journey</h2>
					<dl class="border-t border-rule text-sm">
						{#each [{ term: 'Operator', value: record.trip.operator.name }, { term: 'Service', value: record.trip.code }, { term: 'Date', value: formatDateLong(record.trip.departAt) }, { term: 'Departs', value: `${formatTime(record.trip.departAt)} · ${record.trip.originStop.name}` }, { term: 'Arrives', value: `${formatTime(record.trip.arriveAt)} · ${record.trip.destinationStop.name}` }] as row (row.term)}
							<div class="flex justify-between gap-6 border-b border-rule py-3">
								<dt class="type-label">{row.term}</dt>
								<dd class="text-right text-ink">{row.value}</dd>
							</div>
						{/each}
					</dl>
				</section>

				<section aria-labelledby="payment-heading" class="space-y-4">
					<h2 id="payment-heading" class="type-label">What you paid</h2>
					<dl class="border-t border-rule text-sm">
						<div class="flex justify-between gap-6 border-b border-rule py-3">
							<dt class="text-muted">Fares</dt>
							<dd class="tnum text-ink">{formatMoney(record.fareMinor)}</dd>
						</div>
						<div class="flex justify-between gap-6 border-b border-rule py-3">
							<dt class="text-muted">Booking fee</dt>
							<dd class="tnum text-ink">{formatMoney(record.feesMinor)}</dd>
						</div>
						<div class="flex items-baseline justify-between gap-6 border-b border-rule py-3">
							<dt class="type-label">Total</dt>
							<dd class="tnum text-xl text-ink">{formatMoney(record.totalMinor)}</dd>
						</div>
					</dl>
				</section>

				<div class="flex flex-wrap gap-3">
					<Button variant="ghost" onclick={() => window.print()}>Print tickets</Button>
					<Button href="/" variant="ghost" arrow>Book another journey</Button>
				</div>
			</div>
		</div>
	{/if}
</div>
