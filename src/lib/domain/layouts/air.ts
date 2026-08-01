import type { FareClassSpec, SeatLayout } from '../seating';

const ECONOMY: FareClassSpec = {
	code: 'economy',
	name: 'Economy',
	multiplier: 1,
	baggageKg: 20,
	refundable: false,
	perks: ['Cabin bag 7 kg', 'In-flight refreshment']
};

const BUSINESS: FareClassSpec = {
	code: 'business',
	name: 'Business',
	multiplier: 2.8,
	baggageKg: 40,
	refundable: true,
	perks: ['Priority check-in', 'Lounge access', 'Hot meal', 'Extra legroom']
};

export const AIR_LAYOUTS: SeatLayout[] = [
	{
		id: 'air-narrowbody',
		mode: 'air',
		name: 'Boeing 737-800',
		deckLabel: 'Cabin',
		classes: [BUSINESS, ECONOMY],
		decks: [
			{
				id: 'main',
				label: 'Cabin',
				columns: ['A', 'B', 'C', null, 'D', 'E', 'F'],
				rows: 30,
				sections: [
					{ classCode: 'business', fromRow: 1, toRow: 3 },
					{ classCode: 'economy', fromRow: 4, toRow: 30 }
				],
				// Business rows are 2+2, so the outer columns are absent up front.
				omit: ['1B', '1E', '2B', '2E', '3B', '3E'],
				exitRows: [15, 16],
				legroomRows: [4, 15, 16]
			}
		]
	},
	{
		id: 'air-a320',
		mode: 'air',
		name: 'Airbus A320',
		deckLabel: 'Cabin',
		classes: [BUSINESS, ECONOMY],
		decks: [
			{
				id: 'main',
				label: 'Cabin',
				columns: ['A', 'B', 'C', null, 'D', 'E', 'F'],
				rows: 29,
				sections: [
					{ classCode: 'business', fromRow: 1, toRow: 2 },
					{ classCode: 'economy', fromRow: 3, toRow: 29 }
				],
				omit: ['1B', '1E', '2B', '2E'],
				exitRows: [14, 15],
				legroomRows: [3, 14, 15]
			}
		]
	},
	{
		id: 'air-turboprop',
		mode: 'air',
		name: 'ATR 72-600',
		deckLabel: 'Cabin',
		classes: [ECONOMY],
		decks: [
			{
				id: 'main',
				label: 'Cabin',
				columns: ['A', 'B', null, 'C', 'D'],
				rows: 18,
				sections: [{ classCode: 'economy', fromRow: 1, toRow: 18 }],
				exitRows: [10],
				legroomRows: [1, 10]
			}
		]
	},
	{
		id: 'air-dash8',
		mode: 'air',
		name: 'De Havilland Dash 8 Q400',
		deckLabel: 'Cabin',
		classes: [ECONOMY],
		decks: [
			{
				id: 'main',
				label: 'Cabin',
				columns: ['A', 'B', null, 'C', 'D'],
				rows: 19,
				sections: [{ classCode: 'economy', fromRow: 1, toRow: 19 }],
				omit: ['19C', '19D'],
				exitRows: [11],
				legroomRows: [1, 11]
			}
		]
	}
];
