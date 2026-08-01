<script lang="ts">
	import { page } from '$app/state';
	import Meta from '#lib/components/Meta.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { ICONS } from '#lib/components/ui/icons';
	import { PAYMENT_METHODS, PaymentFormSchema, type PaymentMethod } from '#lib/domain/booking';
	import { formatDateLong, formatMoney, formatTime } from '#lib/format';
	import { payForBooking, pendingBooking } from './checkout.remote';

	const bookingId = $derived(page.params.id ?? '');
	const booking = $derived(pendingBooking(bookingId));
	const record = $derived(booking.current);

	let method = $state<PaymentMethod>('card');

	const form = $derived(payForBooking.preflight(PaymentFormSchema));
	const fields = $derived(form.fields);

	const inputClass =
		'border-rule-strong text-ink h-11 w-full border-0 border-b bg-transparent p-0 pb-1 text-sm focus:ring-0';

	const METHOD_ICONS = { card: ICONS.card, bkash: ICONS.wallet, nagad: ICONS.wallet };

	// The hold clock, refreshed each second so the traveller can see it running down.
	let now = $state(Date.now());
	$effect(() => {
		const timer = setInterval(() => (now = Date.now()), 1000);
		return () => clearInterval(timer);
	});

	const secondsLeft = $derived(
		record?.expiresAt ? Math.max(0, Math.floor((record.expiresAt - now) / 1000)) : 0
	);
	const clock = $derived(
		`${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`
	);
</script>

<Meta title="Payment" noindex />

