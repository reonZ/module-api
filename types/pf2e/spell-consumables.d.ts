/**
 * @param {Item} item
 * @param {object} [options]
 * @param {boolean} [options.pwol]
 * @returns {number}
 */
export function calculateTrickMagicItemCheckDC(item: Item, options?: {
    pwol?: boolean;
}): number;
/**
 * @param {SpellPF2e} spell
 * @param {object} options
 * @param {SpellConsumableItemType} options.type
 * @param {number} [options.heightenedLevel]
 * @param {boolean} [options.mystified]
 * @param {boolean} [options.temp]
 * @param {string} [options.itemImg]
 * @param {string} [options.itemName]
 * @returns {Promise<ConsumableSource>}
 */
export function createConsumableFromSpell(spell: SpellPF2e, { type, heightenedLevel, mystified, temp, itemImg, itemName, }: {
    type: SpellConsumableItemType;
    heightenedLevel?: number;
    mystified?: boolean;
    temp?: boolean;
    itemImg?: string;
    itemName?: string;
}): Promise<ConsumableSource>;
/**
 *
 * @param {SpellConsumableItemType} type
 * @param {number} heightenedLevel
 * @returns {string | null}
 */
export function getIdForSpellConsumable(type: SpellConsumableItemType, heightenedLevel: number): string | null;
/**
 *
 * @param {SpellConsumableItemType} type
 * @param {string} spellName
 * @param {number} heightenedLevel
 * @returns {string}
 */
export function getNameForSpellConsumable(type: SpellConsumableItemType, spellName: string, heightenedLevel: number): string;
export type SpellConsumableItemType = "scroll" | "wand" | "cantripDeck5";
