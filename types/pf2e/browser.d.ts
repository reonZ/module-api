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
 * @param {TabName} tabOrName
 * @param {object|true} [data]
 * @returns {Promise<void>}
 */
export function openBrowserTab(tabOrName: TabName, data?: object | true): Promise<void>;
export function getEquipmentTabData({ collapsed, mergeWith }?: {
    collapsed?: boolean;
    mergeWith: any;
}): any;
export type TabName = "equipment";
export type TabOrTabName = TabName | Record<string, unknown>;
