import * as R from "remeda";

/**
 * @param {HTMLElement} parent
 * @param {string} selectors
 * @returns {HTMLElement|null}
 */
export function htmlQuery(parent, selectors) {
	if (!(parent instanceof Element || parent instanceof Document)) return null;
	return parent.querySelector(selectors);
}

/**
 * @param {HTMLElement} parent
 * @param {string} selectors
 * @returns {NodeListOf<HTMLElement>}
 */
export function htmlQueryAll(parent, selectors) {
	if (!(parent instanceof Element || parent instanceof Document)) return [];
	return Array.from(parent.querySelectorAll(selectors));
}

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
export function createHTMLElement(
	nodeName,
	{ classes = [], dataset = {}, children = [], innerHTML } = {},
) {
	const element = document.createElement(nodeName);
	if (classes.length > 0) element.classList.add(...classes);

	for (const [key, value] of Object.entries(dataset).filter(
		([, v]) => !R.isNil(v) && v !== false,
	)) {
		element.dataset[key] = value === true ? "" : String(value);
	}

	if (innerHTML) {
		element.innerHTML = innerHTML;
	} else {
		for (const child of children) {
			const childElement =
				child instanceof HTMLElement ? child : new Text(child);
			element.appendChild(childElement);
		}
	}

	return element;
}

/**
 * @param {HTMLElement} child
 * @param {string} selectors
 * @returns {HTMLElement|null}
 */
export function htmlClosest(child, selectors) {
	if (!(child instanceof Element)) return null;
	return child.closest(selectors);
}
