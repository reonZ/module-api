/**
 * @param {object} item
 * @returns {string}
 */
function getSourceId(item) {
	return item.getFlag("core", "sourceId");
}

/**
 * @param {object} item
 * @param {string[]} list
 * @returns {boolean}
 */
function includesSourceId(item, list) {
	const sourceId = getSourceId(item);
	return sourceId ? list.includes(sourceId) : false;
}

/**
 * @param {string|string[]} sourceId
 * @returns {(item: object) => boolean}
 */
function getItemSourceIdCondition(sourceId) {
	return Array.isArray(sourceId)
		? (item) => includesSourceId(item, sourceId)
		: (item) => getSourceId(item) === sourceId;
}

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
	return getItems(actor, itemTypes).some(getItemSourceIdCondition(sourceId));
}

/**
 * @param {object} actor
 * @param {string} sourceId
 * @param {string|string[]} itemTypes
 * @returns {object} item
 */
export function getItemWithSourceId(actor, sourceId, itemTypes) {
	return getItems(actor, itemTypes).find(getItemSourceIdCondition(sourceId));
}
