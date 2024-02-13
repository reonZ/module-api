/**
 * @param {object} options
 * @param {string} options.affects
 * @param {object} options.origin
 * @param {object} options.target
 * @param {object} options.item
 * @param {string[]} options.domains
 * @param {string[]} options.options
 * @returns {Promise<object[]>}
 */
export async function extractEphemeralEffects({
	affects,
	origin,
	target,
	item,
	domains,
	options,
}) {
	if (!(origin && target)) return [];

	const [effectsFrom, effectsTo] =
		affects === "target" ? [origin, target] : [target, origin];
	const fullOptions = [
		...options,
		effectsFrom.getRollOptions(domains),
		effectsTo.getSelfRollOptions(affects),
	].flat();
	const resolvables = item
		? item.isOfType("spell")
			? { spell: item }
			: { weapon: item }
		: {};
	return (
		await Promise.all(
			domains
				.flatMap(
					(s) => effectsFrom.synthetics.ephemeralEffects[s]?.[affects] ?? [],
				)
				.map((d) => d({ test: fullOptions, resolvables })),
		)
	).flatMap((e) => e ?? []);
}

/**
 * @param {object} rollNotes
 * @param {string[]} selectors
 * @returns {object[]}
 */
export function extractNotes(rollNotes, selectors) {
	return selectors.flatMap((s) => (rollNotes[s] ?? []).map((n) => n.clone()));
}

/**
 *
 * @param {object} deferredDice
 * @param {string[]} selectors
 * @param {object} options
 * @returns {object[]}
 */
export function extractDamageDice(deferredDice, selectors, options) {
	return selectors
		.flatMap((s) => deferredDice[s] ?? [])
		.flatMap((d) => d(options) ?? []);
}

/**
 * @param {object} synthetics
 * @param {string[]} selectors
 * @param {object} options
 * @returns {object[]}
 */
export function extractModifiers(synthetics, selectors, options) {
	const { modifierAdjustments, modifiers: syntheticModifiers } = synthetics;
	const modifiers = Array.from(new Set(selectors))
		.flatMap((s) => syntheticModifiers[s] ?? [])
		.flatMap((d) => d(options) ?? []);
	for (const modifier of modifiers) {
		modifier.adjustments = extractModifierAdjustments(
			modifierAdjustments,
			selectors,
			modifier.slug,
		);
	}

	return modifiers;
}

/**
 * @param {object} adjustmentsRecord
 * @param {string[]} selectors
 * @param {string} slug
 * @returns {object[]}
 */
function extractModifierAdjustments(adjustmentsRecord, selectors, slug) {
	const adjustments = Array.from(
		new Set(selectors.flatMap((s) => adjustmentsRecord[s] ?? [])),
	);
	return adjustments.filter((a) => [slug, null].includes(a.slug));
}
