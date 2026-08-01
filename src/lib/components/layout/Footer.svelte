<script lang="ts">
	import { getRegion } from '#lib/config/region';
	import { SITE } from '#lib/config/site';

	const region = getRegion();
	const year = new Date().getFullYear();

	const groups = [
		{
			heading: 'Travel',
			links: [
				{ href: '/search/bus', label: 'Bus tickets' },
				{ href: '/search/train', label: 'Train tickets' },
				{ href: '/search/air', label: 'Flights' }
			]
		},
		{
			heading: 'Help',
			links: [{ href: '/bookings', label: 'Find my booking' }]
		}
	];
</script>

<footer class="mt-24 bg-surface">
	<div
		class="mx-auto grid max-w-(--container-shell) gap-10 px-(--spacing-gutter) py-14 sm:grid-cols-[1fr_auto_auto] sm:gap-16"
	>
		<div class="space-y-3">
			<p class="type-section">{SITE.tagline}</p>
			<p class="max-w-sm text-sm text-muted">Serving {region.country}.</p>
		</div>

		{#each groups as group (group.heading)}
			<nav aria-label={group.heading} class="space-y-3">
				<p class="type-label">{group.heading}</p>
				<ul class="space-y-2">
					{#each group.links as link (link.href)}
						<li>
							<a
								href={link.href}
								class="text-sm text-muted transition-colors duration-160 hover:text-ink"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		{/each}
	</div>

	<div class="mx-auto max-w-(--container-shell) px-(--spacing-gutter) pb-10">
		<p class="type-label">
			© {year}
			{SITE.name} · Demonstration data, no real tickets are sold
		</p>
	</div>
</footer>
