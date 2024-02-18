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
/**
 * @param {Actor} target
 * @param {Item} item
 * @param {number} quantity
 * @param {string} [containerId]
 * @param {boolean} [newStack]
 * @returns {Promise<Item>}
 */
export function transferItemToActor(target: Actor, item: Item, quantity: number, containerId?: string, newStack?: boolean): Promise<Item>;
export const HANDWRAPS_SLUG: "handwraps-of-mighty-blows";
export class MoveLootPopup {
    static get defaultOptions(): any;
    /**
     * @param {Actor} object
     * @param {object} options
     * @param {{default: number, max: number}} options.quantity
     * @param {boolean} options.newStack
     * @param {boolean} options.lockStack
     * @param {boolean} options.isPurchase
     * @param {(quantity: number, newStack: boolean) => void} callback
     */
    constructor(object: Actor, options: {
        quantity: {
            default: number;
            max: number;
        };
        newStack: boolean;
        lockStack: boolean;
        isPurchase: boolean;
    }, callback: (quantity: number, newStack: boolean) => void);
    onSubmitCallback: (quantity: number, newStack: boolean) => void;
    getData(): Promise<any>;
    _updateObject(_event: any, formData: any): Promise<void>;
}
