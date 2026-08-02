<script lang="ts">
	import { getRegion } from '#lib/config/region';
	import { SITE } from '#lib/config/site';
	import { TRANSPORT_MODES, describeMode } from '#lib/domain/modes';
	import { contentFor } from '#lib/domain/mode-content';
	import { FEATURED_CITIES } from '#lib/domain/featured';
	import { toCalendarDate } from '#lib/format';
	import Meta from '#lib/components/Meta.svelte';
	import Section from '#lib/components/layout/Section.svelte';
	import CityCard from '#lib/components/home/CityCard.svelte';
	import Faq from '#lib/components/home/Faq.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { ICONS, MODE_ICONS } from '#lib/components/ui/icons';

	const region = getRegion();
	const tomorrow = toCalendarDate(Date.now() + 86_400_000);

	const steps = [
		{
			title: 'Choose how you travel',
			body: 'Coach, train or plane. Each has its own list, its own seat map and its own fares.'
		},
		{
			title: 'Pick the exact seat',
			body: 'Real availability, drawn to the layout of the vehicle you are actually boarding.'
		},
		{
			title: 'Pay once, nothing hidden',
			body: 'The booking fee is in the price from the first screen. Your seats are held while you pay.'
		}
	];
</script>

<Meta />

<section>
	<div class="mx-auto max-w-(--container-shell) px-(--spacing-gutter) pt-24 pb-20">
		<h1 class="type-hero max-w-[14ch]">{SITE.tagline}</h1>
		<p class="type-body mt-6 text-muted">
			Buses, trains and flights across {region.country}. Start by choosing how you want to travel.
		</p>
	</div>
</section>

<Section label="Choose one" rule>
	<ul>
		{#each TRANSPORT_MODES as mode (mode)}
			{@const content = contentFor(mode)}
			<li>
				<a
					href="/search/{mode}"
					class="group flex items-center gap-6 border-b border-rule py-8 transition-transform duration-160 ease-out-quart hover:translate-x-2.5 sm:gap-8 sm:py-10"
				>
					<span class="shrink-0 text-muted transition-colors duration-160 group-hover:text-ink">
						<Icon icon={MODE_ICONS[mode]} size={30} strokeWidth={1.5} />
					</span>

					<span class="min-w-0 flex-1">
						<span class="type-section block capitalize">{describeMode(mode).vehicles}</span>
						<span class="mt-1.5 block max-w-(--container-measure) text-muted">
							{content.summary}
						</span>
					</span>

					<span
						class="shrink-0 text-faint transition-colors duration-160 group-hover:text-ink"
						aria-hidden="true"
					>
						<Icon icon={ICONS.forward} size={20} />
					</span>
				</a>
			</li>
		{/each}
	</ul>
</Section>

<Section label="Where to" rule>
	<ul class="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
		{#each FEATURED_CITIES as city (city.id)}
			<li>
				<CityCard {city} date={tomorrow} />
			</li>
		{/each}
	</ul>
</Section>

<Section label="How it works" rule>
	<ol class="grid gap-10 sm:grid-cols-3">
		{#each steps as step, index (step.title)}
			<li class="space-y-3">
				<p class="type-label tnum">{String(index + 1).padStart(2, '0')}</p>
				<p class="text-lg text-ink" style="font-stretch: 92%;">{step.title}</p>
				<p class="text-sm text-muted">{step.body}</p>
			</li>
		{/each}
	</ol>
</Section>

<Section label="Questions" rule labelledBy="faq-heading">
	<h2 id="faq-heading" class="type-section mb-8">Before you book</h2>
	<Faq />
</Section>
