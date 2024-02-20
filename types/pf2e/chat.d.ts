/**
 * @typedef {(message: object, tokens: object[], rollIndex: number) => void} OnDamageApplied
 *
 * @param {object} options
 * @param {object} options.message
 * @param {number} options.multiplier
 * @param {number} options.addend
 * @param {boolean} options.promptModifier
 * @param {number} options.rollIndex
 * @param {object[]} [options.tokens]
 * @param {OnDamageApplied} [options.onDamageApplied]
 */
export function applyDamageFromMessage({ message, multiplier, addend, promptModifier, rollIndex, tokens, onDamageApplied, }: {
    message: object;
    multiplier: number;
    addend: number;
    promptModifier: boolean;
    rollIndex: number;
    tokens?: object[];
    onDamageApplied?: OnDamageApplied;
}): Promise<void>;
/**
 * @param {object} target
 * @param {HTMLElement} shieldButton
 * @param {HTMLElement} messageEl
 */
export function onClickShieldBlock(target: object, shieldButton: HTMLElement, messageEl: HTMLElement): void;
/**
 * adapted to toggle multiple buttons
 * @param {string} messageId
 */
export function toggleOffShieldBlock(messageId: string): void;
/**
 * @param {Item} item
 * @param {string} rollMode
 * @returns {ChatMessage}
 */
export function createSelfEffectMessage(item: Item, rollMode?: string): ChatMessage;
/**
 * @param {string} subtitle
 * @returns {Promise<string>}
 */
export function createManipulateFlavor(subtitle: string): Promise<string>;
/**
 * @param {string} message
 * @param {string} img
 * @returns {Promise<string>}
 */
export function createTradeContent(message: string, img: string): Promise<string>;
/**
 * @param {foundry.Document|string} docOrUuid
 * @param {object} [options]
 * @param {boolean} [options.async]
 * @param {string} [options.label]
 * @returns {Promise<string>}
 */
export function createFancyLink(docOrUuid: foundry.Document | string, { async, label }?: {
    async?: boolean;
    label?: string;
}): Promise<string>;
/**
 *
 * @param {string} subtitle
 * @param {string} content
 * @param {Actor} actor
 * @param {string} [senderId]
 * @returns {Promise<ChatMessage>}
 */
export function createManipulationMessage(subtitle: string, content: string, actor: Actor, senderId?: string): Promise<ChatMessage>;
/**
 *
 * @param {string} subtitle
 * @param {string} message
 * @param {Actor} actor
 * @param {Item} item
 * @param {string} [senderId]
 * @returns {Promise<ChatMessage>}
 */
export function createTradeMessage(subtitle: string, message: string, actor: Actor, item: Item, senderId?: string): Promise<ChatMessage>;
export type OnDamageApplied = (message: object, tokens: object[], rollIndex: number) => void;
