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
/**
 * @param {object} options
 * @param {FoundryDocument} options.doc
 * @param {Record<string, unknown>} [options.updates]
 * @returns {Promise<void>}
 */
export function updateDocument({ doc, updates, message }: {
    doc: FoundryDocument;
    updates?: Record<string, unknown>;
}, userId: any): Promise<void>;
