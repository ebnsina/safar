<script lang="ts">
	import { page } from '$app/state';
	import Meta from '#lib/components/Meta.svelte';
	import SeatMap from '#lib/components/seats/SeatMap.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { ICONS } from '#lib/components/ui/icons';
	import { CheckoutSchema } from '#lib/domain/booking';
	import { describeMode } from '#lib/domain/modes';
	import { priceBooking } from '#lib/domain/pricing';
	import { MAX_PASSENGERS } from '#lib/domain/search';
	import { collectSeats, type Seat } from '#lib/domain/seating';
	import {
		formatCount,
		formatDateLong,
		formatDistance,
		formatDuration,
		formatMoney,
		formatTime
	} from '#lib/format';
	import { beginCheckout, tripDetail, tripSeatMap } from './trip.remote';

	const tripId = $derived(page.params.id ?? '');
	const requested = $derived(Number(page.url.searchParams.get('pax') ?? '1'));

	const detail = $derived(tripDetail(tripId));
	const seats = $derived(tripSeatMap(tripId));

	const trip = $derived(detail.current);
	const map = $derived(seats.current);

	const allowance = $derived(
		trip ? Math.min(describeMode(trip.mode).maxSeatsPerBooking, MAX_PASSENGERS) : MAX_PASSENGERS
	);
	const target = $derived(
		Number.isFinite(requested) ? Math.min(Math.max(requested, 1), allowance) : 1
	);

	let selected = $state<string[]>([]);

	/** Traveller type and gender per seat, so the selects submit a value from the start. */
	let details = $state<
		Record<string, { type: 'adult' | 'child'; gender: 'male' | 'female' | 'unspecified' }>
	>({});

	const selectedSeats = $derived(
		map ? collectSeats(map).filter((seat) => selected.includes(seat.code)) : []
	);
	const breakdown = $derived(priceBooking(selectedSeats.map((seat) => seat.priceMinor)));

	const form = $derived(beginCheckout.preflight(CheckoutSchema));
	const fields = $derived(form.fields);

	const inputClass =
		'border-rule-strong text-ink h-11 w-full border-0 border-b bg-transparent p-0 pb-1 text-sm focus:ring-0';

	function toggle(seat: Seat) {
		if (selected.includes(seat.code)) {
			selected = selected.filter((code) => code !== seat.code);
			return;
		}
		if (selected.length >= allowance) return;

		details[seat.code] ??= { type: 'adult', gender: 'unspecified' };
		selected = [...selected, seat.code];
	}
</script>

<Meta
	title={trip
		? `${trip.operator.name} ${trip.code} — ${trip.origin.name} to ${trip.destination.name}`
		: 'Journey'}
	description={trip
		? `Choose your seat on the ${formatTime(trip.departAt)} ${trip.operator.name} service from ${trip.originStop.name} to ${trip.destinationStop.name}.`
		: undefined}
/>

