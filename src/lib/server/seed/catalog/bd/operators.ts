import type { TransportMode } from '#lib/domain/modes';

export interface OperatorSeed {
	id: string;
	mode: TransportMode;
	name: string;
	code: string;
	/** Rating in tenths — 43 renders as 4.3. */
	rating: number;
	ratingCount: number;
	foundedYear: number;
	amenities: string[];
	/** Layout ids this operator runs; trips pick one at random. */
	layouts: string[];
	/** Multiplier on the distance-based base fare — premium brands charge more. */
	fareIndex: number;
}

const COACH = ['Reclining seats', 'Bottled water', 'Luggage hold'];
const AC = ['Air conditioned', 'Charging point', 'Onboard washroom'];
const PREMIUM = ['Wi-Fi', 'Snack box', 'Blanket', 'Entertainment screen'];

export const BD_BUS_OPERATORS: OperatorSeed[] = [
	{
		id: 'green-line',
		mode: 'bus',
		name: 'Green Line Paribahan',
		code: 'GRL',
		rating: 45,
		ratingCount: 18420,
		foundedYear: 1990,
		amenities: [...COACH, ...AC, ...PREMIUM],
		layouts: ['bus-ac-2x1', 'bus-ac-2x2', 'bus-sleeper'],
		fareIndex: 1.35
	},
	{
		id: 'hanif',
		mode: 'bus',
		name: 'Hanif Enterprise',
		code: 'HNF',
		rating: 41,
		ratingCount: 26310,
		foundedYear: 1994,
		amenities: [...COACH, ...AC],
		layouts: ['bus-ac-2x2', 'bus-nonac-2x2'],
		fareIndex: 1.0
	},
	{
		id: 'shohagh',
		mode: 'bus',
		name: 'Shohagh Paribahan',
		code: 'SHG',
		rating: 43,
		ratingCount: 15980,
		foundedYear: 1985,
		amenities: [...COACH, ...AC, 'Wi-Fi'],
		layouts: ['bus-ac-2x2', 'bus-ac-2x1'],
		fareIndex: 1.2
	},
	{
		id: 'ena',
		mode: 'bus',
		name: 'Ena Transport',
		code: 'ENA',
		rating: 39,
		ratingCount: 21050,
		foundedYear: 1998,
		amenities: [...COACH, ...AC],
		layouts: ['bus-ac-2x2', 'bus-nonac-2x2'],
		fareIndex: 0.95
	},
	{
		id: 'shyamoli',
		mode: 'bus',
		name: 'Shyamoli Paribahan',
		code: 'SYM',
		rating: 40,
		ratingCount: 19870,
		foundedYear: 1978,
		amenities: [...COACH, ...AC],
		layouts: ['bus-ac-2x2', 'bus-nonac-2x2'],
		fareIndex: 1.0
	},
	{
		id: 'desh-travels',
		mode: 'bus',
		name: 'Desh Travels',
		code: 'DST',
		rating: 42,
		ratingCount: 9240,
		foundedYear: 2001,
		amenities: [...COACH, ...AC, 'Wi-Fi'],
		layouts: ['bus-ac-2x2'],
		fareIndex: 1.1
	},
	{
		id: 'soudia',
		mode: 'bus',
		name: 'Soudia Coach Service',
		code: 'SDA',
		rating: 38,
		ratingCount: 12760,
		foundedYear: 1996,
		amenities: [...COACH, ...AC],
		layouts: ['bus-ac-2x2', 'bus-nonac-2x2'],
		fareIndex: 0.98
	},
	{
		id: 's-alam',
		mode: 'bus',
		name: 'S. Alam Service',
		code: 'SAL',
		rating: 37,
		ratingCount: 14110,
		foundedYear: 1988,
		amenities: [...COACH, ...AC],
		layouts: ['bus-ac-2x2', 'bus-nonac-2x2'],
		fareIndex: 0.94
	},
	{
		id: 'saintmartin',
		mode: 'bus',
		name: 'Saintmartin Paribahan',
		code: 'SMP',
		rating: 44,
		ratingCount: 8630,
		foundedYear: 2004,
		amenities: [...COACH, ...AC, ...PREMIUM],
		layouts: ['bus-ac-2x1', 'bus-sleeper'],
		fareIndex: 1.4
	},
	{
		id: 'royal-coach',
		mode: 'bus',
		name: 'Royal Coach',
		code: 'RYC',
		rating: 42,
		ratingCount: 7420,
		foundedYear: 2006,
		amenities: [...COACH, ...AC, 'Wi-Fi'],
		layouts: ['bus-ac-2x2', 'bus-ac-2x1'],
		fareIndex: 1.18
	},
	{
		id: 'london-express',
		mode: 'bus',
		name: 'London Express',
		code: 'LNE',
		rating: 43,
		ratingCount: 5980,
		foundedYear: 2011,
		amenities: [...COACH, ...AC, ...PREMIUM],
		layouts: ['bus-ac-2x1', 'bus-sleeper'],
		fareIndex: 1.45
	},
	{
		id: 'nabil',
		mode: 'bus',
		name: 'Nabil Paribahan',
		code: 'NBL',
		rating: 38,
		ratingCount: 10340,
		foundedYear: 1999,
		amenities: [...COACH, ...AC],
		layouts: ['bus-ac-2x2', 'bus-nonac-2x2'],
		fareIndex: 0.96
	},
	{
		id: 'tr-travels',
		mode: 'bus',
		name: 'TR Travels',
		code: 'TRT',
		rating: 40,
		ratingCount: 6890,
		foundedYear: 2008,
		amenities: [...COACH, ...AC],
		layouts: ['bus-ac-2x2'],
		fareIndex: 1.05
	},
	{
		id: 'star-line',
		mode: 'bus',
		name: 'Star Line Special',
		code: 'STL',
		rating: 39,
		ratingCount: 9120,
		foundedYear: 2002,
		amenities: [...COACH, ...AC],
		layouts: ['bus-ac-2x2', 'bus-nonac-2x2'],
		fareIndex: 0.99
	},
	{
		id: 'unique',
		mode: 'bus',
		name: 'Unique Service',
		code: 'UNQ',
		rating: 37,
		ratingCount: 8450,
		foundedYear: 1997,
		amenities: [...COACH],
		layouts: ['bus-nonac-2x2'],
		fareIndex: 0.85
	},
	{
		id: 'eagle',
		mode: 'bus',
		name: 'Eagle Paribahan',
		code: 'EGL',
		rating: 36,
		ratingCount: 7230,
		foundedYear: 2003,
		amenities: [...COACH],
		layouts: ['bus-nonac-2x2'],
		fareIndex: 0.82
	},
	{
		id: 'sr-travels',
		mode: 'bus',
		name: 'SR Travels',
		code: 'SRT',
		rating: 41,
		ratingCount: 11540,
		foundedYear: 1993,
		amenities: [...COACH, ...AC],
		layouts: ['bus-ac-2x2', 'bus-nonac-2x2'],
		fareIndex: 1.02
	},
	{
		id: 'shah-fateh-ali',
		mode: 'bus',
		name: 'Shah Fateh Ali Paribahan',
		code: 'SFA',
		rating: 36,
		ratingCount: 5410,
		foundedYear: 1995,
		amenities: [...COACH],
		layouts: ['bus-nonac-2x2'],
		fareIndex: 0.84
	},
	{
		id: 'golden-line',
		mode: 'bus',
		name: 'Golden Line Paribahan',
		code: 'GDL',
		rating: 38,
		ratingCount: 6620,
		foundedYear: 2000,
		amenities: [...COACH, ...AC],
		layouts: ['bus-ac-2x2', 'bus-nonac-2x2'],
		fareIndex: 0.97
	},
	{
		id: 'silk-line',
		mode: 'bus',
		name: 'Silk Line Paribahan',
		code: 'SLK',
		rating: 39,
		ratingCount: 4980,
		foundedYear: 2009,
		amenities: [...COACH, ...AC],
		layouts: ['bus-ac-2x2'],
		fareIndex: 1.04
	},
	{
		id: 'sakura',
		mode: 'bus',
		name: 'Sakura Paribahan',
		code: 'SKR',
		rating: 37,
		ratingCount: 7810,
		foundedYear: 1992,
		amenities: [...COACH, ...AC],
		layouts: ['bus-ac-2x2', 'bus-nonac-2x2'],
		fareIndex: 0.93
	},
	{
		id: 'imad',
		mode: 'bus',
		name: 'Imad Paribahan',
		code: 'IMD',
		rating: 35,
		ratingCount: 4320,
		foundedYear: 2010,
		amenities: [...COACH],
		layouts: ['bus-nonac-2x2'],
		fareIndex: 0.8
	},
	{
		id: 'ekushey',
		mode: 'bus',
		name: 'Ekushey Express',
		code: 'EKS',
		rating: 38,
		ratingCount: 5760,
		foundedYear: 2005,
		amenities: [...COACH, ...AC],
		layouts: ['bus-ac-2x2'],
		fareIndex: 1.0
	},
	{
		id: 'grameen',
		mode: 'bus',
		name: 'Grameen Travels',
		code: 'GRM',
		rating: 36,
		ratingCount: 6140,
		foundedYear: 1998,
		amenities: [...COACH],
		layouts: ['bus-nonac-2x2'],
		fareIndex: 0.86
	}
];

