/**
 * @param {number} value
 * @returns {string}
 */
export function ordinalString(value) {
	const pluralRules = new Intl.PluralRules(game.i18n.lang, { type: "ordinal" });
	const suffix = game.i18n.localize(
		`PF2E.OrdinalSuffixes.${pluralRules.select(value)}`,
	);
	return game.i18n.format("PF2E.OrdinalNumber", { value, suffix });
}

/**
 * @param {string} message
 * @returns {Error}
 */
export function ErrorPF2e(message) {
	return Error(`PF2e System | ${message}`);
}

/**
 * @type {Intl.NumberFormat}
 */
let intlNumberFormat;
/**
 * @param {number} value
 * @param {object} [options]
 * @param {boolean} [options.emptyStringZero]
 * @param {boolean} [options.zeroIsNegative]
 * @returns {string}
 */
export function signedInteger(
	value,
	{ emptyStringZero = false, zeroIsNegative = false } = {},
) {
	if (value === 0 && emptyStringZero) return "";

	intlNumberFormat ??= new Intl.NumberFormat(game.i18n.lang, {
		maximumFractionDigits: 0,
		signDisplay: "always",
	});

	const maybeNegativeZero = zeroIsNegative && value === 0 ? -0 : value;

	return intlNumberFormat.format(maybeNegativeZero);
}
