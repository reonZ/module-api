export const MAGIC_TRADITIONS = new Set([
	"arcane",
	"divine",
	"occult",
	"primal",
]);

export const traditionSkills = {
	arcane: "arcana",
	divine: "religion",
	occult: "occultism",
	primal: "nature",
};

/**
 * @param {string} groupId
 * @returns {number|null}
 */
export function spellSlotGroupIdToNumber(groupId) {
	if (groupId === "cantrips") return 0;
	const numericValue = Number(groupId ?? NaN);
	return numericValue.between(0, 10) ? numericValue : null;
}

/**
 * @param {string} value
 * @returns {number|null}
 */
export function coerceToSpellGroupId(value) {
	if (value === "cantrips") return value;
	const numericValue = Number(value) || NaN;
	return numericValue.between(1, 10) ? numericValue : null;
}