<div class="mx-auto max-w-(--container-shell) px-(--spacing-gutter) py-10">
	{#if detail.loading && !trip}
		<div class="h-40 animate-pulse rounded-sm bg-surface"></div>
	{:else if trip}
		<header class="flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-8">
			<div class="space-y-3">
				<p class="type-label">
					{trip.operator.name} · {trip.code} · {formatDateLong(trip.departAt)}
				</p>
				<h1 class="type-title">{trip.origin.name} — {trip.destination.name}</h1>
				<p class="type-label inline-flex items-center gap-1.5">
					<Icon icon={ICONS.rating} size={12} />
					<span class="tnum">{(trip.operator.rating / 10).toFixed(1)}</span>
					<span>from {formatCount(trip.operator.ratingCount)} travellers</span>
				</p>
			</div>

			<div class="text-right">
				<p class="type-label">Fares from</p>
				<p class="tnum mt-1 text-3xl text-ink">{formatMoney(trip.fromFareMinor)}</p>
			</div>
		</header>

		<form {...form} class="grid gap-12 py-10 lg:grid-cols-[1fr_19rem]">
			<input {...fields.tripId.as('hidden', trip.id)} />

			<div class="min-w-0 space-y-14">
				<section aria-labelledby="journey-heading" class="grid gap-10 sm:grid-cols-2">
					<div class="space-y-5">
						<h2 id="journey-heading" class="type-label">Journey</h2>

						<ol>
							{#each trip.calls as call, index (call.sequence)}
								{@const terminus = index === 0 || index === trip.calls.length - 1}
								<li class="flex gap-4">
									<div class="flex flex-col items-center">
										<span
											class="mt-2 size-1.5 rounded-full {terminus
												? 'bg-ink'
												: 'border border-rule-strong'}"
											aria-hidden="true"
										></span>
										{#if index < trip.calls.length - 1}
											<span class="w-px flex-1 bg-rule" aria-hidden="true"></span>
										{/if}
									</div>

									<div class="flex-1 pb-6">
										<p class="tnum text-sm text-ink">{formatTime(call.arriveAt)}</p>
										<p class="text-sm text-muted">{call.stop.name}</p>
										{#if terminus}
											<p class="type-label mt-0.5">
												{index === 0 ? 'Departs' : 'Arrives'} · {call.stop.placeName}
											</p>
										{/if}
									</div>
								</li>
							{/each}
						</ol>

						<p class="type-label flex flex-wrap items-center gap-4">
							<span class="inline-flex items-center gap-1.5">
								<Icon icon={ICONS.duration} size={12} />
								{formatDuration(trip.durationMinutes)}
							</span>
							{#if trip.distanceKm > 0}
								<span>{formatDistance(trip.distanceKm)}</span>
							{/if}
						</p>
					</div>

					<div class="space-y-10">
						<div class="space-y-4">
							<h2 class="type-label">Fares</h2>
							{#each trip.fares as fare (fare.code)}
								<div class="space-y-1 border-b border-rule pb-3">
									<div class="flex items-baseline justify-between gap-3">
										<p class="text-sm text-ink">{fare.name}</p>
										<p class="tnum text-ink">{formatMoney(fare.priceMinor)}</p>
									</div>
									<p class="type-label">
										{fare.baggageKg} kg · {fare.refundable ? 'Refundable' : 'Non-refundable'}
									</p>
								</div>
							{/each}
						</div>

						<div class="space-y-4">
							<h2 class="type-label">On board</h2>
							<ul class="grid gap-2 text-sm text-muted">
								{#each trip.operator.amenities as amenity (amenity)}
									<li class="flex items-center gap-2.5">
										<span class="shrink-0 text-faint" aria-hidden="true">
											<Icon icon={ICONS.included} size={13} />
										</span>
										{amenity}
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</section>

				<section aria-labelledby="seats-heading" class="space-y-5">
					<div class="flex flex-wrap items-baseline justify-between gap-3">
						<h2 id="seats-heading" class="type-label">Seats</h2>
						<p class="type-label tnum">{selected.length} / {allowance}</p>
					</div>

					{#if seats.loading && !map}
						<div class="h-80 animate-pulse rounded-sm bg-surface"></div>
					{:else if seats.error}
						<Alert tone="warning" title="The seat map did not load">
							Refresh the page to try again.
						</Alert>
					{:else if map}
						<SeatMap {map} mode={trip.mode} {selected} max={allowance} ontoggle={toggle} />
					{/if}
				</section>

				{#if selectedSeats.length > 0}
					<section aria-labelledby="travellers-heading" class="space-y-8">
						<h2 id="travellers-heading" class="type-label">Travellers</h2>

						{#each selectedSeats as seat, index (seat.code)}
							<fieldset class="space-y-6 border-t border-rule pt-6">
								<legend class="type-label">
									Seat <span class="tnum">{seat.code}</span> · {formatMoney(seat.priceMinor)}
								</legend>

								<input {...fields.passengers[index].seatCode.as('hidden', seat.code)} />

								<div class="grid gap-6 sm:grid-cols-2">
									<div class="flex flex-col gap-2 sm:col-span-2">
										<label for="name-{index}" class="type-label">Full name</label>
										<input
											id="name-{index}"
											{...fields.passengers[index].fullName.as('text')}
											autocomplete="off"
											placeholder="As printed on the ID"
											class={inputClass}
										/>
										{#each fields.passengers[index].fullName.issues() ?? [] as issue, key (key)}
											<p class="text-sm text-ink">{issue.message}</p>
										{/each}
									</div>

									<div class="flex flex-col gap-2">
										<label for="type-{index}" class="type-label">Traveller type</label>
										<select
											id="type-{index}"
											name={fields.passengers[index].type.as('select').name}
											bind:value={details[seat.code].type}
											class={inputClass}
										>
											<option value="adult">Adult</option>
											<option value="child">Child</option>
										</select>
									</div>

									<div class="flex flex-col gap-2">
										<label for="gender-{index}" class="type-label">Gender</label>
										<select
											id="gender-{index}"
											name={fields.passengers[index].gender.as('select').name}
											bind:value={details[seat.code].gender}
											class={inputClass}
										>
											<option value="unspecified">Prefer not to say</option>
											<option value="male">Male</option>
											<option value="female">Female</option>
										</select>
									</div>

									<div class="flex flex-col gap-2">
										<label for="age-{index}" class="type-label">Age · optional</label>
										<input
											id="age-{index}"
											{...fields.passengers[index].age.as('number')}
											min="0"
											max="120"
											class="tnum {inputClass}"
										/>
									</div>

									<div class="flex flex-col gap-2">
										<label for="doc-{index}" class="type-label">ID number · optional</label>
										<input
											id="doc-{index}"
											{...fields.passengers[index].documentId.as('text')}
											autocomplete="off"
											class={inputClass}
										/>
									</div>
								</div>
							</fieldset>
						{/each}
					</section>

					<section aria-labelledby="contact-heading" class="space-y-6">
						<h2 id="contact-heading" class="type-label">Where the ticket goes</h2>

						<div class="grid gap-6 sm:grid-cols-3">
							<div class="flex flex-col gap-2">
								<label for="contact-name" class="type-label">Contact name</label>
								<input
									id="contact-name"
									{...fields.contactName.as('text')}
									autocomplete="name"
									class={inputClass}
								/>
								{#each fields.contactName.issues() ?? [] as issue, key (key)}
									<p class="text-sm text-ink">{issue.message}</p>
								{/each}
							</div>

							<div class="flex flex-col gap-2">
								<label for="contact-email" class="type-label">Email</label>
								<input
									id="contact-email"
									{...fields.contactEmail.as('email')}
									autocomplete="email"
									class={inputClass}
								/>
								{#each fields.contactEmail.issues() ?? [] as issue, key (key)}
									<p class="text-sm text-ink">{issue.message}</p>
								{/each}
							</div>

							<div class="flex flex-col gap-2">
								<label for="contact-phone" class="type-label">Mobile</label>
								<input
									id="contact-phone"
									{...fields.contactPhone.as('tel')}
									autocomplete="tel"
									placeholder="01712345678"
									class="tnum {inputClass}"
								/>
								{#each fields.contactPhone.issues() ?? [] as issue, key (key)}
									<p class="text-sm text-ink">{issue.message}</p>
								{/each}
							</div>
						</div>
					</section>
				{/if}
			</div>

			<aside class="lg:sticky lg:top-8 lg:self-start">
				<div class="space-y-5 rounded-sm bg-surface p-6">
					<h2 class="type-label">Your selection</h2>

					{#if selectedSeats.length === 0}
						<p class="text-sm text-muted">
							Pick {target === 1 ? 'a seat' : `${target} seats`} to continue.
						</p>
					{:else}
						<ul class="space-y-2 text-sm">
							{#each selectedSeats as seat (seat.code)}
								<li class="flex justify-between gap-3">
									<span class="tnum text-muted">{seat.code}</span>
									<span class="tnum text-ink">{formatMoney(seat.priceMinor)}</span>
								</li>
							{/each}
						</ul>

						<dl class="space-y-2 border-t border-rule-strong pt-4 text-sm">
							<div class="flex justify-between gap-3">
								<dt class="text-muted">Fares</dt>
								<dd class="tnum text-ink">{formatMoney(breakdown.fareMinor)}</dd>
							</div>
							<div class="flex justify-between gap-3">
								<dt class="text-muted">Booking fee</dt>
								<dd class="tnum text-ink">{formatMoney(breakdown.feesMinor)}</dd>
							</div>
							<div
								class="flex items-baseline justify-between gap-3 border-t border-rule-strong pt-2"
							>
								<dt class="type-label">Total</dt>
								<dd class="tnum text-xl text-ink">{formatMoney(breakdown.totalMinor)}</dd>
							</div>
						</dl>

						<Button full type="submit" loading={form.pending > 0} arrow>Continue</Button>

						<p class="type-label">Seats held ten minutes</p>
					{/if}
				</div>
			</aside>
		</form>
	{/if}
</div>
