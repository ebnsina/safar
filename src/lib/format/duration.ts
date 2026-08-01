import { getRegion, type RegionCode } from '#lib/config/region';
import { listFormat, numberFormat } from './cache';

const durationFormatCache = new Map<string, Intl.DurationFormat>();

function durationFormat(locale: string, style: 'narrow' | 'short' | 'long') {
	const key = `${locale}:${style}`;
	let formatter = durationFormatCache.get(key);
	if (!formatter) {
		formatter = new Intl.DurationFormat(locale, { style });
		durationFormatCache.set(key, formatter);
	}
	return formatter;
}

/** Composes hours and minutes through Intl unit formatting where DurationFormat is unsupported. */
function formatViaUnits(locale: string, hours: number, minutes: number): string {
	const parts: string[] = [];
	if (hours > 0) {
		parts.push(
			numberFormat(locale, { style: 'unit', unit: 'hour', unitDisplay: 'short' }).format(hours)
		);
	}
	if (minutes > 0 || hours === 0) {
		parts.push(
			numberFormat(locale, { style: 'unit', unit: 'minute', unitDisplay: 'short' }).format(minutes)
		);
	}
	return listFormat(locale, { style: 'narrow', type: 'unit' }).format(parts);
}

export function formatDuration(
	totalMinutes: number,
	region?: RegionCode,
	style: 'narrow' | 'short' | 'long' = 'short'
): string {
	const { locale } = getRegion(region);
	const minutes = Math.max(0, Math.round(totalMinutes));
	const duration = { hours: Math.floor(minutes / 60), minutes: minutes % 60 };

	if (typeof Intl.DurationFormat === 'function') {
		return durationFormat(locale, style).format(duration);
	}
	return formatViaUnits(locale, duration.hours, duration.minutes);
}

export function formatDistance(km: number, region?: RegionCode): string {
	return numberFormat(getRegion(region).locale, {
		style: 'unit',
		unit: 'kilometer',
		unitDisplay: 'short',
		maximumFractionDigits: 0
	}).format(km);
}
