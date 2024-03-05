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
	/**
	 * @param {string} id
	 */
	register(id) {
		if (MODULE_ID) {
			this.error("Module id was already registered.");
		}
		MODULE_ID = id;
	},
	log(str) {
		console.log(`[${this.id}] ${str}`);
	},
};
