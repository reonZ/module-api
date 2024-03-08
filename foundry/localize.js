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
 * Used to localize in handlebars template
 * @param  {(string | {hash: object})[]} args
 * @returns {string}
 */
export function templateLocalize(...args) {
	const data = args.splice(-1)[0].hash;
	return localize(...args, data);
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
 * @returns { typeof localize & {path: typeof localizePath, template: typeof templateLocalize, warn: typeof warn, info: typeof info, error: typeof error, i18n: {i18n: typeof templateLocalize, i18Path: typeof localizePath}, sub: typeof subLocalize} }
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
		template: {
			value: (key, { hash }) => fn(key, hash),
			enumerable: false,
			configurable: false,
		},
		i18n: {
			get() {
				return {
					i18n: this.template,
					i18Path: this.path,
				};
			},
			enumerable: false,
			configurable: false,
		},
		sub: {
			value: (key) => subLocalize(`${subKey}.${key}`),
			enumerable: false,
			configurable: false,
		},
	});

	return fn;
}
