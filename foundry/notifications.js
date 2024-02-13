import { localize } from "./localize";

/**
 * @param {string} str
 * @param {"warning" | "info" | "error" | object | boolean} [arg1]
 * @param {object | boolean} [arg2]
 * @param {boolean} [arg3]
 */
function notify(str, arg1, arg2, arg3) {
	const type = typeof arg1 === "string" ? arg1 : "info";
	const data =
		typeof arg1 === "object"
			? arg1
			: typeof arg2 === "object"
			  ? arg2
			  : undefined;
	const permanent =
		typeof arg1 === "boolean"
			? arg1
			: typeof arg2 === "boolean"
			  ? arg2
			  : arg3 ?? false;

	ui.notifications.notify(localize(str, data), type, { permanent });
}

/**
 * @typedef { (str: string, arg1?: object | boolean, arg2?: boolean) => void } Notify
 */

/**
 * @type {Notify}
 */
export function warn(str, arg1, arg2) {
	notify(str, "warning", arg1, arg2);
}

/**
 * @type {Notify}
 */
export function info(str, arg1, arg2) {
	notify(str, "info", arg1, arg2);
}

/**
 * @type {Notify}
 */
export function error(str, arg1, arg2) {
	notify(str, "error", arg1, arg2);
}
