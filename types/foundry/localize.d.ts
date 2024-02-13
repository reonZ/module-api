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
 * Used to localize in handlebars template
 * @param  {(string | {hash: object})[]} args
 * @returns {string}
 */
export function templateLocalize(...args: (string | {
    hash: object;
})[]): string;
/**
 * @param  {string[]} path
 * @returns {string}
 */
export function localizePath(...path: string[]): string;
/**
 * Convenient localization object with a sub context
 * @param {string} subKey
 * @returns {typeof localize & {path: typeof localizePath, template: typeof templateLocalize, warn: typeof warn, info: typeof info, error: typeof error}}
 */
export function subLocalize(subKey: string): typeof localize & {
    path: typeof localizePath;
    template: typeof templateLocalize;
    warn: typeof warn;
    info: typeof info;
    error: typeof error;
};
/**
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function localeCompare(a: string, b: string): number;
import { warn } from ".";
import { info } from ".";
import { error } from ".";