export const BD_AIRLINES: OperatorSeed[] = [
	{
		id: 'biman',
		mode: 'air',
		name: 'Biman Bangladesh Airlines',
		code: 'BG',
		rating: 39,
		ratingCount: 24310,
		foundedYear: 1972,
		amenities: ['Checked baggage 20 kg', 'In-flight meal', 'Lounge access', 'Priority boarding'],
		layouts: ['air-narrowbody', 'air-dash8'],
		fareIndex: 1.1
	},
	{
		id: 'us-bangla',
		mode: 'air',
		name: 'US-Bangla Airlines',
		code: 'BS',
		rating: 42,
		ratingCount: 31280,
		foundedYear: 2014,
		amenities: ['Checked baggage 20 kg', 'In-flight refreshment', 'Web check-in'],
		layouts: ['air-a320', 'air-turboprop'],
		fareIndex: 1.0
	},
	{
		id: 'novoair',
		mode: 'air',
		name: 'NOVOAIR',
		code: 'VQ',
		rating: 41,
		ratingCount: 16740,
		foundedYear: 2013,
		amenities: ['Checked baggage 20 kg', 'Smiles loyalty points', 'Web check-in'],
		layouts: ['air-turboprop'],
		fareIndex: 0.96
	},
	{
		id: 'air-astra',
		mode: 'air',
		name: 'Air Astra',
		code: '2A',
		rating: 40,
		ratingCount: 6820,
		foundedYear: 2022,
		amenities: ['Checked baggage 20 kg', 'In-flight refreshment'],
		layouts: ['air-turboprop'],
		fareIndex: 0.92
	}
];
