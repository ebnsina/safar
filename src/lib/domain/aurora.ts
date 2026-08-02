import { mulberry32, hashString } from './random';

export interface AuroraRibbon {
	/** Percentages within the card. */
	x: number;
	y: number;
	width: number;
	height: number;
	rotate: number;
	opacity: number;
	blur: number;
	/** Seconds, so each ribbon drifts on its own clock. */
	duration: number;
	delay: number;
}

const RIBBONS = 5;

/**
 * A drifting aurora, seeded by a place and its real coordinates. Ribbons are long and
 * shallow rather than round, which is what separates an aurora from a smudge. Each is
 * painted in `currentColor`, so the whole field stays monochrome and inverts with the
 * theme — only opacity and scale carry the tonal range.
 */
export function auroraFor(id: string, latitude: number, longitude: number): AuroraRibbon[] {
	const random = mulberry32(hashString(`${id}:${latitude.toFixed(3)}:${longitude.toFixed(3)}`));

	return Array.from({ length: RIBBONS }, (_, index) => {
		// The first two ribbons carry the composition; the rest are highlights.
		const primary = index < 2;
		return {
			x: 18 + random() * 64,
			y: 16 + random() * 68,
			width: primary ? 105 + random() * 75 : 60 + random() * 70,
			height: primary ? 26 + random() * 26 : 14 + random() * 20,
			rotate: -52 + random() * 104,
			opacity: primary ? 0.42 + random() * 0.26 : 0.16 + random() * 0.28,
			blur: primary ? 22 + random() * 20 : 14 + random() * 22,
			duration: 20 + random() * 24,
			delay: -random() * 22
		};
	});
}
