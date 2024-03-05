import { joinStr } from "../utils";
import { MODULE } from "./module";

/**
 * @param {(string | object)[]} args
 * @returns {string}
 */
export function localize(...args) {
	args.unshift(MODULE.id);
	const data = typeof args.at(-1) === "object" ? args.splice(-1)[0] : undefined;
	return game.i18n[data ? "format" : "localize"](joinStr(".", args), data);
}