<div class="mx-auto max-w-(--container-shell) px-(--spacing-gutter) py-10">
	{#if booking.loading && !record}
		<div class="h-64 animate-pulse rounded-sm bg-surface"></div>
	{:else if record}
		<header class="flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-8">
			<div class="space-y-3">
				<p class="type-label">Step 2 of 2 · Payment</p>
				<h1 class="type-title">{record.trip.origin.name} — {record.trip.destination.name}</h1>
			</div>

			{#if record.status === 'held'}
				<p class="type-label">
					Seats held · <span class="tnum text-base text-ink">{clock}</span>
				</p>
			{/if}
		</header>

		<div class="grid gap-12 py-10 lg:grid-cols-[1fr_19rem]">
			<div class="min-w-0 space-y-12">
				{#if secondsLeft === 0 && record.status === 'held'}
					<div class="space-y-4 border-t border-rule-strong pt-6">
						<p class="type-label">Hold expired</p>
						<p class="text-sm text-muted">
							We held your seats for ten minutes and that time has passed — choose them again.
						</p>
						<Button href="/trip/{encodeURIComponent(record.trip.id)}" arrow>
							Choose seats again
						</Button>
					</div>
				{:else}
					<form {...form} class="space-y-10">
						<input {...fields.bookingId.as('hidden', bookingId)} />

						<section aria-labelledby="method-heading" class="space-y-5">
							<h2 id="method-heading" class="type-label">How you are paying</h2>

							<div class="grid gap-3 sm:grid-cols-3">
								{#each PAYMENT_METHODS as option (option.id)}
									<label
										class="flex cursor-pointer items-center gap-3 rounded-sm border border-rule-strong p-4 transition-colors duration-160 has-checked:border-ink"
									>
										<input
											{...fields.method.as('radio', option.id)}
											checked={method === option.id}
											onchange={() => (method = option.id)}
											class="border-rule-strong text-ink focus:ring-ink"
										/>
										<span class="text-faint" aria-hidden="true">
											<Icon icon={METHOD_ICONS[option.id]} size={16} />
										</span>
										<span class="type-button text-ink">{option.label}</span>
									</label>
								{/each}
							</div>
						</section>

						<section aria-labelledby="details-heading" class="space-y-6">
							<h2 id="details-heading" class="type-label">Payment details</h2>

							{#if method === 'card'}
								<div class="grid gap-6 sm:grid-cols-4">
									<div class="flex flex-col gap-2 sm:col-span-2">
										<label for="card-number" class="type-label">Card number</label>
										<input
											id="card-number"
											{...fields.cardNumber.as('text')}
											inputmode="numeric"
											autocomplete="cc-number"
											placeholder="4242 4242 4242 4242"
											class="tnum {inputClass}"
										/>
										{#each fields.cardNumber.issues() ?? [] as issue, key (key)}
											<p class="text-sm text-ink">{issue.message}</p>
										{/each}
									</div>

									<div class="flex flex-col gap-2">
										<label for="card-expiry" class="type-label">Expiry</label>
										<input
											id="card-expiry"
											{...fields.cardExpiry.as('text')}
											autocomplete="cc-exp"
											placeholder="09/29"
											class="tnum {inputClass}"
										/>
										{#each fields.cardExpiry.issues() ?? [] as issue, key (key)}
											<p class="text-sm text-ink">{issue.message}</p>
										{/each}
									</div>

									<div class="flex flex-col gap-2">
										<label for="card-cvc" class="type-label">Security code</label>
										<input
											id="card-cvc"
											{...fields.cardCvc.as('text')}
											autocomplete="cc-csc"
											inputmode="numeric"
											placeholder="123"
											class="tnum {inputClass}"
										/>
										{#each fields.cardCvc.issues() ?? [] as issue, key (key)}
											<p class="text-sm text-ink">{issue.message}</p>
										{/each}
									</div>
								</div>
							{:else}
								<div class="flex max-w-sm flex-col gap-2">
									<label for="wallet-number" class="type-label">
										{method === 'bkash' ? 'bKash' : 'Nagad'} account
									</label>
									<input
										id="wallet-number"
										{...fields.walletNumber.as('tel')}
										placeholder="01712345678"
										class="tnum {inputClass}"
									/>
									{#each fields.walletNumber.issues() ?? [] as issue, key (key)}
										<p class="text-sm text-ink">{issue.message}</p>
									{/each}
								</div>
							{/if}

							<p class="type-label">
								Nothing is charged. This is a demonstration and no card details are stored.
							</p>
						</section>

						<Button type="submit" loading={form.pending > 0} arrow>
							Pay {formatMoney(record.totalMinor)}
						</Button>
					</form>
				{/if}

				<section aria-labelledby="travellers-heading" class="space-y-5">
					<h2 id="travellers-heading" class="type-label">Travelling</h2>
					<ul class="border-t border-rule">
						{#each record.passengers as person (person.seatCode)}
							<li class="flex items-baseline justify-between gap-4 border-b border-rule py-3">
								<span class="text-sm text-ink">{person.fullName}</span>
								<span class="type-label">Seat {person.seatCode}</span>
								<span class="tnum text-sm text-muted">{formatMoney(person.fareMinor)}</span>
							</li>
						{/each}
					</ul>
				</section>
			</div>

			<aside class="lg:sticky lg:top-8 lg:self-start">
				<div class="space-y-5 rounded-sm bg-surface p-6">
					<h2 class="type-label">Your journey</h2>

					<div class="space-y-1">
						<p class="text-lg text-ink" style="font-stretch: 88%;">
							{record.trip.operator.name}
						</p>
						<p class="type-label">{record.trip.code}</p>
					</div>

					<div class="space-y-1 text-sm">
						<p class="text-muted">{formatDateLong(record.trip.departAt)}</p>
						<p class="tnum text-ink">
							{formatTime(record.trip.departAt)} — {formatTime(record.trip.arriveAt)}
						</p>
						<p class="text-muted">{record.trip.originStop.name}</p>
					</div>

					<dl class="space-y-2 border-t border-rule-strong pt-4 text-sm">
						<div class="flex justify-between gap-3">
							<dt class="text-muted">Fares</dt>
							<dd class="tnum text-ink">{formatMoney(record.fareMinor)}</dd>
						</div>
						<div class="flex justify-between gap-3">
							<dt class="text-muted">Booking fee</dt>
							<dd class="tnum text-ink">{formatMoney(record.feesMinor)}</dd>
						</div>
						<div class="flex items-baseline justify-between gap-3 border-t border-rule-strong pt-2">
							<dt class="type-label">Total</dt>
							<dd class="tnum text-xl text-ink">{formatMoney(record.totalMinor)}</dd>
						</div>
					</dl>
				</div>
			</aside>
		</div>
	{/if}
</div>
