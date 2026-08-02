<script lang="ts">
	import { FAQ } from '#lib/domain/faq';
</script>

<div class="border-t border-rule">
	{#each FAQ as entry (entry.question)}
		<!-- Native disclosure: it opens without JavaScript and is keyboard operable for free. -->
		<details class="group border-b border-rule">
			<summary
				class="flex cursor-pointer list-none items-baseline justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden"
			>
				<span class="max-w-(--container-measure) text-lg text-ink" style="font-stretch: 92%;">
					{entry.question}
				</span>
				<span
					class="relative mt-2 size-3 shrink-0 text-faint transition-colors duration-160 group-hover:text-ink"
					aria-hidden="true"
				>
					<span class="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current"></span>
					<span
						class="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-out-quart group-open:scale-y-0"
					></span>
				</span>
			</summary>

			<p class="max-w-(--container-measure) pr-10 pb-6 text-sm text-muted">
				{entry.answer}
			</p>
		</details>
	{/each}
</div>
