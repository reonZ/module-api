export const adjustmentScale = [
    "incredibly-easy",
    "very-easy",
    "easy",
    "normal",
    "hard",
    "very-hard",
    "incredibly-hard",
];

export const dcAdjustments = new Map([
    ["incredibly-easy", -10],
    ["very-easy", -5],
    ["easy", -2],
    ["normal", 0],
    ["hard", 2],
    ["very-hard", 5],
    ["incredibly-hard", 10],
]);

export const dcByLevel = new Map([
    [-1, 13],
    [0, 14],
    [1, 15],
    [2, 16],
    [3, 18],
    [4, 19],
    [5, 20],
    [6, 22],
    [7, 23],
    [8, 24],
    [9, 26],
    [10, 27],
    [11, 28],
    [12, 30],
    [13, 31],
    [14, 32],
    [15, 34],
    [16, 35],
    [17, 36],
    [18, 38],
    [19, 39],
    [20, 40],
    [21, 42],
    [22, 44],
    [23, 46],
    [24, 48],
    [25, 50],
]);

export const simpleDCs = new Map([
    ["untrained", 10],
    ["trained", 15],
    ["expert", 20],
    ["master", 30],
    ["legendary", 40],
]);

export const simpleDCsWithoutLevel = new Map([
    ["untrained", 10],
    ["trained", 15],
    ["expert", 20],
    ["master", 25],
    ["legendary", 30],
]);

/**
 * @typedef {"untrained" | "trained" | "expert" | "master" | "legendary"} Rank
 */

/**
 * @typedef {"common" | "uncommon" | "rare" | "unique"} Rarity
 */

/**
 * @param {number} level
 * @returns {number}
 */
export function getDcByLevel(level) {
    const clamped = Math.clamp(level, -1, 25);
    return dcByLevel.get(clamped);
}

/**
 * @param {number} level
 * @param {object} [options]
 * @param {boolean} [options.pwol]
 * @param {Rarity} [options.rarity]
 * @returns {number}
 */
export function calculateDC(level, { pwol, rarity = "common" } = {}) {
    pwol ??= game.pf2e.settings.variants.pwol.enabled;

    // assume level 0 if garbage comes in. We cast level to number because the backing data may actually have it
    // stored as a string, which we can't catch at compile time
    const dc = dcByLevel.get(level) ?? 14;
    if (pwol) {
        // -1 shouldn't be subtracted since it's just
        // a creature level and not related to PC levels
        return adjustDCByRarity(dc - Math.max(level, 0), rarity);
    }

    return adjustDCByRarity(dc, rarity);
}

/**
 *
 * @param {Rank} rank
 * @param {object} [options]
 * @param {boolean} [options.pwol]
 * @returns {number}
 */
export function calculateSimpleDC(rank, { pwol = false } = {}) {
    if (pwol) {
        return simpleDCsWithoutLevel.get(rank) ?? 10;
    }

    return simpleDCs.get(rank) ?? 10;
}

/**
 *
 * @param {number} spellLevel
 * @param {object} [options]
 * @param {boolean} [options.pwol]
 * @returns {number}
 */
export function calculateSpellDC(spellLevel, { pwol = false } = {}) {
    return calculateDC(spellLevel * 2 - 1, { pwol });
}

/**
 *
 * @param {number} dc
 * @param {Rarity} rarity
 * @returns {number}
 */
export function adjustDCByRarity(dc, rarity = "common") {
    return adjustDC(dc, rarityToDCAdjustment(rarity));
}

/**
 *
 * @param {number} dc
 * @param {Rarity} adjustment
 * @returns {number}
 */
export function adjustDC(dc, adjustment = "normal") {
    return dc + (dcAdjustments.get(adjustment) ?? 0);
}

/**
 * @param {Rarity} rarity
 * @returns {"hard" | "normal" | "very-hard" | "incredibly-hard"}
 */
export function rarityToDCAdjustment(rarity = "common") {
    switch (rarity) {
        case "uncommon":
            return "hard";
        case "rare":
            return "very-hard";
        case "unique":
            return "incredibly-hard";
        default:
            return "normal";
    }
}
