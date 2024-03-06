/**
 * @param {HTMLElement|jQuery} el
 * @returns {HTMLElement}
 */
export function element(el) {
	return el instanceof jQuery ? el[0] : el;
}

export function createHTML(content) {
	if (!content) return;

	const tmp = document.createElement("div");
	tmp.innerHTML = content;

	const children = tmp.children;
	return children.length > 1 ? children : children[0];
}

/**
 * @param {HTMLElement} parent
 * @param {Node|string} content
 * @returns {Node}
 */
function insertHTML(parent, content, prepend = false) {
	if (!content) return;

	const inserMethod = prepend
		? parent.prepend.bind(parent)
		: parent.append.bind(parent);

	if (content instanceof Node) {
		return inserMethod(content);
	}

	const children = createHTML(content);
	applyHtmlMethod(inserMethod, children);

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
 * @param {Node|string} content
 */
export function replaceHTML(oldElement, content) {
	if (!content) return;

	if (content instanceof Node) {
		return oldElement.replaceWith(content);
	}

	const children = createHTML(content);
	applyHtmlMethod(oldElement.replaceWith, children, oldElement);
}

/**
 * @template {Node} T
 * @param {HTMLElement} parent
 * @param {T|string} content
 * @returns {T}
 */
export function appendHTML(parent, content) {
	insertHTML(parent, content, false);
}

/**
 * @template {Node} T
 * @param {HTMLElement} parent
 * @param {T|string} content
 * @returns {T}
 */
export function prependHTML(parent, content) {
	insertHTML(parent, content, true);
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
