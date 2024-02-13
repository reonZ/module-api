import { MODULE } from ".";

/**
 * @param {string} path
 * @param {(...args: unknown[]) => unknown} callback
 * @param {"WRAPPER" | "OVERRIDE" | "MIXED"} type
 * @returns {string}
 */
export function registerWrapper(path, callback, type = "WRAPPER") {
	return libWrapper.register(MODULE.id, path, callback, type);
}

/**
 * @param {string} id
 */
export function unregisterWrapper(id) {
	libWrapper.unregister(MODULE.id, id);
}
