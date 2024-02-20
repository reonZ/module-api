/**
 *
 * @param {object} options
 * @param {HTMLElement} options.target
 * @param {HTMLElement} options.selected
 * @param {"DOWN"|"UP"|"LEFT"|"RIGHT"} [options.direction]
 * @param {(tooltip: HTMLElement) => void} [options.onCreate]
 * @param {() => void} options.onDismiss
 * @param {(value: string) => void} options.onClick
 * @param {HTMLElement|string} options.content
 * @param {string[]} [options.cssClass]
 * @param {boolean} [options.locked]
 * @returns {Promise<HTMLElement>}
 */
export function createTooltip({ target, selected, direction, onCreate, onDismiss, onClick, content, cssClass, locked, }: {
    target: HTMLElement;
    selected: HTMLElement;
    direction?: "DOWN" | "UP" | "LEFT" | "RIGHT";
    onCreate?: (tooltip: HTMLElement) => void;
    onDismiss: () => void;
    onClick: (value: string) => void;
    content: HTMLElement | string;
    cssClass?: string[];
    locked?: boolean;
}): Promise<HTMLElement>;
export function dismissTooltip(el: any): void;
