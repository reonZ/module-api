import { MODULE } from "./module";

/**
 * @param  {string[]} path
 * @returns {string}
 */
export function flagPath(...path) {
	return `flags.${MODULE.path(path)}`;
}

/**
 * @param {object} doc
 * @param  {string[]} path
 * @returns {unknown}
 */
export function getFlag(doc, ...path) {
	return doc.getFlag(MODULE.id, path.join("."));
}

/**
 * @param {object} doc
 * @param  {string[]} path
 * @returns {unknown}
 */
export function getFlagProperty(doc, ...path) {
	return getProperty(doc, flagPath(...path));
}

/**
 * @template T
 * @param {T} doc
 * @param  {(string|unknown)[]} args
 * @returns {Promise<T>}
 */
export function setFlag(doc, ...args) {
	const value = args.splice(-1)[0];
	return doc.setFlag(MODULE.id, args.join("."), value);
}

/**
 * @template T
 * @param {T} doc
 * @param {string[]} path
 * @returns {Promise<T>}
 */
export function unsetFlag(doc, ...path) {
	return doc.unsetFlag(MODULE.id, path.join("."));
}

/**
 * @param {object} doc
 * @param  {(string|unknown)[]} args
 * @returns {object}
 */
export function updateSourceFlag(doc, ...args) {
	const value = args.splice(-1)[0];
	return doc.updateSource({
		[flagPath(...args)]: value,
	});
}

/**
 * @param {object} updates
 * @param  {(string|unknown)[]} args
 */
export function moduleFlagUpdate(updates, ...args) {
	const value = args.splice(-1)[0];
	updates[flagPath(...args)] = value;
}
