/**
 * @typedef {"equipment"} TabName
 * @typedef {TabName | Record<string, unknown>} TabOrTabName
 */
/**
 * @param {TabOrTabName} tabOrName
 * @returns {Promise<object[]>}
 */
export function getTabResults(tabOrName: TabOrTabName): Promise<object[]>;
/**
 * @returns {object}
 */
export function getBrowser(): object;
/**
 * @param {TabName} tabName
 * @returns {object}
 */
export function getBrowserTab(tabName: TabName): object;
/**
 * @param {string[]} list
 * @param {string} uuid
 * @returns boolean
 */
export function includesBrowserUUID(list: string[], uuid: string): boolean;
/**
 * @param {TabName} tabOrName
 * @param {object|false} [data]
 * @returns {Promise<void>}
 */
export function openBrowserTab(tabOrName: TabName, data?: object | false): Promise<void>;
export function getEquipmentTabData({ collapsed, mergeWith }?: {
    collapsed?: boolean;
    mergeWith: any;
}): any;
export type TabName = "equipment";
export type TabOrTabName = TabName | Record<string, unknown>;
