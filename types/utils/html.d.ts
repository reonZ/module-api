/**
 * @param {HTMLElement|JQuery} el
 * @returns {HTMLElement}
 */
export function htmlElement(el: HTMLElement | JQuery): HTMLElement;
/**
 * @param {string} content
 * @returns {Element|HTMLCollection}
 */
export function createHTMLFromString(content: string): Element | HTMLCollection;
/**
 * @param {HTMLElement} oldElement
 * @param {string} content
 */
export function replaceHTMLFromString(oldElement: HTMLElement, content: string): void;
/**
 * @param {HTMLElement} parent
 * @param {string} content
 * @returns {Element | HTMLCollection}
 */
export function appendHTMLFromString(parent: HTMLElement, content: string): Element | HTMLCollection;
/**
 * @param {HTMLElement} parent
 * @param {string} content
 * @returns {Element | HTMLCollection}
 */
export function prependHTMLFromString(parent: HTMLElement, content: string): Element | HTMLCollection;
/**
 * @param {HTMLElement} element
 * @param {string} content
 * @returns {Element | HTMLCollection}
 */
export function afterHTMLFromString(element: HTMLElement, content: string): Element | HTMLCollection;
/**
 * @param {HTMLElement} element
 * @param {string} content
 * @returns {Element | HTMLCollection}
 */
export function beforeHTMLFromString(element: HTMLElement, content: string): Element | HTMLCollection;
/**
 * @param {HTMLElement} parent
 * @param {string} selector
 * @param {string} event
 * @param {(event: MouseEvent, element: HTMLElement) => void} listener
 * @param {boolean} [all]
 * @returns {HTMLElement|HTMLElement[]}
 */
export function addListener(parent: HTMLElement, selector: string, event: string, listener: (event: MouseEvent, element: HTMLElement) => void, all?: boolean): HTMLElement | HTMLElement[];
