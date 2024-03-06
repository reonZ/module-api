/**
 * @param {string} separator
 * @param  {(string|string[])[]} path
 * @returns {string}
 */
export function joinStr(separator, ...path) {
	const pathArr = path.flatMap((x) => x);
	return pathArr.filter((x) => typeof x === "string").join(separator);
}
