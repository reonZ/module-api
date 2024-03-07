import { joinStr } from "../utils";

/**
 * @type {string}
 */
let MODULE_ID = null;

export const MODULE = {
	get id() {
		if (!MODULE_ID) {
			throw new Error("Module id needs to be registered.");
		}
		return MODULE_ID;
	},
	get name() {
		return "Settings Manager";
	},
	/**
	 * @param {string} str
	 */
	error(str) {
		throw new Error(`\n[${this.name}] ${str}`);
	},
	/**
	 * @param {string} id
	 */
	register(id) {
		if (MODULE_ID) {
			this.error("Module id was already registered.");
		}
		MODULE_ID = id;
	},
	/**
	 * @param {string} str
	 */
	log(str) {
		console.log(`[${this.name}] ${str}`);
	},
	/**
	 * @param  {(string|string[])[]} path
	 * @returns {string}
	 */
	path(...path) {
		return `${this.id}.${joinStr(".", ...path)}`;
	},
};
