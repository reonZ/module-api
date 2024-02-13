/**
 * @param  {string[]} path
 * @returns {string}
 */
export function flagPath(...path: string[]): string;
/**
 * @param {object} doc
 * @param  {string[]} path
 * @returns {unknown}
 */
export function getFlag(doc: object, ...path: string[]): unknown;
/**
 * @param {object} doc
 * @param  {string[]} path
 * @returns {unknown}
 */
export function getFlagProperty(doc: object, ...path: string[]): unknown;
/**
 * @template T
 * @param {T} doc
 * @param  {(string|unknown)[]} args
 * @returns {Promise<T>}
 */
export function setFlag<T>(doc: T, ...args: (string | unknown)[]): Promise<T>;
/**
 * @template T
 * @param {T} doc
 * @param {string[]} path
 * @returns {Promise<T>}
 */
export function unsetFlag<T>(doc: T, ...path: string[]): Promise<T>;
/**
 * @param {object} doc
 * @returns {unknown}
 */
export function getModuleFlags(doc: object): unknown;
/**
 * @param {object} doc
 * @param  {(string|unknown)[]} args
 * @returns {object}
 */
export function updateSourceFlag(doc: object, ...args: (string | unknown)[]): object;
/**
 * @param {object} updates
 * @param  {(string|unknown)[]} args
 */
export function moduleFlagUpdate(updates: object, ...args: (string | unknown)[]): void;
