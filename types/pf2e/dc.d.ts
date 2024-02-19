/**
 * @typedef {"untrained" | "trained" | "expert" | "master" | "legendary"} Rank
 */
/**
 * @typedef {"common" | "uncommon" | "rare" | "unique"} Rarity
 */
/**
 * @param {number} level
 * @param {object} [options]
 * @param {boolean} [options.pwol]
 * @param {Rarity} [options.rarity]
 * @returns {number}
 */
export function calculateDC(level: number, { pwol, rarity }?: {
    pwol?: boolean;
    rarity?: Rarity;
}): number;
/**
 *
 * @param {Rank} rank
 * @param {object} [options]
 * @param {boolean} [options.pwol]
 * @returns {number}
 */
export function calculateSimpleDC(rank: Rank, { pwol }?: {
    pwol?: boolean;
}): number;
/**
 *
 * @param {number} spellLevel
 * @param {object} [options]
 * @param {boolean} [options.pwol]
 * @returns {number}
 */
export function calculateSpellDC(spellLevel: number, { pwol }?: {
    pwol?: boolean;
}): number;
/**
 *
 * @param {number} dc
 * @param {Rarity} rarity
 * @returns {number}
 */
export function adjustDCByRarity(dc: number, rarity?: Rarity): number;
/**
 *
 * @param {number} dc
 * @param {Rarity} adjustment
 * @returns {number}
 */
export function adjustDC(dc: number, adjustment?: Rarity): number;
/**
 * @param {Rarity} rarity
 * @returns {"hard" | "normal" | "very-hard" | "incredibly-hard"}
 */
export function rarityToDCAdjustment(rarity?: Rarity): "hard" | "normal" | "very-hard" | "incredibly-hard";
export const adjustmentScale: string[];
export const dcAdjustments: Map<string, number>;
export const dcByLevel: Map<number, number>;
export const simpleDCs: Map<string, number>;
export const simpleDCsWithoutLevel: Map<string, number>;
export type Rank = "untrained" | "trained" | "expert" | "master" | "legendary";
export type Rarity = "common" | "uncommon" | "rare" | "unique";
