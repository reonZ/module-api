import { createHTMLElement, htmlClosest } from "./html";
import { ErrorPF2e, localizer, setHasElement, sluggify } from "./misc";
import { eventToRollMode } from "./scripts";

export const HANDWRAPS_SLUG = "handwraps-of-mighty-blows";

/**
 * @param {object} item
 * @returns {boolean}
 */
export function canBeInvested(item) {
	return item.traits.has("invested");
}

/**
 * @param {object} item
 * @returns {boolean}
 */
export function hasWornSlot(item) {
	return item.system.equipped.inSlot != null;
}

/**
 * @param {object} item
 * @returns {boolean}
 */
function isWornAs(item) {
	return item.system.usage.type === "worn" && item.system.equipped.inSlot;
}

/**
 * @param {object} item
 * @returns {boolean}
 */
export function isInvestedOrWornAs(item) {
	return item.isInvested || isWornAs(item);
}

/**
 * @param {object} item
 * @returns {boolean}
 */
export function isHeld(item) {
	return item.system.usage.type === "held";
}

/**
 * @param {object} item
 * @returns {boolean}
 */
export function isTwoHanded(item) {
	return isHeld(item) && item.system.usage.value === "held-in-two-hands";
}

/**
 * @param {object} item
 * @returns {boolean}
 */
export function isOneHanded(item) {
	return isHeld(item) && item.system.usage.value === "held-in-one-hand";
}

/**
 * @tempate T
 * @param {object} item
 * @param {T} value
 * @returns {T|undefined}
 */
function inSlotValue(item, value) {
	const usage = item.system.usage;
	return usage.type === "worn" && usage.where ? value : undefined;
}

/**
 * @param {object} item
 * @param {boolean} [invest]
 * @returns {boolean|undefined}
 */
function toggleInvestedValue(item, invest) {
	const value = invest ?? !item.system.equipped.invested;
	return item.traits.has("invested") ? value : undefined;
}

/**
 * @param {object} item
 * @param {object} options
 * @param {string} [options.carryType]
 * @param {number} [options.handsHeld]
 * @param {boolean} [options.inSlot]
 * @param {boolean} [options.invested]
 * @param {string|null} [options.containerId]
 * @returns {object}
 */
export function itemCarryUpdate(
	item,
	{ carryType = "worn", handsHeld = 0, inSlot, invested, containerId },
) {
	const update = {
		_id: item.id,
		system: {
			equipped: {
				carryType: carryType,
				handsHeld: handsHeld,
				inSlot: inSlotValue(item, inSlot),
				invested: toggleInvestedValue(item, invested),
			},
		},
	};

	if (containerId !== undefined) {
		update.system.containerId = containerId;
	}

	return update;
}

/**
 * @param {object} item
 * @returns {boolean}
 */
export function isHandwrapsOfMightyBlows(item) {
	return (
		item.isOfType("weapon") &&
		item.slug === HANDWRAPS_SLUG &&
		item.category === "unarmed"
	);
}

/**
 * @param {Item} item
 * @param {number} [quantity]
 * @returns {Coins}
 */
export function calculateItemPrice(item, quantity = 1, ratio = 1) {
	const coins = game.pf2e.Coins.fromPrice(item.price, quantity);
	if (ratio === 1) return coins;
	return coins.scale(ratio);
}

/**
 * @param {Actor} target
 * @param {Item} item
 * @param {number} quantity
 * @param {string} [containerId]
 * @param {boolean} [newStack]
 * @returns {Promise<Item>}
 */
export async function transferItemToActor(
	target,
	item,
	quantity,
	containerId,
	newStack,
) {
	const itemQuantity = Math.min(quantity, item.quantity);
	const newQuantity = item.quantity - itemQuantity;

	if (newQuantity < 1) {
		await item.delete();
	} else {
		await item.update({ "system.quantity": newQuantity });
	}

	const newItemData = item.toObject();
	newItemData.system.quantity = itemQuantity;
	newItemData.system.equipped.carryType = "worn";
	if ("invested" in newItemData.system.equipped) {
		newItemData.system.equipped.invested = item.traits.has("invested")
			? false
			: null;
	}

	return target.addToInventory(newItemData, containerId, newStack);
}

export class MoveLootPopup extends FormApplication {
	/**
	 * @param {Actor} object
	 * @param {object} options
	 * @param {{default: number, max: number}} options.quantity
	 * @param {boolean} options.newStack
	 * @param {boolean} options.lockStack
	 * @param {boolean} options.isPurchase
	 * @param {(quantity: number, newStack: boolean) => void} callback
	 */
	constructor(object, options, callback) {
		super(object, options);
		this.onSubmitCallback = callback;
	}

