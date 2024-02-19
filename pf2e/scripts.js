function isRelevantEvent(event) {
	return (
		!!event && "ctrlKey" in event && "metaKey" in event && "shiftKey" in event
	);
}

/**
 * @param {Event} event
 * @param {string} rollType
 * @returns {skipDialog: boolean, rollMode?: string}
 */
export function eventToRollParams(event, rollType) {
	const key =
		rollType.type === "check" ? "showCheckDialogs" : "showDamageDialogs";
	const skipDefault = !game.user.settings[key];
	if (!isRelevantEvent(event)) return { skipDialog: skipDefault };

	const params = { skipDialog: event.shiftKey ? !skipDefault : skipDefault };
	if (event.ctrlKey || event.metaKey) {
		params.rollMode = game.user.isGM ? "gmroll" : "blindroll";
	}

	return params;
}

/**
 * @param {Event} event
 * @returns {string}
 */
export function eventToRollMode(event) {
	if (!isRelevantEvent(event) || !(event.ctrlKey || event.metaKey))
		return "roll";
	return game.user.isGM ? "gmroll" : "blindroll";
}
