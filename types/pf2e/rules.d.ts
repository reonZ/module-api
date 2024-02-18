/**
 * @param {object} options
 * @param {string} options.affects
 * @param {object} options.origin
 * @param {object} options.target
 * @param {object} options.item
 * @param {string[]} options.domains
 * @param {string[]} options.options
 * @returns {Promise<object[]>}
 */
export function extractEphemeralEffects({ affects, origin, target, item, domains, options, }: {
    affects: string;
    origin: object;
    target: object;
    item: object;
    domains: string[];
    options: string[];
}): Promise<object[]>;
/**
 * @param {object} rollNotes
 * @param {string[]} selectors
 * @returns {object[]}
 */
export function extractNotes(rollNotes: object, selectors: string[]): object[];
/**
 *
 * @param {object} deferredDice
 * @param {string[]} selectors
 * @param {object} options
 * @returns {object[]}
 */
export function extractDamageDice(synthetics: any, options: object): object[];
/**
 * @param {object} synthetics
 * @param {string[]} selectors
 * @param {object} options
 * @returns {object[]}
 */
export function extractModifiers(synthetics: object, selectors: string[], options?: object): object[];
