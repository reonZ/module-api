import { MODULE } from ".";
import { arrayToObject } from "../utils/array";

/**
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

export function registerSettingMenu(options) {
	options.key ??= options.name;

	options.name = settingPath("menus", options.key, "name");
	options.label = settingPath("menus", options.key, "label");
	options.hint = settingPath("menus", options.key, "hint");
	options.restricted ??= true;
	options.icon ??= "fas fa-cogs";

	game.settings.registerMenu(MODULE.id, options.key, options);
}

/**
 * @param {string[]} path
 * @returns
 */
export function settingPath(...path) {
	return `${MODULE.id}.settings.${path.join(".")}`;
}

/**
 * @param {string} setting
 * @returns {unknown}
 */
export function getSetting(setting) {
	return game.settings.get(MODULE.id, setting);
}

/**
 * @param {string} setting
 * @returns {boolean}
 */
export function isChoiceSetting(setting) {
	return !!game.settings.settings.get(`${MODULE.id}.${setting}`)?.choices;
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
