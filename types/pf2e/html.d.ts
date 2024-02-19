/**
 * @param {HTMLElement} parent
 * @param {string} selectors
 * @returns {HTMLElement|null}
 */
export function htmlQuery(parent: HTMLElement, selectors: string): HTMLElement | null;
/**
 * @param {HTMLElement} parent
 * @param {string} selectors
 * @returns {NodeListOf<HTMLElement>}
 */
export function htmlQueryAll(parent: HTMLElement, selectors: string): NodeListOf<HTMLElement>;
/**
 * @param {string} nodeName
 * @param {{
 *   classes?: string[];
 *   dataset?: Record<string, string | number | boolean | null | undefined>;
 *   children?: (HTMLElement | string)[];
 *   innerHTML?: string;
 * }}
 * @returns {HTMLElement}
 */
export function createHTMLElement(nodeName: string, { classes, dataset, children, innerHTML }?: {
    classes?: string[];
    dataset?: Record<string, string | number | boolean | null | undefined>;
    children?: (HTMLElement | string)[];
    innerHTML?: string;
}): HTMLElement;
/**
 * @param {HTMLElement} child
 * @param {string} selectors
 * @returns {HTMLElement|null}
 */
export function htmlClosest(child: HTMLElement, selectors: string): HTMLElement | null;
