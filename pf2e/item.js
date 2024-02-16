export const HANDWRAPS_SLUG = "handwraps-of-mighty-blows";

/**
 * @param {object} item
 * @returns {boolean}
 */
export function canBeInvested(item) {
	return item.traits.has("invested");
}

/**
 * @param {object} item
 * @returns {boolean}
 */
export function hasWornSlot(item) {
	return item.system.equipped.inSlot != null;
}

/**
 * @param {object} item
 * @returns {boolean}
 */
function isWornAs(item) {
	return item.system.usage.type === "worn" && item.system.equipped.inSlot;
}

/**
 * @param {object} item
 * @returns {boolean}
 */
export function isInvestedOrWornAs(item) {
	return item.isInvested || isWornAs(item);
}

/**
 * @param {object} item
 * @returns {boolean}
 */
export function isHeld(item) {
	return item.system.usage.type === "held";
}

/**
 * @param {object} item
 * @returns {boolean}
 */
export function isTwoHanded(item) {
	return isHeld(item) && item.system.usage.value === "held-in-two-hands";
}

/**
 * @param {object} item
 * @returns {boolean}
 */
export function isOneHanded(item) {
	return isHeld(item) && item.system.usage.value === "held-in-one-hand";
}

/**
 * @tempate T
 * @param {object} item
 * @param {T} value
 * @returns {T|undefined}
 */
function inSlotValue(item, value) {
	const usage = item.system.usage;
	return usage.type === "worn" && usage.where ? value : undefined;
}

/**
 * @param {object} item
 * @param {boolean} [invest]
 * @returns {boolean|undefined}
 */
function toggleInvestedValue(item, invest) {
	const value = invest ?? !item.system.equipped.invested;
	return item.traits.has("invested") ? value : undefined;
}

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
export function itemCarryUpdate(
	item,
	{ carryType = "worn", handsHeld = 0, inSlot, invested, containerId },
) {
	const update = {
		_id: item.id,
		system: {
			equipped: {
				carryType: carryType,
				handsHeld: handsHeld,
				inSlot: inSlotValue(item, inSlot),
				invested: toggleInvestedValue(item, invested),
			},
		},
	};

	if (containerId !== undefined) {
		update.system.containerId = containerId;
	}

	return update;
}

/**
 * @param {object} item
 * @returns {boolean}
 */
export function isHandwrapsOfMightyBlows(item) {
	return (
		item.isOfType("weapon") &&
		item.slug === HANDWRAPS_SLUG &&
		item.category === "unarmed"
	);
}

/**
 * @param {Item} item
 * @param {number} [quantity]
 * @returns {Coins}
 */
export function calculateItemPrice(item, quantity = 1, ratio = 1) {
	const coins = game.pf2e.Coins.fromPrice(item.price, quantity);
	if (ratio === 1) return coins;
	return coins.scale(ratio);
}
