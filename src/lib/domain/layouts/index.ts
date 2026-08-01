import type { TransportMode } from '../modes';
import type { SeatLayout } from '../seating';
import { AIR_LAYOUTS } from './air';
import { BUS_LAYOUTS } from './bus';
import { TRAIN_LAYOUTS } from './train';

export const LAYOUTS: readonly SeatLayout[] = [...BUS_LAYOUTS, ...TRAIN_LAYOUTS, ...AIR_LAYOUTS];

const BY_ID = new Map(LAYOUTS.map((layout) => [layout.id, layout]));

export function getLayout(id: string): SeatLayout | undefined {
	return BY_ID.get(id);
}

export function layoutsForMode(mode: TransportMode): SeatLayout[] {
	return LAYOUTS.filter((layout) => layout.mode === mode);
}

/** Every fare class code offered in a mode, cheapest first — powers the class filter. */
export function fareClassesForMode(mode: TransportMode) {
	const seen = new Map<string, { code: string; name: string; multiplier: number }>();
	for (const layout of layoutsForMode(mode)) {
		for (const spec of layout.classes) {
			if (!seen.has(spec.code)) {
				seen.set(spec.code, { code: spec.code, name: spec.name, multiplier: spec.multiplier });
			}
		}
	}
	return [...seen.values()].sort((a, b) => a.multiplier - b.multiplier);
}

export { AIR_LAYOUTS, BUS_LAYOUTS, TRAIN_LAYOUTS };
