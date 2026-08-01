import type { TransportMode } from './modes';

export interface Corridor {
	from: string;
	to: string;
	label: string;
}

export interface ModeContent {
	/** Shown on the home chooser. */
	summary: string;
	/** Landing-page hero for this mode. */
	heading: string;
	standfirst: string;
	/** Routes worth surfacing, and actually served by this mode. */
	corridors: Corridor[];
	/** One line naming what is distinctive about travelling this way. */
	notes: string[];
}

export const MODE_CONTENT: Record<TransportMode, ModeContent> = {
	bus: {
		summary: 'Every operator that runs the route, from non-AC coaches to flat-berth sleepers.',
		heading: 'Coaches to every district',
		standfirst:
			'Twenty-four operators, the whole country, and the seat map before you pay. Overnight sleepers on the long runs.',
		corridors: [
			{ from: 'dhaka', to: 'coxs-bazar', label: "Dhaka — Cox's Bazar" },
			{ from: 'dhaka', to: 'chattogram', label: 'Dhaka — Chattogram' },
			{ from: 'dhaka', to: 'sylhet', label: 'Dhaka — Sylhet' },
			{ from: 'dhaka', to: 'khulna', label: 'Dhaka — Khulna' },
			{ from: 'dhaka', to: 'rajshahi', label: 'Dhaka — Rajshahi' },
			{ from: 'chattogram', to: 'coxs-bazar', label: "Chattogram — Cox's Bazar" }
		],
		notes: [
			'Non-AC, AC business and sleeper',
			'Counters in every district town',
			'Book up to 4 seats'
		]
	},
	train: {
		summary: 'Reserved chairs and berths on the named intercity services.',
		heading: 'The intercity network',
		standfirst:
			'Subarna, Sonar Bangla, Banalata and the rest, with the real coach layout and a seat you choose yourself.',
		corridors: [
			{ from: 'dhaka', to: 'chattogram', label: 'Dhaka — Chattogram' },
			{ from: 'dhaka', to: 'sylhet', label: 'Dhaka — Sylhet' },
			{ from: 'dhaka', to: 'rajshahi', label: 'Dhaka — Rajshahi' },
			{ from: 'dhaka', to: 'khulna', label: 'Dhaka — Khulna' },
			{ from: 'dhaka', to: 'coxs-bazar', label: "Dhaka — Cox's Bazar" },
			{ from: 'chattogram', to: 'sylhet', label: 'Chattogram — Sylhet' }
		],
		notes: [
			'Shovan, Snigdha and AC berth',
			'Choose your coach and seat',
			'Services rest one day a week'
		]
	},
	air: {
		summary: 'Every domestic sector, flown by all four carriers.',
		heading: 'Domestic flights',
		standfirst:
			'Biman, US-Bangla, NOVOAIR and Air Astra on one list, with the cabin map and the full fare up front.',
		corridors: [
			{ from: 'dhaka', to: 'coxs-bazar', label: "Dhaka — Cox's Bazar" },
			{ from: 'dhaka', to: 'chattogram', label: 'Dhaka — Chattogram' },
			{ from: 'dhaka', to: 'sylhet', label: 'Dhaka — Sylhet' },
			{ from: 'dhaka', to: 'jashore', label: 'Dhaka — Jashore' },
			{ from: 'dhaka', to: 'saidpur', label: 'Dhaka — Saidpur' },
			{ from: 'chattogram', to: 'coxs-bazar', label: "Chattogram — Cox's Bazar" }
		],
		notes: ['Economy and business', 'Eight airports served', 'Book up to 9 seats']
	}
};

export function contentFor(mode: TransportMode): ModeContent {
	return MODE_CONTENT[mode];
}
