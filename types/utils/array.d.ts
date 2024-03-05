/**
 * @template T
 *
 * @param {T[]} arr
 * @param {(value: T) => unknown} fn
 * @param {string | number} [key]
 * @returns {Record<T, unknown>}
 */
export function arrayToObject<T>(arr: T[], fn: (value: T) => unknown, key?: string | number): Record<T, unknown>;
