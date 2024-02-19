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

/**
 * @param {object} obj
 * @param {unknown} key
 * @returns {boolean}
 */
export function objectHasKey(obj, key) {
	return (typeof key === "string" || typeof key === "number") && key in obj;
}

/**
 * @param {string} prefix
 * @returns {(...args: (string|Record<string, unknown>)[]) => string}
 */
export function localizer(prefix) {
	return (...[suffix, formatArgs]) =>
		formatArgs
			? game.i18n.format(`${prefix}.${suffix}`, formatArgs)
			: game.i18n.localize(`${prefix}.${suffix}`);
}

const actionGlyphMap = {
	0: "F",
	free: "F",
	1: "A",
	2: "D",
	3: "T",
	"1 or 2": "A/D",
	"1 to 3": "A - T",
	"2 or 3": "D/T",
	reaction: "R",
};

/**
 * @param {typeof actionGlyphMap} action
 * @returns {string}
 */
export function getActionGlyph(action) {
	if (!action && action !== 0) return "";

	const value =
		typeof action !== "object"
			? action
			: action.type === "action"
			  ? action.value
			  : action.type;
	const sanitized = String(value ?? "")
		.toLowerCase()
		.trim();

	return actionGlyphMap[sanitized]?.replace("-", "–") ?? "";
}
