/**
 * @generator
 * @template T
 * @param {number} nb
 * @param {T} [fromMessage]
 * @returns {{message: T, html: JQuery}}
 */
export function latestChatMessages<T>(nb: number, fromMessage?: T): {
    message: T;
    html: JQuery;
};
/**
 * @param {string} uuid
 * @param {string} [label]
 * @returns {string}
 */
export function chatUUID(uuid: string, label?: string): string;
/**
 * @param {object} message
 * @returns {string}
 */
export function hasEmbeddedSpell(message: object): string;
