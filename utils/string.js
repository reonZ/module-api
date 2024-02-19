/**
 * @param {string} separator
 * @param  {(string|string[])[]} path
 * @returns {string}
 */
export function joinStr(separator, ...path) {
	const pathArr = Array.isArray(path[0]) ? path[0] : path;
	return pathArr.filter((x) => typeof x === "string").join(separator);
}

/**
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
	if (!str) return "";
	return str[0].toUpperCase() + str.slice(1);
}
