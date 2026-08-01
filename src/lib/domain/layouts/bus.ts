import type { FareClassSpec, SeatLayout } from '../seating';

const ECONOMY: FareClassSpec = {
	code: 'coach',
	name: 'Non-AC Coach',
	multiplier: 1,
	baggageKg: 20,
	refundable: false,
	perks: ['Reclining seat', 'Bottled water']
};

const AC_BUSINESS: FareClassSpec = {
	code: 'ac_business',
	name: 'AC Business',
	multiplier: 1.75,
	baggageKg: 25,
	refundable: true,
	perks: ['Air conditioned', 'Extra legroom', 'Snack box', 'Blanket']
};

const SLEEPER: FareClassSpec = {
	code: 'sleeper',
	name: 'AC Sleeper',
	multiplier: 1.9,
	baggageKg: 30,
	refundable: true,
	perks: ['Flat berth', 'Air conditioned', 'Privacy curtain', 'Charging point']
};

export const BUS_LAYOUTS: SeatLayout[] = [
	{
		id: 'bus-nonac-2x2',
		mode: 'bus',
		name: 'Ashok Leyland 2+2',
		deckLabel: 'Deck',
		classes: [ECONOMY],
		decks: [
			{
				id: 'main',
				label: 'Main deck',
				columns: ['A', 'B', null, 'C', 'D'],
				rows: 11,
				sections: [{ classCode: 'coach', fromRow: 1, toRow: 11 }],
				exitRows: [1],
				legroomRows: [1]
			}
		]
	},
	{
		id: 'bus-ac-2x2',
		mode: 'bus',
		name: 'Hino AK1J 2+2',
		deckLabel: 'Deck',
		classes: [AC_BUSINESS],
		decks: [
			{
				id: 'main',
				label: 'Main deck',
				columns: ['A', 'B', null, 'C', 'D'],
				rows: 10,
				sections: [{ classCode: 'ac_business', fromRow: 1, toRow: 10 }],
				exitRows: [1],
				legroomRows: [1]
			}
		]
	},
	{
		id: 'bus-ac-2x1',
		mode: 'bus',
		name: 'Scania Business 2+1',
		deckLabel: 'Deck',
		classes: [AC_BUSINESS],
		decks: [
			{
				id: 'main',
				label: 'Main deck',
				columns: ['A', 'B', null, 'C'],
				rows: 9,
				sections: [{ classCode: 'ac_business', fromRow: 1, toRow: 9 }],
				omit: ['9C'],
				exitRows: [1],
				legroomRows: [1]
			}
		]
	},
	{
		id: 'bus-sleeper',
		mode: 'bus',
		name: 'Volvo Sleeper 1+1',
		deckLabel: 'Deck',
		classes: [SLEEPER],
		decks: [
			{
				id: 'main',
				label: 'Berths',
				columns: ['A', null, 'B'],
				rows: 12,
				sections: [{ classCode: 'sleeper', fromRow: 1, toRow: 12 }],
				exitRows: [1]
			}
		]
	}
];
