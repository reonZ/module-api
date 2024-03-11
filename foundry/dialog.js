import { render } from "./app";

/**
 * @template T
 * @param {object} options
 * @param {string} options.title
 * @param {string} options.template
 * @param {object} options.yes
 * @param {string} options.yes.label
 * @param {string} [options.yes.icon]
 * @param {(html: HTMLElement|JQuery) => T} options.yes.callback
 * @param {string} options.no
 * @param {object} [options.data]
 * @param {string} [options.id]
 * @returns {Promise<T|null>}
 */
export async function waitDialog(options) {
	const yesIcon = options.yes.icon ?? "fa-solid fa-check";

	const buttons = {
		yes: {
			icon: `<i class='${yesIcon}'></i>`,
			label: options.yes.label,
			callback: options.yes.callback,
		},
		no: {
			icon: "<i class='fa-solid fa-xmark'></i>",
			label: options.no,
			callback: () => null,
		},
	};

	const content = await render(options.template, options.data);

	return Dialog.wait(
		{
			title: options.title,
			content,
			buttons,
			close: () => null,
		},
		{
			id: options.id,
		},
	);
}

/**
 * @param {object} options
 * @param {string} options.title
 * @param {string} options.template
 * @param {boolean} [options.defaultYes]
 * @param {object} [options.data]
 * @param {string} [options.id]
 * @returns {Promise<boolean>}
 */
export async function confirmDialog(options) {
	const content = await render(options.template, options.data);

	return Dialog.confirm({
		title: options.title,
		content,
		defaultYes: options.defaultYes ?? false,
		options: {
			id: options.id,
		},
	});
}
