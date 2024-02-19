/**
 * @template {number | boolean | string} T
 * @param { {key: string, type: new (...args: unknkown[]) => T, default: T, [k: string]: unknown }} options
 */
export function registerSetting<T extends string | number | boolean>(options: {
    [k: string]: unknown;
    key: string;
    type: new (...args: unknkown[]) => T;
    default: T;
}): void;
export function registerSettingMenu(options: any): void;
/**
 * @param {string[]} path
 * @returns
 */
export function settingPath(...path: string[]): string;
/**
 * @param {string} setting
 * @returns {unknown}
 */
export function getSetting(setting: string): unknown;
/**
 * @param {string} setting
 * @returns {boolean}
 */
export function isChoiceSetting(setting: string): boolean;
/**
 * @template T
 * @param {string} setting
 * @param {T} value
 * @returns {Promise<T>}
 */
export function setSetting<T>(setting: string, value: T): Promise<T>;
