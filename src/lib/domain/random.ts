/** FNV-1a 32-bit — stable across runtimes, which keeps derived data reproducible. */
export function hashString(value: string): number {
	let hash = 0x811c9dc5;
	for (let i = 0; i < value.length; i++) {
		hash ^= value.charCodeAt(i);
		hash = Math.imul(hash, 0x01000193);
	}
	return hash >>> 0;
}

/** Mulberry32 PRNG — small, fast and deterministic for a given seed. */
export function mulberry32(seed: number): () => number {
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** A stable 0–1 value for a seed/key pair, with no generator state to carry around. */
export function noise(seed: number, key: string): number {
	return mulberry32(seed ^ hashString(key))();
}

export interface RandomSource {
	next(): number;
	int(min: number, max: number): number;
	pick<T>(items: readonly T[]): T;
	/** Picks `count` distinct items, or all of them when the pool is smaller. */
	sample<T>(items: readonly T[], count: number): T[];
	bool(probability: number): boolean;
	/** Bell-shaped value in [min, max], so generated data clusters naturally. */
	normal(min: number, max: number): number;
}

export function createRandom(seed: number | string): RandomSource {
	const next = mulberry32(typeof seed === 'string' ? hashString(seed) : seed);

	const int = (min: number, max: number) => Math.floor(next() * (max - min + 1)) + min;

	return {
		next,
		int,
		pick: (items) => items[Math.floor(next() * items.length)],
		sample: (items, count) => {
			const pool = [...items];
			for (let i = pool.length - 1; i > 0; i--) {
				const j = Math.floor(next() * (i + 1));
				[pool[i], pool[j]] = [pool[j], pool[i]];
			}
			return pool.slice(0, Math.min(count, pool.length));
		},
		bool: (probability) => next() < probability,
		normal: (min, max) => min + ((next() + next() + next()) / 3) * (max - min)
	};
}
