import { joinStr } from "../utils";
import { MODULE } from "./module";
import { error, info, warn } from "./notifications";

/**
 * @param {(string | object)[]} args
 * @returns {string}
 */
export function localize(...args) {
	args.unshift(MODULE.id);
	const data = typeof args.at(-1) === "object" ? args.splice(-1)[0] : undefined;
	return game.i18n[data ? "format" : "localize"](joinStr(".", args), data);
}

/**
 * Check if a module localization exists
 * @param {string[]} keys
 * @returns {boolean}
 */
export function hasLocalization(...keys) {
	return game.i18n.has(`${MODULE.path(keys)}`, false);
}

/**
 * @param {string} subKey
 * @returns {((key: string, options: {hash: Record<string, string|number|boolean>}) => string) & {path: typeof localizePath, sub: typeof subLocalize}}
 */
export function templateLocalize(subKey) {
	const fn = (key, { hash } = {}) => localize(subKey, key, hash);
	Object.defineProperties(fn, {
		path: {
			value: (key) => localizePath(subKey, key),
			enumerable: false,
			configurable: false,
		},
		sub: {
			value: (key) => {
				const joinedKey = subKey ? `${subKey}.${key}` : key;
				return subLocalize(joinedKey).i18n;
			},
			enumerable: false,
			configurable: false,
		},
	});
	return fn;
}

/**
 * @param  {string[]} path
 * @returns {string}
 */
export function localizePath(...path) {
	return MODULE.path(path);
}

/**
 * Convenient localization object with a sub context
 * @param {string} subKey
 * @returns { typeof localize & {path: typeof localizePath, warn: typeof warn, info: typeof info, error: typeof error, i18n: typeof templateLocalize & {path: typeof localizePath, sub: typeof subLocalize}, sub: typeof subLocalize} }
 */
export function subLocalize(subKey) {
	const fn = (...args) => localize(subKey, ...args);

	Object.defineProperties(fn, {
		warn: {
			value: (str, arg1, arg2) => warn(`${subKey}.${str}`, arg1, arg2),
			enumerable: false,
			configurable: false,
		},
		info: {
			value: (str, arg1, arg2) => info(`${subKey}.${str}`, arg1, arg2),
			enumerable: false,
			configurable: false,
		},
		error: {
			value: (str, arg1, arg2) => error(`${subKey}.${str}`, arg1, arg2),
			enumerable: false,
			configurable: false,
		},
		has: {
			value: (key) => hasLocalization(subKey, key),
			enumerable: false,
			configurable: false,
		},
		path: {
			value: (key) => localizePath(subKey, key),
			enumerable: false,
			configurable: false,
		},
		sub: {
			value: (key) => subLocalize(`${subKey}.${key}`),
			enumerable: false,
			configurable: false,
		},
		i18n: {
			get() {
				return templateLocalize(subKey);
			},
			enumerable: false,
			configurable: false,
		},
	});

	return fn;
}
