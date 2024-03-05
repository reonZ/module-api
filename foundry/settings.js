import { arrayToObject } from "../utils";
import { MODULE } from "./module";

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
 * @param { {key: string, type: new (...args: unknkown[]) => T, default: T, [k: string]: unknown }} options
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
 * @param {string[]} path
 * @returns {string}
 */
export function settingPath(...path) {
	return `${MODULE.id}.settings.${path.join(".")}`;
}
