/**
 * @param {HTMLElement|jQuery} el
 * @returns {HTMLElement}
 */
export function htmlElement(el) {
	return el instanceof jQuery ? el[0] : el;
}

/**
 * @param {string} content
 * @returns {Element|HTMLCollection}
 */
export function createHTMLFromString(content) {
	const tmp = document.createElement("div");
	tmp.innerHTML = content;

	const children = tmp.children;
	return children.length > 1 ? children : children[0];
}

/**
 * @param {HTMLElement} parent
 * @param {string} content
 * @returns {Element|HTMLCollection}
 */
function insertHTMLFromString(parent, content, prepend = false) {
	const children = createHTMLFromString(content);
	applyHtmlMethod(prepend ? parent.prepend : parent.append, children, parent);
	return children;
}

function applyHtmlMethod(fn, children, context) {
	const fnc = context ? fn.bind(context) : fn;

	if (Array.isArray(children)) {
		for (const child of children) {
			fnc(child);
		}
	} else {
		fnc(children);
	}
}

/**
 * @param {HTMLElement} oldElement
 * @param {string} content
 */
export function replaceHTMLFromString(oldElement, content) {
	const children = createHTMLFromString(content);
	applyHtmlMethod(oldElement.replaceWith, children, oldElement);
}

/**
 * @param {HTMLElement} parent
 * @param {string} content
 * @returns {Element | HTMLCollection}
 */
export function appendHTMLFromString(parent, content) {
	return insertHTMLFromString(parent, content, false);
}

/**
 * @param {HTMLElement} parent
 * @param {string} content
 * @returns {Element | HTMLCollection}
 */
export function prependHTMLFromString(parent, content) {
	return insertHTMLFromString(parent, content, true);
}

/**
 * @param {HTMLElement} element
 * @param {string} content
 * @returns {Element | HTMLCollection}
 */
export function afterHTMLFromString(element, content) {
	const children = createHTMLFromString(content);
	applyHtmlMethod(element.after, children, element);
	return children;
}

/**
 * @param {HTMLElement} element
 * @param {string} content
 * @returns {Element | HTMLCollection}
 */
export function beforeHTMLFromString(element, content) {
	const children = createHTMLFromString(content);
	applyHtmlMethod(element.before, children, element);
	return children;
}

/**
 * @param {HTMLElement} parent
 * @param {string} selector
 * @param {string} event
 * @param {(event: MouseEvent, element: HTMLElement) => void} listener
 * @param {boolean} [all]
 * @returns {HTMLElement|HTMLElement[]}
 */
export function addListener(parent, selector, event, listener, all = false) {
	const elements = all
		? parent.querySelectorAll(selector)
		: [parent.querySelector(selector)].filter(Boolean);

	for (const element of elements) {
		element.addEventListener(event, (e) => listener(e, element));
	}

	return all ? elements : elements[0];
}
