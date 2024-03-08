/**
 * @param {(string | object)[]} args
 * @returns {string}
 */
export function localize(...args: (string | object)[]): string;
/**
 * Check if a module localization exists
 * @param {string[]} keys
 * @returns {boolean}
 */
export function hasLocalization(...keys: string[]): boolean;
/**
 * @param {string} subKey
 * @returns {((key: string, options: {hash: Record<string, string|number|boolean>}) => string) & {path: typeof localizePath, sub: typeof subLocalize}}
 */
export function templateLocalize(subKey: string): ((key: string, options: {
    hash: Record<string, string | number | boolean>;
}) => string) & {
    path: typeof localizePath;
    sub: typeof subLocalize;
};
/**
 * @param  {string[]} path
 * @returns {string}
 */
export function localizePath(...path: string[]): string;
/**
 * Convenient localization object with a sub context
 * @param {string} subKey
 * @returns { typeof localize & {path: typeof localizePath, warn: typeof warn, info: typeof info, error: typeof error, i18n: typeof templateLocalize & {path: typeof localizePath, sub: typeof subLocalize}, sub: typeof subLocalize} }
 */
export function subLocalize(subKey: string): typeof localize & {
    path: typeof localizePath;
    warn: typeof warn;
    info: typeof info;
    error: typeof error;
    i18n: typeof templateLocalize & {
        path: typeof localizePath;
        sub: typeof subLocalize;
    };
    sub: typeof subLocalize;
};
import { warn } from "./notifications";
import { info } from "./notifications";
import { error } from "./notifications";
