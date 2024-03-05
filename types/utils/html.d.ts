/**
 * @param {HTMLElement|jQuery} el
 * @returns {HTMLElement}
 */
export function element(el: HTMLElement | jQuery): HTMLElement;
/**
 * @template {Node} T
 * @param {HTMLElement} parent
 * @param {T|string} content
 * @returns {T}
 */
export function appendHTML<T extends Node>(parent: HTMLElement, content: string | T): T;
/**
 * @template {Node} T
 * @param {HTMLElement} parent
 * @param {T|string} content
 * @returns {T}
 */
export function prependHTML<T extends Node>(parent: HTMLElement, content: string | T): T;
