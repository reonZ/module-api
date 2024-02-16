/**
 * register the module id
 * @param {string} id
 */
export function registerModule(id: string): void;
/**
 * @param {string} [id]
 * @returns {object}
 */
export function getModule(id?: string): object;
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
export * from "./misc";
export * from "./notifications";
export * from "./settings";
export * from "./socket";
export * from "./user";
export namespace MODULE {
    const id: string;
    /**
     * @param {string} str
     */
    function error(str: string): never;
}
