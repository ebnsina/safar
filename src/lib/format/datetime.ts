import { getRegion, type RegionCode } from '#lib/config/region';
import { dateTimeFormat, relativeTimeFormat } from './cache';

/** Instants are epoch milliseconds; every rendering is pinned to the region time zone. */
export type Instant = number;

function options(region: RegionCode | undefined, extra: Intl.DateTimeFormatOptions) {
	return { timeZone: getRegion(region).timeZone, ...extra };
}

export function formatTime(at: Instant, region?: RegionCode): string {
	return dateTimeFormat(
		getRegion(region).locale,
		options(region, { hour: '2-digit', minute: '2-digit', hour12: true })
	).format(at);
}

export function formatDateShort(at: Instant, region?: RegionCode): string {
	return dateTimeFormat(
		getRegion(region).locale,
		options(region, { weekday: 'short', day: 'numeric', month: 'short' })
	).format(at);
}

export function formatDateLong(at: Instant, region?: RegionCode): string {
	return dateTimeFormat(
		getRegion(region).locale,
		options(region, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
	).format(at);
}

export function formatDateTime(at: Instant, region?: RegionCode): string {
	return dateTimeFormat(
		getRegion(region).locale,
		options(region, {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true
		})
	).format(at);
}

/** ISO calendar date (YYYY-MM-DD) as seen in the region — the canonical URL/query form. */
export function toCalendarDate(at: Instant, region?: RegionCode): string {
	return dateTimeFormat(
		'en-CA',
		options(region, { year: 'numeric', month: '2-digit', day: '2-digit' })
	).format(at);
}

/** Whole days between two instants, compared on the region's calendar days. */
export function daysBetween(from: Instant, to: Instant, region?: RegionCode): number {
	const a = Date.parse(`${toCalendarDate(from, region)}T00:00:00Z`);
	const b = Date.parse(`${toCalendarDate(to, region)}T00:00:00Z`);
	return Math.round((b - a) / 86_400_000);
}

/** "tomorrow", "in 3 days" — for departure proximity hints. */
export function formatDayOffset(target: Instant, now: Instant, region?: RegionCode): string {
	const days = daysBetween(now, target, region);
	return relativeTimeFormat(getRegion(region).locale, { numeric: 'auto' }).format(days, 'day');
}
