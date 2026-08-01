import * as v from 'valibot';
import { MAX_PASSENGERS } from './search';

/** Held seats are released after this long, so abandoned checkouts free up inventory. */
export const HOLD_DURATION_MS = 10 * 60 * 1000;

const name = v.pipe(
	v.string(),
	v.trim(),
	v.nonEmpty('Enter a name.'),
	v.minLength(2, 'Enter the full name as printed on the ID.'),
	v.maxLength(80, 'That name is too long.'),
	v.regex(/^[\p{L}\p{M}'. -]+$/u, 'Use letters only — no digits or symbols.')
);

export const PassengerSchema = v.object({
	seatCode: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.maxLength(16)),
	fullName: name,
	type: v.picklist(['adult', 'child'] as const, 'Choose adult or child.'),
	gender: v.picklist(['male', 'female', 'unspecified'] as const, 'Choose an option.'),
	age: v.optional(
		v.pipe(
			v.number('Enter an age.'),
			v.integer(),
			v.minValue(0, 'Enter a valid age.'),
			v.maxValue(120, 'Enter a valid age.')
		)
	),
	documentId: v.optional(
		v.pipe(v.string(), v.trim(), v.maxLength(32, 'That ID number is too long.'))
	)
});

export type PassengerInput = v.InferOutput<typeof PassengerSchema>;

export const ContactSchema = v.object({
	contactName: name,
	contactEmail: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty('Enter an email address.'),
		v.email('Enter a valid email address.'),
		v.maxLength(160)
	),
	contactPhone: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty('Enter a mobile number.'),
		v.regex(/^(?:\+?880|0)1[3-9]\d{8}$/, 'Enter a Bangladeshi mobile number, like 01712345678.')
	)
});

export type ContactInput = v.InferOutput<typeof ContactSchema>;

export const CheckoutSchema = v.object({
	tripId: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.maxLength(200)),
	...ContactSchema.entries,
	passengers: v.pipe(
		v.array(PassengerSchema),
		v.minLength(1, 'Choose at least one seat.'),
		v.maxLength(MAX_PASSENGERS, `We can book up to ${MAX_PASSENGERS} travellers at once.`)
	)
});

export type CheckoutInput = v.InferOutput<typeof CheckoutSchema>;

export const PAYMENT_METHODS = [
	{ id: 'card', label: 'Card' },
	{ id: 'bkash', label: 'bKash' },
	{ id: 'nagad', label: 'Nagad' }
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]['id'];

/** Mock card details — validated for shape, then discarded. Nothing here is stored. */
export const PaymentSchema = v.object({
	method: v.picklist(['card', 'bkash', 'nagad'] as const, 'Choose a payment method.'),
	cardNumber: v.optional(
		v.pipe(
			v.string(),
			v.trim(),
			v.transform((value) => value.replace(/\s+/g, '')),
			v.regex(/^\d{16}$/, 'Enter the 16 digits on the card.')
		)
	),
	cardExpiry: v.optional(
		v.pipe(v.string(), v.trim(), v.regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY.'))
	),
	cardCvc: v.optional(
		v.pipe(v.string(), v.trim(), v.regex(/^\d{3,4}$/, 'Enter the security code.'))
	),
	walletNumber: v.optional(
		v.pipe(
			v.string(),
			v.trim(),
			v.regex(/^(?:\+?880|0)1[3-9]\d{8}$/, 'Enter the mobile number registered to the wallet.')
		)
	)
});

export type PaymentInput = v.InferOutput<typeof PaymentSchema>;

/** What the payment form actually submits — the same schema runs on both sides. */
export const PaymentFormSchema = v.object({
	bookingId: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.maxLength(64)),
	...PaymentSchema.entries
});

export type PaymentFormInput = v.InferOutput<typeof PaymentFormSchema>;

export const BookingLookupSchema = v.object({
	reference: v.pipe(
		v.string(),
		v.trim(),
		v.toUpperCase(),
		v.nonEmpty('Enter your booking reference.'),
		v.regex(/^[A-Z0-9]{6}$/, 'References are six letters and numbers, like 7KQ4M2.')
	),
	email: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty('Enter the email you booked with.'),
		v.email('Enter a valid email address.')
	)
});

export type BookingLookup = v.InferOutput<typeof BookingLookupSchema>;
