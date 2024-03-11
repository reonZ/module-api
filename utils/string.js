import * as R from "remeda";

/**
 * @param {string} separator
 * @param  {(string|string[])[]} path
 * @returns {string}
 */
export function joinStr(separator, ...path) {
	return R.pipe(
		path,
		R.flatten(),
		R.filter((x) => typeof x === "string"),
		R.join(separator),
	);
}
