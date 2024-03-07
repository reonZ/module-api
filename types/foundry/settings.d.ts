export function isMenuSetting(setting: any): boolean;
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
 * @param {object} options
 * @param {string} options.key
 * @param {new (...args: unknkown[]) => T} options.type
 * @param {T} options.default
 * @param {boolean} [options.scope]
 * @param {boolean} [options.config]
 * @param {boolean} [options.requiresReload]
 * @param {(value: T) => void} [options.onChange]
 */
export function registerSetting<T extends string | number | boolean>(options: {
    key: string;
    type: new (...args: unknkown[]) => T;
    default: T;
    scope?: boolean;
    config?: boolean;
    requiresReload?: boolean;
    onChange?: (value: T) => void;
}): void;
/**
 * @param {object} options
 * @param {string} options.key
 * @param {typeof FormApplication} options.type
 * @param {string} [options.icon]
 * @param {boolean} [options.restricted]
 */
export function registerSettingMenu(options: {
    key: string;
    type: typeof FormApplication;
    icon?: string;
    restricted?: boolean;
}): void;
/**
 * @param {string[]} path
 * @returns {string}
 */
export function settingPath(...path: string[]): string;
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
