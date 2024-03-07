/**
 * @param  {string[]} path
 * @returns {string}
 */
export function templatePath(...path: string[]): string;
/**
 * @param  {(string|object)[]} args
 * @returns {Promise<string>}
 */
export function render(...args: (string | object)[]): Promise<string>;
