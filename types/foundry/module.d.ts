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
    function log(str: any): void;
}
