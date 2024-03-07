import { joinStr } from "../utils";
import { MODULE } from "./module";

/**
 * @param  {string[]} path
 * @returns {string}
 */
export function templatePath(...path) {
	return `modules/${MODULE.id}/templates/${joinStr("/", path)}.hbs`;
}

/**
 * @param  {(string|object)[]} args
 * @returns {Promise<string>}
 */
export function render(...args) {
	const data = typeof args.at(-1) === "object" ? args.splice(-1)[0] : {};
	const path = templatePath(...args);
	return renderTemplate(path, data);
}
