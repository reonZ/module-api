/**
 * @param {HTMLElement} el
 * @returns {number | undefined}
 */
export function getElementIndex(el) {
	return Array.from(el.parentElement.children).indexOf(el);
}
