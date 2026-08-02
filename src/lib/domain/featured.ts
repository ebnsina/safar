/** Cities given a card on the home page, with the reason someone travels there. */
export interface FeaturedCity {
	id: string;
	name: string;
	division: string;
	/** One line, plain language, no salesmanship. */
	blurb: string;
	/** Mode that best serves this city from Dhaka, used for the card link. */
	mode: 'bus' | 'train' | 'air';
}

export const FEATURED_CITIES: FeaturedCity[] = [
	{
		id: 'coxs-bazar',
		name: "Cox's Bazar",
		division: 'Chattogram',
		blurb: 'The long beach. Overnight coaches, a daytime train, and flights under an hour.',
		mode: 'air'
	},
	{
		id: 'sylhet',
		name: 'Sylhet',
		division: 'Sylhet',
		blurb: 'Tea gardens and the haor wetlands, five hours out of Dhaka by rail.',
		mode: 'train'
	},
	{
		id: 'chattogram',
		name: 'Chattogram',
		division: 'Chattogram',
		blurb: 'The port city. The busiest corridor in the country, served every way there is.',
		mode: 'train'
	},
	{
		id: 'khulna',
		name: 'Khulna',
		division: 'Khulna',
		blurb: 'The way in to the Sundarbans, by night train or coach.',
		mode: 'train'
	},
	{
		id: 'bandarban',
		name: 'Bandarban',
		division: 'Chattogram',
		blurb: 'Hill tracts and the highest roads in Bangladesh. Coaches only.',
		mode: 'bus'
	},
	{
		id: 'rajshahi',
		name: 'Rajshahi',
		division: 'Rajshahi',
		blurb: 'Silk, mangoes and the Padma. The Banalata runs it in under six hours.',
		mode: 'train'
	}
];
