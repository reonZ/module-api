/**
 * Register a foundry setting
 *
 * @template {number | boolean | string} T
 * @param { {key: string, type: new (...args: unknkown[]) => T, default: T, [k: string]: unknown }} options
 */
export function registerSetting<T extends string | number | boolean>(options: {
    [k: string]: unknown;
    key: string;
    type: new (...args: unknkown[]) => T;
    default: T;
}): void;
/**
 * @param {string} setting
 * @param {string} key
 * @returns
 */
export function settingPath(setting: string, key: string): string;
/**
 * @param {string} setting
 * @returns {unknown}
 */
export function getSetting(setting: string): unknown;
/**
 * @template T
 * @param {string} setting
 * @param {T} value
 * @returns {Promise<T>}
 */
export function setSetting<T>(setting: string, value: T): Promise<T>;
