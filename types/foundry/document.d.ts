/**
 * @param {object} doc
 * @param {string[]} path
 * @returns {unknown}
 */
export function getInMemory(doc: object, ...path: string[]): unknown;
/**
 * @param {object} doc
 * @param  {(string|unknown)[]} args
 * @returns {Boolean}
 */
export function setInMemory(doc: object, ...args: (string | unknown)[]): boolean;
/**
 * @param {object} doc
 * @param {string[]} path
 * @returns {boolean}
 */
export function deleteInMemory(doc: object, ...path: string[]): boolean;
