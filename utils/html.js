/**
 * @param {HTMLElement|jQuery} el
 * @returns {HTMLElement}
 */
export function element(el) {
	return el instanceof jQuery ? el[0] : el;
}

/**
 * @template {Node} T
 * @param {HTMLElement} parent
 * @param {T|string} content
 * @returns {T}
 */
function insertHTML(parent, content, prepend = false) {
	if (!content) return;

	const inserMethod = prepend
		? parent.prepend.bind(parent)
		: parent.append.bind(parent);

	if (content instanceof Node) {
		return inserMethod(content);
	}

	const tmp = document.createElement("div");
	tmp.innerHTML = content;

	const children = tmp.children;

	for (const child of children) {
		inserMethod(child);
	}

	return children.length > 1 ? children : children[0];
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
