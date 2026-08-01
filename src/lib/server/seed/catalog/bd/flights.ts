export interface AirportSeed {
	placeId: string;
	iata: string;
	name: string;
	latitude: number;
	longitude: number;
}

export const BD_AIRPORTS: AirportSeed[] = [
	{
		placeId: 'dhaka',
		iata: 'DAC',
		name: 'Hazrat Shahjalal International Airport',
		latitude: 23.8433,
		longitude: 90.3978
	},
	{
		placeId: 'chattogram',
		iata: 'CGP',
		name: 'Shah Amanat International Airport',
		latitude: 22.2496,
		longitude: 91.8133
	},
	{
		placeId: 'sylhet',
		iata: 'ZYL',
		name: 'Osmani International Airport',
		latitude: 24.9632,
		longitude: 91.8668
	},
	{
		placeId: 'coxs-bazar',
		iata: 'CXB',
		name: "Cox's Bazar Airport",
		latitude: 21.4522,
		longitude: 91.9639
	},
	{
		placeId: 'jashore',
		iata: 'JSR',
		name: 'Jashore Airport',
		latitude: 23.1838,
		longitude: 89.1608
	},
	{
		placeId: 'saidpur',
		iata: 'SPD',
		name: 'Saidpur Airport',
		latitude: 25.7592,
		longitude: 88.9089
	},
	{
		placeId: 'rajshahi',
		iata: 'RJH',
		name: 'Shah Makhdum Airport',
		latitude: 24.4372,
		longitude: 88.6165
	},
	{
		placeId: 'barishal',
		iata: 'BZL',
		name: 'Barishal Airport',
		latitude: 22.801,
		longitude: 90.3012
	}
];

export interface AirRouteSeed {
	origin: string;
	destination: string;
	/** Departures per day summed across all airlines, in each direction. */
	dailyFrequency: number;
	airlines: string[];
}

/** Scheduled domestic sectors. Every entry is flown in both directions. */
export const BD_AIR_ROUTES: AirRouteSeed[] = [
	{
		origin: 'dhaka',
		destination: 'coxs-bazar',
		dailyFrequency: 11,
		airlines: ['biman', 'us-bangla', 'novoair', 'air-astra']
	},
	{
		origin: 'dhaka',
		destination: 'chattogram',
		dailyFrequency: 9,
		airlines: ['biman', 'us-bangla', 'novoair', 'air-astra']
	},
	{
		origin: 'dhaka',
		destination: 'sylhet',
		dailyFrequency: 6,
		airlines: ['biman', 'us-bangla', 'novoair']
	},
	{
		origin: 'dhaka',
		destination: 'jashore',
		dailyFrequency: 7,
		airlines: ['biman', 'us-bangla', 'novoair', 'air-astra']
	},
	{
		origin: 'dhaka',
		destination: 'saidpur',
		dailyFrequency: 7,
		airlines: ['biman', 'us-bangla', 'novoair', 'air-astra']
	},
	{ origin: 'dhaka', destination: 'rajshahi', dailyFrequency: 3, airlines: ['biman', 'us-bangla'] },
	{ origin: 'dhaka', destination: 'barishal', dailyFrequency: 3, airlines: ['biman', 'us-bangla'] },
	{
		origin: 'chattogram',
		destination: 'coxs-bazar',
		dailyFrequency: 2,
		airlines: ['us-bangla', 'novoair']
	},
	{
		origin: 'chattogram',
		destination: 'sylhet',
		dailyFrequency: 2,
		airlines: ['biman', 'us-bangla']
	}
];
