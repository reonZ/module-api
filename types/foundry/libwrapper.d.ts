/**
 * @param {string} path
 * @param {(...args: unknown[]) => unknown} callback
 * @param {"WRAPPER" | "OVERRIDE" | "MIXED"} type
 * @returns {string}
 */
export function registerWrapper(path: string, callback: (...args: unknown[]) => unknown, type?: "WRAPPER" | "OVERRIDE" | "MIXED"): string;
/**
 * @param {string} id
 */
export function unregisterWrapper(id: string): void;
