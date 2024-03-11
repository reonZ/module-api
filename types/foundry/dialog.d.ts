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
export function waitDialog<T>(options: {
    title: string;
    template: string;
    yes: {
        label: string;
        icon?: string;
        callback: (html: HTMLElement | JQuery) => T;
    };
    no: string;
    data?: object;
    id?: string;
}): Promise<T>;
/**
 * @param {object} options
 * @param {string} options.title
 * @param {string} options.template
 * @param {boolean} [options.defaultYes]
 * @param {object} [options.data]
 * @param {string} [options.id]
 * @returns {Promise<boolean>}
 */
export function confirmDialog(options: {
    title: string;
    template: string;
    defaultYes?: boolean;
    data?: object;
    id?: string;
}): Promise<boolean>;
