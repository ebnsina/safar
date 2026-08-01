/** Real station names where they differ from the city name. Others fall back to a default. */
export const BD_RAIL_STATIONS: Record<string, string> = {
	dhaka: 'Kamalapur Railway Station',
	chattogram: 'Chattogram Railway Station',
	sylhet: 'Sylhet Railway Station',
	khulna: 'Khulna Railway Station',
	rajshahi: 'Rajshahi Railway Station',
	rangpur: 'Rangpur Railway Station',
	dinajpur: 'Dinajpur Railway Station',
	panchagarh: 'Panchagarh Bir Muktijoddha Station',
	mymensingh: 'Mymensingh Junction',
	jamalpur: 'Jamalpur Railway Station',
	kishoreganj: 'Kishoreganj Railway Station',
	chandpur: 'Chandpur Court Station',
	noakhali: 'Maijdee Court Railway Station',
	nilphamari: 'Chilahati Railway Station',
	kurigram: 'Kurigram Railway Station',
	'coxs-bazar': "Cox's Bazar Iconic Railway Station",
	jashore: 'Jashore Railway Station',
	bogura: 'Bogura Railway Station',
	pabna: 'Ishwardi Junction',
	sirajganj: 'Sirajganj Bazar Station',
	natore: 'Natore Railway Station',
	brahmanbaria: 'Brahmanbaria Railway Station',
	cumilla: 'Cumilla Railway Station',
	feni: 'Feni Junction',
	saidpur: 'Saidpur Railway Station',
	lalmonirhat: 'Lalmonirhat Junction',
	gaibandha: 'Gaibandha Railway Station',
	joypurhat: 'Joypurhat Railway Station',
	chapainawabganj: 'Chapainawabganj Railway Station',
	kushtia: 'Kushtia Court Station',
	jhenaidah: 'Kotchandpur Railway Station',
	chuadanga: 'Chuadanga Railway Station',
	narail: 'Narail Railway Station'
};

/** Named bus terminals; cities without an entry get a single central counter. */
export const BD_BUS_TERMINALS: Record<string, string[]> = {
	dhaka: [
		'Gabtoli Bus Terminal',
		'Sayedabad Bus Terminal',
		'Mohakhali Bus Terminal',
		'Kallyanpur Counter',
		'Arambagh Counter'
	],
	chattogram: ['Dampara BRTC Terminal', 'Oxygen Moor Counter', 'AK Khan Gate Counter'],
	sylhet: ['Kadamtoli Bus Terminal', 'Humayun Rashid Chattar Counter'],
	khulna: ['Sonadanga Bus Terminal', 'Royal Mor Counter'],
	rajshahi: ['Shiroil Bus Terminal', 'Rajshahi Naodapara Terminal'],
	'coxs-bazar': ['Kolatoli Counter', "Cox's Bazar Bus Terminal"],
	barishal: ['Nathullabad Bus Terminal', 'Rupatoli Bus Terminal'],
	rangpur: ['Kamarpara Bus Terminal', 'Modern Mor Counter'],
	mymensingh: ['Mymensingh Central Bus Terminal', 'Masakanda Terminal'],
	cumilla: ['Cumilla Shashongachha Terminal', 'Padua Bazar Counter'],
	bogura: ['Charmatha Bus Terminal', 'Thanthania Counter'],
	jashore: ['Jashore Central Bus Terminal', 'Monihar Counter']
};

export function railStationName(placeId: string, placeName: string): string {
	return BD_RAIL_STATIONS[placeId] ?? `${placeName} Railway Station`;
}

export function busTerminalNames(placeId: string, placeName: string): string[] {
	return BD_BUS_TERMINALS[placeId] ?? [`${placeName} Bus Terminal`];
}
