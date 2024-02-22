/**
 * @param {string} groupId
 * @returns {number|null}
 */
export function spellSlotGroupIdToNumber(groupId: string): number | null;
/**
 * @param {string} value
 * @returns {number|null}
 */
export function coerceToSpellGroupId(value: string): number | null;
export const EFFECT_AREA_SHAPES: string[];
export const MAGIC_TRADITIONS: Set<string>;
export namespace traditionSkills {
    let arcane: string;
    let divine: string;
    let occult: string;
    let primal: string;
}
