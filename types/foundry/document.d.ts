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
 * @param  {(string|unknown)[]} args
 * @returns {unknown}
 */
export function getInMemoryAndSetIfNot(doc: object, ...args: (string | unknown)[]): unknown;
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
/** *
 * @param {foundry.Document} doc
 * @returns {string|undefined}
 */
export function getSourceId(doc: foundry.Document): string | undefined;
/**
 * @param {foundry.Document} doc
 * @param {string|} list
 * @returns {boolean}
 */
export function includesSourceId(doc: foundry.Document, list: string | any): boolean;
/**
 * @param {string|string[]} sourceId
 * @returns {(item: object) => boolean}
 */
export function getSourceIdCondition(sourceId: string | string[]): (item: object) => boolean;
