<script lang="ts">
	import type { TransportMode } from '#lib/domain/modes';
	import type { Seat, SeatMap } from '#lib/domain/seating';
	import SeatButton from './SeatButton.svelte';
	import VehicleShell from './VehicleShell.svelte';

	interface Props {
		map: SeatMap;
		mode: TransportMode;
		selected: string[];
		max: number;
		ontoggle: (seat: Seat) => void;
	}

	let { map, mode, selected, max, ontoggle }: Props = $props();

	let activeDeck = $state(0);

	const multiDeck = $derived(map.decks.length > 1);
	const deck = $derived(map.decks[activeDeck] ?? map.decks[0]);
	const blocked = $derived(selected.length >= max);
	const chosen = $derived(new Set(selected));

	const exitRows = $derived(new Set(deck.deck.exitRows ?? []));
	const legroomRows = $derived(new Set(deck.deck.legroomRows ?? []));

	const deckAvailability = $derived(
		map.decks.map(
			(entry) =>
				entry.rows.flat().filter((seat) => seat !== null && seat.status === 'available').length
		)
	);

	const exitLabel = $derived(mode === 'air' ? 'Exit' : 'Door');
	// Aircraft have exits either side; a Bangladeshi coach boards from the left only.
	const exitSides = $derived<('left' | 'right')[]>(
		mode === 'air' ? ['left', 'right'] : mode === 'bus' ? ['left'] : []
	);
</script>

<div class="space-y-6">
	{#if multiDeck}
		<div role="tablist" aria-label={map.layout.deckLabel} class="flex flex-wrap gap-6">
			{#each map.decks as entry, index (entry.deck.id)}
				<button
					type="button"
					role="tab"
					aria-selected={activeDeck === index}
					onclick={() => (activeDeck = index)}
					class="type-button -mb-px border-b border-transparent pb-2 text-faint transition-colors duration-160 hover:text-ink aria-selected:border-ink aria-selected:text-ink"
				>
					{entry.deck.id}
					<span class="tnum ml-1.5 opacity-60">{deckAvailability[index]}</span>
				</button>
			{/each}
		</div>
	{/if}

	<div class="overflow-x-auto">
		<div class="mx-auto w-fit min-w-[19rem]">
			<VehicleShell {mode} label={deck.deck.label}>
				<div class="space-y-1.5">
					{#each deck.rows as row, rowIndex (rowIndex)}
						{@const rowNumber = rowIndex + 1}
						{@const isExit = exitRows.has(rowNumber)}
						<div class="flex items-center gap-2">
							<span
								class="type-label w-8 shrink-0 text-right {isExit && exitSides.includes('left')
									? 'text-ink'
									: 'text-transparent'}"
							>
								{isExit && exitSides.includes('left') ? exitLabel : ''}
							</span>

							<span
								class="type-label tnum w-5 shrink-0 text-right {legroomRows.has(rowNumber)
									? 'text-ink'
									: ''}"
								aria-hidden="true"
							>
								{rowNumber}
							</span>

							<div class="flex items-center gap-1.5">
								{#each row as cell, cellIndex (cellIndex)}
									{#if cell}
										<SeatButton
											seat={cell}
											selected={chosen.has(cell.code)}
											{blocked}
											legroom={legroomRows.has(rowNumber)}
											{ontoggle}
										/>
									{:else}
										<div class="w-5" aria-hidden="true"></div>
									{/if}
								{/each}
							</div>

							<span
								class="type-label w-8 shrink-0 {isExit && exitSides.includes('right')
									? 'text-ink'
									: 'text-transparent'}"
							>
								{isExit && exitSides.includes('right') ? exitLabel : ''}
							</span>
						</div>
					{/each}
				</div>
			</VehicleShell>
		</div>
	</div>

	<ul class="flex flex-wrap gap-6">
		<li class="type-label flex items-center gap-2">
			<span class="size-3 border border-rule-strong" aria-hidden="true"></span>
			Free
		</li>
		<li class="type-label flex items-center gap-2">
			<span class="size-3 bg-inverse-paper" aria-hidden="true"></span>
			Chosen
		</li>
		<li class="type-label flex items-center gap-2">
			<span class="size-3 border border-rule bg-rule" aria-hidden="true"></span>
			Taken
		</li>
		{#if legroomRows.size > 0}
			<li class="type-label">
				<span class="text-ink">Darker row numbers</span> have extra legroom
			</li>
		{/if}
	</ul>
</div>
