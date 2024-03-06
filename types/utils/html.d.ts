/**
 * @param {HTMLElement|jQuery} el
 * @returns {HTMLElement}
 */
export function element(el: HTMLElement | jQuery): HTMLElement;
export function createHTML(content: any): Element | HTMLCollection;
/**
 * @param {HTMLElement} oldElement
 * @param {Node|string} content
 */
export function replaceHTML(oldElement: HTMLElement, content: Node | string): void;
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
