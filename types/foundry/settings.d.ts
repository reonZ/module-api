/**
 * @typedef {object} SettingOptions
 * @property {string} namespace
 * @property {string} key
 * @property {new (...args: unknown[]) => unknown} type
 * @property {unknown} default
 * @property {string} [name]
 * @property {string} [hint]
 * @property {"world"|"client"} [scope]
 * @property {boolean} [config]
 * @property {boolean} [requiresReload]
 * @property {string[]|Record<string, string>} [choices]
 * @property {(value: unknown) => void} [onChange]
 *
 * @typedef {Omit<SettingOptions, "namespace"|"hint">} ModuleSettingOptions
 */
/**
 * @typedef {object} SettingMenuOptions
 * @property {string} namespace
 * @property {string} key
 * @property {string} [name]
 * @property {string} [hint]
 * @property {string} [label]
 * @property {boolean} [restricted]
 * @property {string} [icon]
 *
 * @typedef {Omit<SettingMenuOptions, "namespace"|"hint"|"label">} ModuleSettingMenuOptions
 */
/**
 *
 * @param {SettingOptions|SettingMenuOptions} setting
 * @returns {boolean}
 */
export function isMenuSetting(setting: SettingOptions | SettingMenuOptions): boolean;
/**
 * @param {SettingOptions|SettingMenuOptions} setting
 * @returns {boolean}
 */
export function isWorldSetting(setting: SettingOptions | SettingMenuOptions): boolean;
/**
 * @param {SettingOptions|SettingMenuOptions} setting
 * @returns {boolean}
 */
export function isClientSetting(setting: SettingOptions | SettingMenuOptions): boolean;
/**
 * @param {ModuleSettingOptions} options
 */
export function registerSetting(options: ModuleSettingOptions): void;
/**
 * @param {ModuleSettingMenuOptions} options
 */
export function registerSettingMenu(options: ModuleSettingMenuOptions): void;
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
    namespace: string;
    key: string;
    type: new (...args: unknown[]) => unknown;
    default: unknown;
    name?: string;
    hint?: string;
    scope?: "world" | "client";
    config?: boolean;
    requiresReload?: boolean;
    choices?: string[] | Record<string, string>;
    onChange?: (value: unknown) => void;
};
export type ModuleSettingOptions = Omit<SettingOptions, "namespace" | "hint">;
export type SettingMenuOptions = {
    namespace: string;
    key: string;
    name?: string;
    hint?: string;
    label?: string;
    restricted?: boolean;
    icon?: string;
};
export type ModuleSettingMenuOptions = Omit<SettingMenuOptions, "namespace" | "hint" | "label">;
