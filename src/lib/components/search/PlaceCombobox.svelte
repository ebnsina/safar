<script lang="ts">
	import type { TransportMode } from '#lib/domain/modes';
	import type { PlaceView } from '#lib/domain/trip';
	import Icon from '../ui/Icon.svelte';
	import { ICONS } from '../ui/icons';
	import { placeOptions } from '../../../routes/search.remote';

	interface Props {
		id: string;
		name: string;
		label: string;
		mode: TransportMode;
		value: PlaceView | null;
		placeholder?: string;
		invalid?: boolean;
		onselect?: (place: PlaceView | null) => void;
	}

	let {
		id,
		name,
		label,
		mode,
		value = $bindable(),
		placeholder = 'City or town',
		invalid = false,
		onselect
	}: Props = $props();

	let term = $state('');
	let open = $state(false);
	let activeIndex = $state(0);
	let debounced = $state('');
	let timer: ReturnType<typeof setTimeout>;

	$effect(() => {
		const next = term;
		clearTimeout(timer);
		timer = setTimeout(() => (debounced = next), 140);
		return () => clearTimeout(timer);
	});

	const results = $derived(open ? placeOptions({ mode, term: debounced }) : undefined);
	const options = $derived(results?.current ?? []);

	function choose(place: PlaceView) {
		value = place;
		term = '';
		open = false;
		activeIndex = 0;
		onselect?.(place);
	}

	function clear() {
		value = null;
		term = '';
		onselect?.(null);
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			open = true;
			const step = event.key === 'ArrowDown' ? 1 : -1;
			activeIndex = (activeIndex + step + options.length) % Math.max(options.length, 1);
		} else if (event.key === 'Enter' && open && options[activeIndex]) {
			event.preventDefault();
			choose(options[activeIndex]);
		} else if (event.key === 'Escape') {
			open = false;
		}
	}
</script>

<div class="relative flex flex-col gap-2">
	<label for={id} class="type-label">{label}</label>

	<input type="hidden" {name} value={value?.id ?? ''} />

	{#if value}
		<div class="flex h-11 items-center gap-2 border-b border-rule-strong pb-1">
			<span class="shrink-0 text-faint" aria-hidden="true">
				<Icon icon={ICONS.place} size={15} />
			</span>
			<span class="flex-1 truncate text-ink">{value.name}</span>
			<button
				type="button"
				onclick={clear}
				class="text-faint transition-colors duration-160 hover:text-ink"
				aria-label="Clear {label.toLowerCase()}"
			>
				<Icon icon={ICONS.clear} size={14} />
			</button>
		</div>
	{:else}
		<div class="flex h-11 items-center gap-2 border-b border-rule-strong pb-1">
			<span class="shrink-0 text-faint" aria-hidden="true">
				<Icon icon={ICONS.place} size={15} />
			</span>
			<input
				{id}
				type="text"
				role="combobox"
				autocomplete="off"
				aria-expanded={open}
				aria-controls="{id}-listbox"
				aria-activedescendant={open && options[activeIndex]
					? `${id}-option-${activeIndex}`
					: undefined}
				aria-invalid={invalid || undefined}
				{placeholder}
				bind:value={term}
				onfocus={() => (open = true)}
				onblur={() => setTimeout(() => (open = false), 120)}
				onkeydown={onKeydown}
				class="w-full border-0 bg-transparent p-0 text-ink placeholder:text-faint focus:ring-0"
			/>
		</div>
	{/if}

	{#if open && !value}
		<ul
			id="{id}-listbox"
			role="listbox"
			aria-label={label}
			class="absolute top-full right-0 left-0 z-30 mt-1 max-h-64 overflow-auto border border-rule-strong bg-paper py-1"
		>
			{#if results?.loading && options.length === 0}
				<li class="px-3 py-2 text-sm text-faint">Searching</li>
			{:else if options.length === 0}
				<li class="px-3 py-2 text-sm text-faint">
					Nothing matches “{debounced}” — try another spelling.
				</li>
			{:else}
				{#each options as place, index (place.id)}
					<li
						id="{id}-option-{index}"
						role="option"
						aria-selected={index === activeIndex}
						class="aria-selected:bg-surface"
					>
						<button
							type="button"
							class="flex w-full items-baseline gap-3 px-3 py-2 text-left"
							onmousedown={(event) => event.preventDefault()}
							onclick={() => choose(place)}
							onmouseenter={() => (activeIndex = index)}
						>
							<span class="text-sm text-ink">{place.name}</span>
							<span class="type-label ml-auto">{place.division}</span>
						</button>
					</li>
				{/each}
			{/if}
		</ul>
	{/if}
</div>
