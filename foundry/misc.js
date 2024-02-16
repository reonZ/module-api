const actionGlyphMap = {
	0: "F",
	free: "F",
	1: "1",
	2: "2",
	3: "3",
	"1 or 2": "1/2",
	"1 to 3": "1 - 3",
	"2 or 3": "2/3",
	"2 rounds": "3,3",
	reaction: "R",
};

/**
 * @param {typeof actionGlyphMap} action
 * @returns {string}
 */
export function getActionGlyph(action) {
	if (!action && action !== 0) return "";

	const value =
		typeof action !== "object"
			? action
			: action.type === "action"
			  ? action.value
			  : action.type;
	const sanitized = String(value ?? "")
		.toLowerCase()
		.trim();

	return actionGlyphMap[sanitized]?.replace("-", "–") ?? "";
}
