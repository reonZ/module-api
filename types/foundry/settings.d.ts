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
 * @param {SettingOptions} options
 */
export function registerSetting(options: SettingOptions): void;
/**
 * @param {SettingMenuOptions} options
 */
export function registerSettingMenu(options: SettingMenuOptions): void;
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
export type SettingOptions = {
    key: string;
    type: new (...args: unknown[]) => unknown;
    default: unknown;
    name?: string;
    hint?: string;
    scope?: "world" | "client";
    config?: boolean;
    choices?: string[] | Record<string, string>;
};
export type SettingMenuOptions = {
    key: string;
    name?: string;
    hint?: string;
    label?: string;
    restricted?: boolean;
    icon?: string;
};
