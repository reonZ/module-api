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

const actionImgMap = {
	0: "systems/pf2e/icons/actions/FreeAction.webp",
	free: "systems/pf2e/icons/actions/FreeAction.webp",
	1: "systems/pf2e/icons/actions/OneAction.webp",
	2: "systems/pf2e/icons/actions/TwoActions.webp",
	3: "systems/pf2e/icons/actions/ThreeActions.webp",
	"1 or 2": "systems/pf2e/icons/actions/OneTwoActions.webp",
	"1 to 3": "systems/pf2e/icons/actions/OneThreeActions.webp",
	"2 or 3": "systems/pf2e/icons/actions/TwoThreeActions.webp",
	reaction: "systems/pf2e/icons/actions/Reaction.webp",
	passive: "systems/pf2e/icons/actions/Passive.webp",
};

/**
 *
 * @param {string | {type: string, value: 1|2|3|null} | null} action
 * @param {string} [fallback]
 * @returns {string|null}
 */
export function getActionIcon(
	action,
	fallback = "systems/pf2e/icons/actions/Empty.webp",
) {
	if (action === null) return actionImgMap.passive;
	const value =
		typeof action !== "object"
			? action
			: action.type === "action"
			  ? action.value
			  : action.type;
	const sanitized = String(value ?? "")
		.toLowerCase()
		.trim();
	return actionImgMap[sanitized] ?? fallback;
}

const wordCharacter = String.raw`[\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Join_Control}]`;
const nonWordCharacter = String.raw`[^\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Join_Control}]`;
const nonWordCharacterRE = new RegExp(nonWordCharacter, "gu");

const wordBoundary = String.raw`(?:${wordCharacter})(?=${nonWordCharacter})|(?:${nonWordCharacter})(?=${wordCharacter})`;
const nonWordBoundary = String.raw`(?:${wordCharacter})(?=${wordCharacter})`;
const lowerCaseLetter = String.raw`\p{Lowercase_Letter}`;
const upperCaseLetter = String.raw`\p{Uppercase_Letter}`;
const lowerCaseThenUpperCaseRE = new RegExp(
	`(${lowerCaseLetter})(${upperCaseLetter}${nonWordBoundary})`,
	"gu",
);

const nonWordCharacterHyphenOrSpaceRE =
	/[^-\p{White_Space}\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Join_Control}]/gu;
const upperOrWordBoundariedLowerRE = new RegExp(
	`${upperCaseLetter}|(?:${wordBoundary})${lowerCaseLetter}`,
	"gu",
);

/**
 * @param {string} text
 * @param {object} [options]
 * @param {boolean|null} [options.camel]
 * @returns {string}
 */
export function sluggify(text, { camel = null } = {}) {
	// Sanity check
	if (typeof text !== "string") {
		console.warn("Non-string argument passed to `sluggify`");
		return "";
	}

	// A hyphen by its lonesome would be wiped: return it as-is
	if (text === "-") return text;

	switch (camel) {
		case null:
			return text
				.replace(lowerCaseThenUpperCaseRE, "$1-$2")
				.toLowerCase()
				.replace(/['’]/g, "")
				.replace(nonWordCharacterRE, " ")
				.trim()
				.replace(/[-\s]+/g, "-");
		case "bactrian": {
			const dromedary = sluggify(text, { camel: "dromedary" });
			return dromedary.charAt(0).toUpperCase() + dromedary.slice(1);
		}
		case "dromedary":
			return text
				.replace(nonWordCharacterHyphenOrSpaceRE, "")
				.replace(/[-_]+/g, " ")
				.replace(upperOrWordBoundariedLowerRE, (part, index) =>
					index === 0 ? part.toLowerCase() : part.toUpperCase(),
				)
				.replace(/\s+/g, "");
		default:
			throw ErrorPF2e("I don't think that's a real camel.");
	}
}

/**
 * @template T
 * @param {Set<T>} set
 * @param {T} value
 * @returns {boolean}
 */
export function setHasElement(set, value) {
	return set.has(value);
}

/**
 * @template T
 * @param {[T, T]} array
 * @param {T} value
 * @returns {boolean}
 */
export function tupleHasValue(array, value) {
	return array.includes(value);
}
