/** Intl constructors are expensive; memoise every formatter by locale + options. */
function memoise<T>(create: (locale: string, options: object) => T) {
	const cache = new Map<string, T>();
	return (locale: string, options: object = {}): T => {
		const key = locale + JSON.stringify(options);
		let formatter = cache.get(key);
		if (!formatter) {
			formatter = create(locale, options);
			cache.set(key, formatter);
		}
		return formatter;
	};
}

export const numberFormat = memoise(
	(locale, options) => new Intl.NumberFormat(locale, options as Intl.NumberFormatOptions)
);

export const dateTimeFormat = memoise(
	(locale, options) => new Intl.DateTimeFormat(locale, options as Intl.DateTimeFormatOptions)
);

export const relativeTimeFormat = memoise(
	(locale, options) =>
		new Intl.RelativeTimeFormat(locale, options as Intl.RelativeTimeFormatOptions)
);

export const listFormat = memoise(
	(locale, options) => new Intl.ListFormat(locale, options as Intl.ListFormatOptions)
);
