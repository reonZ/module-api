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
