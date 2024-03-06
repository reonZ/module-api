import { joinStr } from "../utils";
import { MODULE } from "./module";

/**
 * @param  {string[]} path
 * @returns {string}
 */
export function templatePath(...path) {
	return `modules/${MODULE.id}/templates/${joinStr("/", path)}.hbs`;
}
