import type { TransportMode } from '#lib/domain/modes';

export type RegionCode = 'BD';

export interface Region {
	code: RegionCode;
	country: string;
	locale: string;
	currency: string;
	timeZone: string;
	modes: readonly TransportMode[];
	/** Longest sensible journey; bounds date pickers and seed generation. */
	maxAdvanceDays: number;
}

/** Markets the app serves. Adding one means adding an entry plus a seed catalog folder. */
export const REGIONS: Record<RegionCode, Region> = {
	BD: {
		code: 'BD',
		country: 'Bangladesh',
		locale: 'en-BD',
		currency: 'BDT',
		timeZone: 'Asia/Dhaka',
		modes: ['bus', 'train', 'air'],
		maxAdvanceDays: 60
	}
};

export const DEFAULT_REGION: RegionCode = 'BD';

export function getRegion(code: RegionCode = DEFAULT_REGION): Region {
	return REGIONS[code];
}
