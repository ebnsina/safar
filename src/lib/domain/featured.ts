/** Cities given a card on the home page, with the reason someone travels there. */
export interface FeaturedCity {
	id: string;
	name: string;
	division: string;
	/** One line, plain language, no salesmanship. */
	blurb: string;
	/** Mode that best serves this city from Dhaka, used for the card link. */
	mode: 'bus' | 'train' | 'air';
	/** Real coordinates — they seed the card's aurora, so each city looks like itself. */
	latitude: number;
	longitude: number;
}

export const FEATURED_CITIES: FeaturedCity[] = [
	{
		id: 'coxs-bazar',
		latitude: 21.4272,
		longitude: 92.0058,
		name: "Cox's Bazar",
		division: 'Chattogram',
		blurb: 'The long beach. Overnight coaches, a daytime train, and flights under an hour.',
		mode: 'air'
	},
	{
		id: 'sylhet',
		latitude: 24.8949,
		longitude: 91.8687,
		name: 'Sylhet',
		division: 'Sylhet',
		blurb: 'Tea gardens and the haor wetlands, five hours out of Dhaka by rail.',
		mode: 'train'
	},
	{
		id: 'chattogram',
		latitude: 22.3569,
		longitude: 91.7832,
		name: 'Chattogram',
		division: 'Chattogram',
		blurb: 'The port city. The busiest corridor in the country, served every way there is.',
		mode: 'train'
	},
	{
		id: 'khulna',
		latitude: 22.8456,
		longitude: 89.5403,
		name: 'Khulna',
		division: 'Khulna',
		blurb: 'The way in to the Sundarbans, by night train or coach.',
		mode: 'train'
	},
	{
		id: 'bandarban',
		latitude: 22.1953,
		longitude: 92.2184,
		name: 'Bandarban',
		division: 'Chattogram',
		blurb: 'Hill tracts and the highest roads in Bangladesh. Coaches only.',
		mode: 'bus'
	},
	{
		id: 'rajshahi',
		latitude: 24.3745,
		longitude: 88.6042,
		name: 'Rajshahi',
		division: 'Rajshahi',
		blurb: 'Silk, mangoes and the Padma. The Banalata runs it in under six hours.',
		mode: 'train'
	}
];
