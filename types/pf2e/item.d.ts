/**
 * @param {object} item
 * @returns {boolean}
 */
export function canBeInvested(item: object): boolean;
/**
 * @param {object} item
 * @returns {boolean}
 */
export function hasWornSlot(item: object): boolean;
/**
 * @param {object} item
 * @returns {boolean}
 */
export function isInvestedOrWornAs(item: object): boolean;
/**
 * @param {object} item
 * @returns {boolean}
 */
export function isHeld(item: object): boolean;
/**
 * @param {object} item
 * @returns {boolean}
 */
export function isTwoHanded(item: object): boolean;
/**
 * @param {object} item
 * @returns {boolean}
 */
export function isOneHanded(item: object): boolean;
/**
 * @param {object} item
 * @param {object} options
 * @param {string} [options.carryType]
 * @param {number} [options.handsHeld]
 * @param {boolean} [options.inSlot]
 * @param {boolean} [options.invested]
 * @param {string|null} [options.containerId]
 * @returns {object}
 */
export function itemCarryUpdate(item: object, { carryType, handsHeld, inSlot, invested, containerId }: {
    carryType?: string;
    handsHeld?: number;
    inSlot?: boolean;
    invested?: boolean;
    containerId?: string | null;
}): object;
/**
 * @param {object} item
 * @returns {boolean}
 */
export function isHandwrapsOfMightyBlows(item: object): boolean;
/**
 * @param {Item} item
 * @param {number} [quantity]
 * @returns {Coins}
 */
export function calculateItemPrice(item: Item, quantity?: number, ratio?: number): Coins;
export const HANDWRAPS_SLUG: "handwraps-of-mighty-blows";
