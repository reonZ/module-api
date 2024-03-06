export namespace MODULE {
    const id: string;
    /**
     * @param {string} str
     */
    function error(str: string): never;
    /**
     * @param {string} id
     */
    function register(id: string): void;
    /**
     * @param {string} str
     */
    function log(str: string): void;
    /**
     * @param  {(string|string[])[]} path
     * @returns {string}
     */
    function path(...path: (string | string[])[]): string;
}
