import { mkdirSync, writeFileSync } from 'node:fs';
import { FEATURED_CITIES } from '#lib/domain/featured';
import { BD_PLACES } from './catalog/bd/places';
import { cityArtwork } from './artwork';

const OUT_DIR = 'static/cities';

/** Regenerates the city artwork. Deterministic, so a rerun changes nothing. */
function main() {
	mkdirSync(OUT_DIR, { recursive: true });

	for (const city of FEATURED_CITIES) {
		const place = BD_PLACES.find((entry) => entry.id === city.id);
		if (!place) {
			console.warn(`  skipped ${city.id} — not in the place catalog`);
			continue;
		}

		const svg = cityArtwork(place.id, place.latitude, place.longitude);
		writeFileSync(`${OUT_DIR}/${place.id}.svg`, svg);
		console.log(`  ${place.id}.svg  ${(svg.length / 1024).toFixed(1)} kB`);
	}
}

main();
