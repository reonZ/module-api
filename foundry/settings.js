import { arrayToObject } from "../utils";
import { MODULE } from "./module";

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
 * @template {number | boolean | string} T
 * @param {object} options
 * @param {string} options.key
 * @param {new (...args: unknkown[]) => T} options.type
 * @param {T} options.default
 * @param {boolean} [options.scope]
 * @param {boolean} [options.config]
 * @param {boolean} [options.requiresReload]
 * @param {(value: T) => void} [options.onChange]
 */
export function registerSetting(options) {
	options.key ??= options.name;

	if (Array.isArray(options.choices)) {
		options.choices = arrayToObject(options.choices, (choice) =>
			settingPath(options.key, "choices", choice),
		);
	}

	options.name = settingPath(options.key, "name");
	options.hint = settingPath(options.key, "hint");
	options.scope ??= "world";
	options.config ??= true;

	game.settings.register(MODULE.id, options.key, options);
}

/**
 * @param {object} options
 * @param {string} options.key
 * @param {typeof FormApplication} options.type
 * @param {string} [options.icon]
 * @param {boolean} [options.restricted]
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
