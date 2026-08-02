import { mulberry32, hashString } from '#lib/domain/random';

const WIDTH = 640;
const HEIGHT = 800;
const LINES = 34;
/** Sampling step in px; coarse enough to keep the file small, fine enough to stay smooth. */
const STEP = 20;

/**
 * Draws a contour field for a place, seeded by its name and real coordinates. The
 * output is used as a CSS mask, so it takes its colour from the theme rather than
 * carrying any of its own.
 */
export function cityArtwork(id: string, latitude: number, longitude: number): string {
	const seed = hashString(`${id}:${latitude.toFixed(3)}:${longitude.toFixed(3)}`);
	const random = mulberry32(seed);

	// Three wave components per city give each one its own rhythm.
	const waves = Array.from({ length: 3 }, () => ({
		length: 70 + random() * 240,
		amplitude: 12 + random() * 54,
		phase: random() * Math.PI * 2
	}));

	// A horizon splits the field, echoing the delta country these cities sit in.
	const horizon = 0.22 + random() * 0.56;

	const paths: string[] = [];

	for (let i = 0; i < LINES; i++) {
		const t = i / (LINES - 1);
		const baseY = t * HEIGHT;

		// Lines crowd towards the horizon and thin out away from it.
		const distance = Math.abs(t - horizon);
		const weight = Math.max(0.5, 2.1 - distance * 3.2);
		const swell = Math.max(0.12, 1 - distance * 1.6);

		const points: string[] = [];
		for (let x = 0; x <= WIDTH; x += STEP) {
			let y = baseY;
			for (const wave of waves) {
				y += Math.sin(x / wave.length + wave.phase + t * 6) * wave.amplitude * swell;
			}
			points.push(`${x},${Math.round(y)}`);
		}

		paths.push(
			`<polyline points="${points.join(' ')}" fill="none" stroke="#000" stroke-width="${weight.toFixed(1)}" stroke-linecap="round"/>`
		);
	}

	return [
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}">`,
		paths.join(''),
		'</svg>'
	].join('');
}
