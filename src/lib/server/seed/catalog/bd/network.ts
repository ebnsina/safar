/** Bus corridors as hub → spokes. Every pair is served in both directions. */
export const BD_BUS_CORRIDORS: Record<string, string[]> = {
	// Dhaka is the national hub; its spokes are filled in from the full place list.
	chattogram: [
		'coxs-bazar',
		'sylhet',
		'khulna',
		'rajshahi',
		'rangpur',
		'cumilla',
		'feni',
		'noakhali',
		'chandpur',
		'bandarban',
		'rangamati',
		'khagrachhari',
		'barishal',
		'brahmanbaria',
		'lakshmipur'
	],
	sylhet: [
		'moulvibazar',
		'habiganj',
		'sunamganj',
		'mymensingh',
		'khulna',
		'brahmanbaria',
		'cumilla'
	],
	khulna: [
		'jashore',
		'satkhira',
		'bagerhat',
		'barishal',
		'rajshahi',
		'bogura',
		'rangpur',
		'kushtia',
		'narail',
		'magura',
		'jhenaidah'
	],
	rajshahi: [
		'bogura',
		'natore',
		'naogaon',
		'chapainawabganj',
		'pabna',
		'rangpur',
		'dinajpur',
		'sirajganj',
		'joypurhat'
	],
	rangpur: [
		'dinajpur',
		'saidpur',
		'thakurgaon',
		'panchagarh',
		'kurigram',
		'gaibandha',
		'lalmonirhat',
		'nilphamari',
		'bogura'
	],
	barishal: ['patuakhali', 'bhola', 'pirojpur', 'barguna', 'jhalokati', 'gopalganj', 'madaripur'],
	mymensingh: ['netrokona', 'jamalpur', 'sherpur', 'kishoreganj', 'tangail'],
	'coxs-bazar': ['bandarban', 'chattogram'],
	faridpur: ['rajbari', 'madaripur', 'gopalganj', 'shariatpur', 'magura'],
	bogura: ['sirajganj', 'joypurhat', 'naogaon', 'gaibandha'],
	kushtia: ['chuadanga', 'meherpur', 'jhenaidah', 'pabna'],
	cumilla: ['brahmanbaria', 'chandpur', 'feni', 'noakhali']
};

/** Departures per day on a corridor, chosen from the busier endpoint's popularity. */
export function busFrequency(popularity: number): number {
	if (popularity >= 90) return 16;
	if (popularity >= 75) return 12;
	if (popularity >= 60) return 9;
	if (popularity >= 45) return 7;
	if (popularity >= 32) return 5;
	return 3;
}
