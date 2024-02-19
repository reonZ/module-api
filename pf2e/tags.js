import { objectHasKey } from "./misc";

export function traitSlugToObject(trait, dictionary) {
	// Look up trait labels from `npcAttackTraits` instead of `weaponTraits` in case a battle form attack is
	// in use, which can include what are normally NPC-only traits
	const traitObject = {
		name: trait,
		label: game.i18n.localize(dictionary[trait] ?? trait),
		description: null,
	};
	if (objectHasKey(CONFIG.PF2E.traitsDescriptions, trait)) {
		traitObject.description = CONFIG.PF2E.traitsDescriptions[trait];
	}

	return traitObject;
}
