/**
 * @param {Event} event
 * @param {string} rollType
 * @returns {skipDialog: boolean, rollMode?: string}
 */
export function eventToRollParams(event: Event, rollType: string): skipDialog;
/**
 * @param {Event} event
 * @returns {string}
 */
export function eventToRollMode(event: Event): string;
