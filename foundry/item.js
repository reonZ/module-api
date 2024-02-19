import { getSourceIdCondition } from "./document";

/**
 *
 * @param {object} actor
 * @param {string|string[]} itemTypes
 * @returns {object[]}
 */
export function getItems(actor, itemTypes = []) {
	const types = typeof itemTypes === "string" ? [itemTypes] : itemTypes;
	return types.length
		? types.flatMap((type) => actor.itemTypes[type])
		: actor.items;
}

/**
 * @param {object} actor
 * @param {string} sourceId
 * @param {string|string[]} itemTypes
 * @returns {boolean}
 */
export function hasItemWithSourceId(actor, sourceId, itemTypes) {
	return getItems(actor, itemTypes).some(getSourceIdCondition(sourceId));
}

/**
 * @param {object} actor
 * @param {string} sourceId
 * @param {string|string[]} itemTypes
 * @returns {object} item
 */
export function getItemWithSourceId(actor, sourceId, itemTypes) {
	return getItems(actor, itemTypes).find(getSourceIdCondition(sourceId));
}
