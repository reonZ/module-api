/**
 * @param {object} options
 * @param {string} options.title
 * @param {string} options.template
 * @param {object} options.yes
 * @param {string} options.yes.label
 * @param {string} [options.yes.icon]
 * @param {(html: jQuery|HTMLElement) => unknown} [options.yes.callback]
 * @param {string} options.no
 * @param {object} [options.data]
 * @param {string} [options.id]
 * @returns {Promise<unknown>}
 */
export function waitDialog(options: {
    title: string;
    template: string;
    yes: {
        label: string;
        icon?: string;
        callback?: (html: jQuery | HTMLElement) => unknown;
    };
    no: string;
    data?: object;
    id?: string;
}): Promise<unknown>;
/**
 * @param {object} options
 * @param {string} options.title
 * @param {string} options.template
 * @param {boolean} [options.defaultYes]
 * @param {object} [options.data]
 * @param {string} [options.id]
 * @returns {Promise<unknown>}
 */
export function confirmDialog(options: {
    title: string;
    template: string;
    defaultYes?: boolean;
    data?: object;
    id?: string;
}): Promise<unknown>;
