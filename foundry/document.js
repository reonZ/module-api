import { MODULE } from ".";

/**
 * @param {object} doc
 * @param {string[]} path
 * @returns {unknown}
 */
export function getInMemory(doc, ...path) {
	return getProperty(doc, `modules.${MODULE.id}.${path.join(".")}`);
}

/**
 * @param {object} doc
 * @param  {(string|unknown)[]} args
 * @returns {Boolean}
 */
export function setInMemory(doc, ...args) {
	const value = args.splice(-1)[0];
	return setProperty(doc, `modules.${MODULE.id}.${args.join(".")}`, value);
}

/**
 * @param {object} doc
 * @param {string[]} path
 * @returns {boolean}
 */
export function deleteInMemory(doc, ...path) {
	const split = ["modules", MODULE.id, ...path];
	const last = split.pop();
	let cursor = doc;
	for (const key of split) {
		cursor = cursor[key];
		if (!cursor) return true;
	}
	return delete cursor[last];
}
