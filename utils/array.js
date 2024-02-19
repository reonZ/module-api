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

/**
 *
 * @param {unknown[]} arr1
 * @param {unknown[]} arr2
 * @returns {boolean}
 */
export function compareArrays(arr1, arr2) {
	if (arr1.length !== arr2.length) return false;

	const clonedArr2 = arr2.slice();

	for (const arr1Value of arr1) {
		const index = clonedArr2.findIndex((arr2Value) => arr1Value === arr2Value);
		if (index === -1) return false;
		clonedArr2.splice(index, 1);
	}

	return true;
}

/**
 * @param {number | undefined} index
 * @returns {boolean}
 */
export function indexIsValid(index) {
	return index !== undefined && index !== -1;
}

/**
 * @param {number} start
 * @param {number} end
 * @returns {number[]}
 */
export function sequenceArray(start, end) {
	const levels = [];

	if (start <= end) {
		for (let i = start; i <= end; i++) levels.push(i);
	} else {
		for (let i = start; i >= end; i--) levels.push(i);
	}

	return levels;
}
