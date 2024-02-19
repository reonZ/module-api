/**
 * @param {number} value
 * @returns {string}
 */
export function ordinalString(value: number): string;
/**
 * @param {string} message
 * @returns {Error}
 */
export function ErrorPF2e(message: string): Error;
/**
 * @param {number} value
 * @param {object} [options]
 * @param {boolean} [options.emptyStringZero]
 * @param {boolean} [options.zeroIsNegative]
 * @returns {string}
 */
export function signedInteger(value: number, { emptyStringZero, zeroIsNegative }?: {
    emptyStringZero?: boolean;
    zeroIsNegative?: boolean;
}): string;
/**
 * @param {object} obj
 * @param {unknown} key
 * @returns {boolean}
 */
export function objectHasKey(obj: object, key: unknown): boolean;
/**
 * @param {string} prefix
 * @returns {(...args: (string|Record<string, unknown>)[]) => string}
 */
export function localizer(prefix: string): (...args: (string | Record<string, unknown>)[]) => string;
/**
 * @param {typeof actionGlyphMap} action
 * @returns {string}
 */
export function getActionGlyph(action: typeof actionGlyphMap): string;
/**
 *
 * @param {string | {type: string, value: 1|2|3|null} | null} action
 * @param {string} [fallback]
 * @returns {string|null}
 */
export function getActionIcon(action: string | {
    type: string;
    value: 1 | 2 | 3 | null;
}, fallback?: string): string | null;
/**
 * @param {string} text
 * @param {object} [options]
 * @param {boolean|null} [options.camel]
 * @returns {string}
 */
export function sluggify(text: string, { camel }?: {
    camel?: boolean | null;
}): string;
/**
 * @template T
 * @param {Set<T>} set
 * @param {T} value
 * @returns {boolean}
 */
export function setHasElement<T>(set: Set<T>, value: T): boolean;
/**
 * @template T
 * @param {[T, T]} array
 * @param {T} value
 * @returns {boolean}
 */
export function tupleHasValue<T>(array: [T, T], value: T): boolean;
declare const actionGlyphMap: {
    0: string;
    free: string;
    1: string;
    2: string;
    3: string;
    "1 or 2": string;
    "1 to 3": string;
    "2 or 3": string;
    reaction: string;
};
export {};
