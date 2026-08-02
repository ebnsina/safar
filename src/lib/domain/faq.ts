export interface FaqEntry {
	question: string;
	answer: string;
}

/** Answers describe what the app actually does. Nothing here is aspirational. */
export const FAQ: FaqEntry[] = [
	{
		question: 'How long are my seats held?',
		answer:
			'Ten minutes from the moment you continue to payment. The countdown runs on the payment page. If it reaches zero the seats go back on sale and you choose again.'
	},
	{
		question: 'Is the price on the results page the price I pay?',
		answer:
			'Yes. The fare shown is per seat, and the booking fee is added once per booking, not per traveller. You see both broken out before you pay, and nothing else is added at the end.'
	},
	{
		question: 'Why do some fares say non-refundable?',
		answer:
			'That is set by the class you pick, not by us. Non-AC coach seats are non-refundable; AC business, sleeper, and all train and business-class air fares can be refunded.'
	},
	{
		question: 'Can I choose which seat I get?',
		answer:
			'Yes, on every journey. The map is drawn to the real vehicle, so you can see which seats are by a window, which are on the aisle, and which rows have extra legroom before you decide.'
	},
	{
		question: 'How many seats can I book at once?',
		answer:
			'Four on a coach or a train, and nine on a flight. Each traveller needs their own name, as printed on the ID they will carry.'
	},
	{
		question: 'How do I find a booking again?',
		answer:
			'Go to My booking and enter the six-character reference from your ticket together with the email you booked with. Both are needed, so a reference on its own opens nothing.'
	},
	{
		question: 'Do trains run every day?',
		answer:
			'Most intercity services rest one day a week, and that day differs by train. Search your date and you will only see services that actually run.'
	},
	{
		question: 'Is this a real booking service?',
		answer:
			'No. Operators, routes and timetables are modelled on real services, but every fare, seat and departure is generated. No tickets are sold, no money moves, and no card details are stored.'
	}
];
