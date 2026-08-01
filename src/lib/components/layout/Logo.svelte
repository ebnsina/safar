<script lang="ts">
	import { SITE } from '#lib/config/site';

	interface Props {
		href?: string;
	}

	let { href = '/' }: Props = $props();
</script>

<!-- Both spellings occupy one grid cell, so the hover swap shifts nothing. -->
<a
	{href}
	class="group grid items-baseline text-ink"
	aria-label="{SITE.name} home"
	style="grid-template-areas: 'mark'"
>
	<span
		class="text-[1.0625rem] font-bold transition-opacity duration-160 group-hover:opacity-0"
		style="grid-area: mark; font-stretch: 86%; letter-spacing: -0.03em;"
	>
		{SITE.name}<span class="font-normal text-muted">.</span>
	</span>
	<span
		class="arabic text-[1.0625rem] opacity-0 transition-opacity duration-160 group-hover:opacity-100"
		style="grid-area: mark;"
		aria-hidden="true"
	>
		{SITE.nameArabic}
	</span>
</a>
