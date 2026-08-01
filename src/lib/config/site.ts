export const SITE = {
	name: 'Safar',
	/** Safar — "journey". Shown on the wordmark hover. */
	nameArabic: 'سَفَر',
	tagline: 'Every way to travel, one search',
	description:
		'Book buses, trains and flights across Bangladesh. Real seat availability, the full fare up front, nothing added at the last step.',
	locale: 'en_BD',
	ogImage: '/og.png',
	twitter: '@safar'
} as const;

/** Page titles read "Dhaka to Sylhet — Safar"; the home page keeps the tagline instead. */
export function pageTitle(title?: string): string {
	return title ? `${title} — ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
}
