/**
 * @template T
 *
 * @param {T[]} arr
 * @param {(value: T) => unknown} fn
 * @param {string | number} [key]
 * @returns {Record<T, unknown>}
 */
export function arrayToObject(arr, fn, key) {
	const obj = {};
	for (const entry of arr) {
		const k = Array.isArray(entry)
			? entry[key ?? 0]
			: typeof entry === "object" && key != null
			  ? entry[key]
			  : entry;
		obj[k] = fn(entry);
	}
	return obj;
}
