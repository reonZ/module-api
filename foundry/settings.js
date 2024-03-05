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
