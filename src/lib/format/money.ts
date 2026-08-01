import { getRegion, type RegionCode } from '#lib/config/region';
import { numberFormat } from './cache';

/** Fares are stored as integer minor units (paisa) so arithmetic never drifts. */
export type Minor = number;

export function toMinor(major: number): Minor {
	return Math.round(major * 100);
}

export function toMajor(minor: Minor): number {
	return minor / 100;
}

export function formatMoney(minor: Minor, region?: RegionCode): string {
	const { locale, currency } = getRegion(region);
	return numberFormat(locale, {
		style: 'currency',
		currency,
		// The narrow symbol gives ৳ rather than the BDT code.
		currencyDisplay: 'narrowSymbol',
		maximumFractionDigits: minor % 100 === 0 ? 0 : 2
	}).format(toMajor(minor));
}

/** Currency symbol alone, for compact contexts like filter sliders. */
export function currencySymbol(region?: RegionCode): string {
	const { locale, currency } = getRegion(region);
	const part = numberFormat(locale, {
		style: 'currency',
		currency,
		currencyDisplay: 'narrowSymbol'
	})
		.formatToParts(0)
		.find((entry) => entry.type === 'currency');
	return part?.value ?? currency;
}

export function formatCount(value: number, region?: RegionCode): string {
	return numberFormat(getRegion(region).locale).format(value);
}
