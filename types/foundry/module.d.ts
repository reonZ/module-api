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
export namespace MODULE {
    const id: string;
    /**
     * @param {string} str
     */
    function error(str: string): never;
}
