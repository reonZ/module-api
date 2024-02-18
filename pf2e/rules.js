import * as R from "remeda";

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
export function extractDamageDice(synthetics, options) {
	return options.selectors
		.flatMap((s) => synthetics[s] ?? [])
		.flatMap((d) => d(options) ?? []);
}

/**
 * @param {object} synthetics
 * @param {string[]} selectors
 * @param {object} options
 * @returns {object[]}
 */
export function extractModifiers(synthetics, selectors, options = {}) {
	const domains = R.uniq(selectors);
	const modifiers = domains
		.flatMap((s) => synthetics.modifiers[s] ?? [])
		.flatMap((d) => d(options) ?? []);
	for (const modifier of modifiers) {
		modifier.domains = [...domains];
		modifier.adjustments = extractModifierAdjustments(
			synthetics.modifierAdjustments,
			domains,
			modifier.slug,
		);
		if (domains.some((s) => s.endsWith("damage"))) {
			modifier.alterations = extractDamageAlterations(
				synthetics.damageAlterations,
				domains,
				modifier.slug,
			);
		}
	}

	return modifiers;
}

function extractDamageAlterations(alterationsRecord, selectors, slug) {
	const alterations = R.uniq(
		selectors.flatMap((s) => alterationsRecord[s] ?? []),
	);
	return alterations.filter((a) => [slug, null].includes(a.slug));
}

function extractModifierAdjustments(adjustmentsRecord, selectors, slug) {
	const adjustments = R.uniq(
		selectors.flatMap((s) => adjustmentsRecord[s] ?? []),
	);
	return adjustments.filter((a) => [slug, null].includes(a.slug));
}
