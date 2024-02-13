/**
 * @param {object} obj
 * @param {string} name
 * @returns {boolean}
 */
export function isInstanceOf(obj, name) {
	if (typeof obj !== "object") return false;

	let cursor = Reflect.getPrototypeOf(obj);
	while (cursor) {
		if (cursor.constructor.name === name) return true;
		cursor = Reflect.getPrototypeOf(cursor);
	}

	return false;
}
