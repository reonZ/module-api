/**
 * @template T
 *
 * @param {T[]} arr
 * @param {(value: T) => unknown} fn
 * @param {string | number} [key]
 * @returns {Record<T, unknown>}
 */
export function arrayToObject<T>(arr: T[], fn: (value: T) => unknown, key?: string | number): Record<T, unknown>;
/**
 *
 * @param {unknown[]} arr1
 * @param {unknown[]} arr2
 * @returns {boolean}
 */
export function compareArrays(arr1: unknown[], arr2: unknown[]): boolean;
/**
 * @param {number | undefined} index
 * @returns {boolean}
 */
export function indexIsValid(index: number | undefined): boolean;
