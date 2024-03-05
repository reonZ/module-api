/**
 * @param {object} setting
 * @returns {boolean}
 */
export function isWorldSetting(setting: object): boolean;
/**
 * @param {object} setting
 * @returns {boolean}
 */
export function isClientSetting(setting: object): boolean;
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
/**
 * @param {string[]} path
 * @returns {string}
 */
export function settingPath(...path: string[]): string;
