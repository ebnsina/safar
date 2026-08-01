<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TransportMode } from '#lib/domain/modes';
	import Icon from '../ui/Icon.svelte';
	import { ICONS } from '../ui/icons';

	interface Props {
		mode: TransportMode;
		/** Coach or deck name, printed on the shell. */
		label: string;
		children: Snippet;
	}

	let { mode, label, children }: Props = $props();

	// Each mode gets the silhouette of the thing you actually board.
	const SHELL: Record<TransportMode, string> = {
		bus: 'rounded-t-[2.5rem] rounded-b-md',
		train: 'rounded-none',
		air: 'rounded-t-[6rem] rounded-b-[3rem]'
	};

	const NOSE: Record<TransportMode, string> = {
		bus: 'Windscreen',
		train: 'Forward vestibule',
		air: 'Nose'
	};

	const TAIL: Record<TransportMode, string> = {
		bus: 'Rear',
		train: 'Rear vestibule',
		air: 'Tail'
	};
</script>

<div class="relative border border-rule-strong {SHELL[mode]} bg-paper px-5 pt-6 pb-8 sm:px-8">
	<p class="type-label text-center">{NOSE[mode]}</p>

	{#if mode === 'bus'}
		<!-- Bangladesh drives on the left, so the cab sits front-right and boarding is left. -->
		<div class="mt-4 flex items-center justify-end px-1">
			<span class="flex items-center gap-2 text-muted">
				<span class="type-label">Driver</span>
				<span
					class="flex size-7 items-center justify-center rounded-full border border-rule-strong"
				>
					<Icon icon={ICONS.bus} size={13} />
				</span>
			</span>
		</div>
	{:else if mode === 'train'}
		<!-- Couplings mark where this coach joins the rest of the rake. -->
		<div class="mt-4 flex items-center gap-2 px-1" aria-hidden="true">
			<span class="flex-1 border-t border-dashed border-rule-strong"></span>
			<span class="type-label">Coupling</span>
			<span class="flex-1 border-t border-dashed border-rule-strong"></span>
		</div>
	{:else}
		<div class="mt-4 flex items-center justify-between px-1">
			<span class="type-label">Galley</span>
			<span class="type-label">Lavatory</span>
		</div>
	{/if}

	<div class="mt-6 flex justify-center">
		{@render children()}
	</div>

	<div class="mt-6">
		{#if mode === 'train'}
			<div class="flex items-center gap-2 px-1" aria-hidden="true">
				<span class="flex-1 border-t border-dashed border-rule-strong"></span>
				<span class="type-label">Coupling</span>
				<span class="flex-1 border-t border-dashed border-rule-strong"></span>
			</div>
		{/if}
		<p class="type-label mt-3 text-center">{TAIL[mode]} · {label}</p>
	</div>
</div>
