import { MODULE } from ".";
import { arrayToObject } from "../utils/array";

/**
 * Register a foundry setting
 *
 * @template {number | boolean | string} T
 * @param { {key: string, type: new (...args: unknkown[]) => T, default: T, [k: string]: unknown }} options
 */
export function registerSetting(options) {
	options.key ??= options.name;

	if (Array.isArray(options.choices)) {
		options.choices = arrayToObject(options.choices, (choice) =>
			settingPath(options.key, `choices.${choice}`),
		);
	}

	options.name ??= settingPath(options.key, "name");
	options.hint ??= settingPath(options.key, "hint");
	options.scope ??= "world";
	options.config ??= true;

	game.settings.register(MODULE.id, options.key, options);
}

/**
 * @param {string} setting
 * @param {string} key
 * @returns
 */
export function settingPath(setting, key) {
	return `${MODULE.id}.settings.${setting}.${key}`;
}

/**
 * @param {string} setting
 * @returns {unknown}
 */
export function getSetting(setting) {
	return game.settings.get(MODULE.id, setting);
}

/**
 * @template T
 * @param {string} setting
 * @param {T} value
 * @returns {Promise<T>}
 */
export function setSetting(setting, value) {
	return game.settings.set(MODULE.id, setting, value);
}
