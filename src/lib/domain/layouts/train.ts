import type { FareClassSpec, SeatLayout } from '../seating';

/** Bangladesh Railway accommodation classes, cheapest first. */
const SHOVAN: FareClassSpec = {
	code: 'shovan_chair',
	name: 'Shovan Chair',
	multiplier: 1,
	baggageKg: 28,
	refundable: true,
	perks: ['Reserved chair', 'Fan cooled']
};

const SNIGDHA: FareClassSpec = {
	code: 'snigdha',
	name: 'Snigdha (AC Chair)',
	multiplier: 1.9,
	baggageKg: 35,
	refundable: true,
	perks: ['Air conditioned', 'Reclining chair', 'Complimentary refreshment']
};

const AC_BERTH: FareClassSpec = {
	code: 'ac_berth',
	name: 'AC Berth',
	multiplier: 3.2,
	baggageKg: 45,
	refundable: true,
	perks: ['Sleeping berth', 'Air conditioned', 'Bedding provided', 'Attendant service']
};

export const TRAIN_LAYOUTS: SeatLayout[] = [
	{
		id: 'train-intercity',
		mode: 'train',
		name: 'Intercity rake — 5 coaches',
		deckLabel: 'Coach',
		classes: [SHOVAN, SNIGDHA],
		decks: [
			{
				id: 'KA',
				label: 'Coach KA — Snigdha',
				columns: ['A', 'B', null, 'C', 'D'],
				rows: 14,
				sections: [{ classCode: 'snigdha', fromRow: 1, toRow: 14 }]
			},
			{
				id: 'KHA',
				label: 'Coach KHA — Snigdha',
				columns: ['A', 'B', null, 'C', 'D'],
				rows: 14,
				sections: [{ classCode: 'snigdha', fromRow: 1, toRow: 14 }]
			},
			{
				id: 'GA',
				label: 'Coach GA — Shovan',
				columns: ['A', 'B', 'C', null, 'D', 'E'],
				rows: 18,
				sections: [{ classCode: 'shovan_chair', fromRow: 1, toRow: 18 }]
			},
			{
				id: 'GHA',
				label: 'Coach GHA — Shovan',
				columns: ['A', 'B', 'C', null, 'D', 'E'],
				rows: 18,
				sections: [{ classCode: 'shovan_chair', fromRow: 1, toRow: 18 }]
			},
			{
				id: 'UMA',
				label: 'Coach UMA — Shovan',
				columns: ['A', 'B', 'C', null, 'D', 'E'],
				rows: 18,
				sections: [{ classCode: 'shovan_chair', fromRow: 1, toRow: 18 }]
			}
		]
	},
	{
		id: 'train-night',
		mode: 'train',
		name: 'Night express — berth rake',
		deckLabel: 'Coach',
		classes: [SHOVAN, SNIGDHA, AC_BERTH],
		decks: [
			{
				id: 'KA',
				label: 'Coach KA — AC Berth',
				columns: ['A', null, 'B'],
				rows: 12,
				sections: [{ classCode: 'ac_berth', fromRow: 1, toRow: 12 }]
			},
			{
				id: 'KHA',
				label: 'Coach KHA — Snigdha',
				columns: ['A', 'B', null, 'C', 'D'],
				rows: 14,
				sections: [{ classCode: 'snigdha', fromRow: 1, toRow: 14 }]
			},
			{
				id: 'GA',
				label: 'Coach GA — Shovan',
				columns: ['A', 'B', 'C', null, 'D', 'E'],
				rows: 18,
				sections: [{ classCode: 'shovan_chair', fromRow: 1, toRow: 18 }]
			},
			{
				id: 'GHA',
				label: 'Coach GHA — Shovan',
				columns: ['A', 'B', 'C', null, 'D', 'E'],
				rows: 18,
				sections: [{ classCode: 'shovan_chair', fromRow: 1, toRow: 18 }]
			}
		]
	}
];
