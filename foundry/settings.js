import * as R from "remeda";
import { MODULE } from "./module";

/**
 * @typedef {object} SettingOptions
 * @property {string} key
 * @property {new (...args: unknown[]) => unknown} type
 * @property {unknown} default
 * @property {string} [name]
 * @property {string} [hint]
 * @property {"world"|"client"} [scope]
 * @property {boolean} [config]
 * @property {string[]|Record<string, string>} [choices]
 */

/**
 * @typedef {object} SettingMenuOptions
 * @property {string} key
 * @property {string} [name]
 * @property {string} [hint]
 * @property {string} [label]
 * @property {boolean} [restricted]
 * @property {string} [icon]
 */

export function isMenuSetting(setting) {
	return setting.type.prototype instanceof Application;
}

/**
 * @param {object} setting
 * @returns {boolean}
 */
export function isWorldSetting(setting) {
	return setting.restricted || setting.scope === "world";
}

/**
 * @param {object} setting
 * @returns {boolean}
 */
export function isClientSetting(setting) {
	return !setting.restricted || setting.scope === "client";
}

/**
 * @param {SettingOptions} options
 */
export function registerSetting(options) {
	options.key ??= options.name;

	if (Array.isArray(options.choices)) {
		options.choices = R.mapToObj(options.choices, (choice) => [
			choice,
			settingPath(options.key, "choices", choice),
		]);
	}

	options.name = settingPath(options.key, "name");
	options.hint = settingPath(options.key, "hint");
	options.scope ??= "world";
	options.config ??= true;

	game.settings.register(MODULE.id, options.key, options);
}

/**
 * @param {SettingMenuOptions} options
 */
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
 * @returns {string}
 */
export function settingPath(...path) {
	return MODULE.path("settings", path);
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
