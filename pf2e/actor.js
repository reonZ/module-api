import * as R from "remeda";

/** A comparison which rates the first modifier as better than the second if it's modifier is at least as large. */
const HIGHER_BONUS = (a, b) => a.modifier >= b.modifier;
/** A comparison which rates the first modifier as better than the second if it's modifier is at least as small. */
const LOWER_PENALTY = (a, b) => a.modifier <= b.modifier;

/**
 * @param {object[]} modifiers
 * @returns {number}
 */
export function applyStackingRules(modifiers) {
	let total = 0;
	const highestBonus = {};
	const lowestPenalty = {};

	// There are no ability bonuses or penalties, so always take the highest ability modifier.
	const abilityModifiers = modifiers.filter(
		(m) => m.type === "ability" && !m.ignored,
	);
	const bestAbility = abilityModifiers.reduce((best, modifier) => {
		if (best === null) {
			return modifier;
		}

		return modifier.force
			? modifier
			: best.force
			  ? best
			  : modifier.modifier > best.modifier
				  ? modifier
				  : best;
	}, null);
	for (const modifier of abilityModifiers) {
		modifier.ignored = modifier !== bestAbility;
	}

	for (const modifier of modifiers) {
		// Always disable ignored modifiers and don't do anything further with them.
		if (modifier.ignored) {
			modifier.enabled = false;
			continue;
		}

		// Untyped modifiers always stack, so enable them and add their modifier.
		if (modifier.type === "untyped") {
			modifier.enabled = true;
			total += modifier.modifier;
			continue;
		}

		// Otherwise, apply stacking rules to positive modifiers and negative modifiers separately.
		if (modifier.modifier < 0) {
			total += applyStacking(lowestPenalty, modifier, LOWER_PENALTY);
		} else {
			total += applyStacking(highestBonus, modifier, HIGHER_BONUS);
		}
	}

	return total;
}

/**
 * @template T
 * @param {Record<string, T>} best
 * @param {T} modifier
 * @param {(a: object, b:object) => boolean} isBetter
 * @returns {number}
 */
function applyStacking(best, modifier, isBetter) {
	// If there is no existing bonus of this type, then add ourselves.
	const existing = best[modifier.type];
	if (existing === undefined) {
		modifier.enabled = true;
		best[modifier.type] = modifier;
		return modifier.modifier;
	}

	if (isBetter(modifier, existing)) {
		// If we are a better modifier according to the comparison, then we become the new 'best'.
		existing.enabled = false;
		modifier.enabled = true;
		best[modifier.type] = modifier;
		return modifier.modifier - existing.modifier;
	}

	// Otherwise, the existing modifier is better, so do nothing.
	modifier.enabled = false;
	return 0;
}

export function getSelectedActors(options = {}) {
	const {
		include = actorTypes,
		exclude = [],
		assignedFallback = false,
	} = options;
	const actors = R.uniq(
		game.user
			.getActiveTokens()
			.flatMap((t) =>
				t.actor &&
				(include.length === 0 || t.actor.isOfType(...include)) &&
				(exclude.length === 0 || !t.actor.isOfType(...exclude))
					? t.actor
					: [],
			),
	);
	const assigned = game.user.character;
	if (actors.length > 0 || !assignedFallback || !assigned) {
		return actors;
	}

	if (
		(include.length === 0 || assigned.isOfType(...include)) &&
		(exclude.length === 0 || !assigned.isOfType(...exclude))
	) {
		return [assigned];
	}

	return [];
}
