export * from "./actor";
export * from "./application";
export * from "./chat";
export * from "./document";
export * from "./flags";
export * from "./handlebars";
export * from "./hooks";
export * from "./item";
export * from "./libwrapper";
export * from "./localize";
export * from "./notifications";
export * from "./settings";
export * from "./socket";
export * from "./user";

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
	/**
	 * @param {string} str
	 */
	error(str) {
		throw new Error(`[${this.id}] ${str}`);
	},
};

/**
 * register the module id
 * @param {string} id
 */
export function registerModule(id) {
	MODULE_ID = id;
}

/**
 * @param {string} [id]
 * @returns {object}
 */
export function getModule(id) {
	return game.modules.get(id ?? MODULE.id);
}