	async getData() {
		const [prompt, buttonLabel] = this.options.isPurchase
			? ["PF2E.loot.PurchaseLootMessage", "PF2E.loot.PurchaseLoot"]
			: ["PF2E.loot.MoveLootMessage", "PF2E.loot.MoveLoot"];

		return {
			...(await super.getData()),
			quantity: {
				default: this.options.quantity.default,
				max: this.options.quantity.max,
			},
			newStack: this.options.newStack,
			lockStack: this.options.lockStack,
			prompt,
			buttonLabel,
		};
	}

	static get defaultOptions() {
		return {
			...FormApplication.defaultOptions,
			id: "MoveLootPopup",
			classes: [],
			title: game.i18n.localize("PF2E.loot.MoveLootPopupTitle"),
			template: "systems/pf2e/templates/popups/loot/move-loot-popup.hbs",
			width: "auto",
			quantity: {
				default: 1,
				max: 1,
			},
			newStack: false,
			lockStack: false,
			isPurchase: false,
		};
	}

	async _updateObject(_event, formData) {
		this.onSubmitCallback(formData.quantity, formData.newStack);
	}
}

export async function detachSubitem(subitem, skipConfirm) {
	const parentItem = subitem.parentItem;
	if (!parentItem) throw ErrorPF2e("Subitem has no parent item");

	const localize = localizer("PF2E.Item.Physical.Attach.Detach");
	const confirmed =
		skipConfirm ||
		(await Dialog.confirm({
			title: localize("Label"),
			content: createHTMLElement("p", {
				children: [localize("Prompt", { attachable: subitem.name })],
			}).outerHTML,
		}));
	if (!confirmed) return;

	const deletePromise = subitem.delete();
	const createPromise = (async () => {
		// Find a stack match, cloning the subitem as worn so the search won't fail due to it being equipped
		const stack = subitem.isOfType("consumable")
			? parentItem.actor?.inventory.findStackableItem(
					subitem.clone({ "system.equipped.carryType": "worn" }),
			  )
			: null;
		const keepId =
			!!parentItem.actor && !parentItem.actor.items.has(subitem.id);
		return (
			stack?.update({ "system.quantity": stack.quantity + 1 }) ??
			Item.implementation.create(
				mergeObject(subitem.toObject(), {
					"system.containerId": parentItem.system.containerId,
				}),
				{ parent: parentItem.actor, keepId },
			)
		);
	})();

	await Promise.all([deletePromise, createPromise]);
}

export async function unownedItemToMessage(event, item, actor, options = {}) {
	const ChatMessagePF2e = ChatMessage.implementation;

	// Basic template rendering data
	const type = sluggify(item.type);
	const template = `systems/pf2e/templates/chat/${type}-card.hbs`;
	const token = actor.token;
	const nearestItem = htmlClosest(event?.target, ".item");
	const rollOptions = options.data ?? { ...(nearestItem?.dataset ?? {}) };
	const templateData = {
		actor: actor,
		tokenId: token ? `${token.parent?.id}.${token.id}` : null,
		item: item,
		data: await item.getChatData(undefined, rollOptions),
	};

	// Basic chat message data
	const originalEvent =
		event instanceof MouseEvent ? event : event?.originalEvent;
	const rollMode = options.rollMode ?? eventToRollMode(originalEvent);
	const chatData = ChatMessagePF2e.applyRollMode(
		{
			type: CONST.CHAT_MESSAGE_TYPES.OTHER,
			speaker: ChatMessagePF2e.getSpeaker({
				actor: this.actor,
				token: this.actor.getActiveTokens(false, true).at(0),
			}),
			content: await renderTemplate(template, templateData),
			flags: { pf2e: { origin: this.getOriginData() } },
		},
		rollMode,
	);

	// Create the chat message
	return options.create ?? true
		? ChatMessagePF2e.create(chatData, { rollMode, renderSheet: false })
		: new ChatMessagePF2e(chatData, { rollMode });
}

/**
 * @param {ItemOrSource} item
 * @param  {...any: string[]} types
 * @returns {boolean}
 */
export function itemIsOfType(item, ...types) {
	return (
		typeof item.name === "string" &&
		types.some((t) =>
			t === "physical"
				? setHasElement(PHYSICAL_ITEM_TYPES, item.type)
				: item.type === t,
		)
	);
}
