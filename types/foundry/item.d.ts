/**
 *
 * @param {object} actor
 * @param {string|string[]} itemTypes
 * @returns {object[]}
 */
export function getItems(actor: object, itemTypes?: string | string[]): object[];
/**
 * @param {object} actor
 * @param {string} sourceId
 * @param {string|string[]} itemTypes
 * @returns {boolean}
 */
export function hasItemWithSourceId(actor: object, sourceId: string, itemTypes: string | string[]): boolean;
/**
 * @param {object} actor
 * @param {string} sourceId
 * @param {string|string[]} itemTypes
 * @returns {object} item
 */
export function getItemWithSourceId(actor: object, sourceId: string, itemTypes: string | string[]): object;
