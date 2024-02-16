/**
 * @param {object[]} modifiers
 * @returns {number}
 */
export function applyStackingRules(modifiers: object[]): number;
/**
 * @typedef {object} TransferItemPacket
 * @property {string} options.source
 * @property {string} options.target
 * @property {string} options.item
 * @property {number} [options.quantity]
 * @property {string} [options.containerId]
 * @property {boolean} [options.newStack]
 *
 * @param {object} options
 * @param {Actor|string} options.source
 * @param {Actor|string} options.target
 * @param {Item|string} options.item
 * @param {number} [options.quantity]
 * @param {string} [options.containerId]
 * @param {boolean} [options.newStack]
 * @returns {Promise<void|TransferItemPacket>}
 */
export function tranferItemToActor({ source, target, item, quantity, containerId, newStack, }: {
    source: Actor | string;
    target: Actor | string;
    item: Item | string;
    quantity?: number;
    containerId?: string;
    newStack?: boolean;
}): Promise<void | TransferItemPacket>;
export type TransferItemPacket = {
    source: string;
    target: string;
    item: string;
    quantity?: number;
    containerId?: string;
    newStack?: boolean;
};
