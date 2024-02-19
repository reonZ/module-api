import { getHighestName } from "../foundry";
import { isInstanceOf } from "../utils";
import { applyStackingRules } from "./actor";
import { htmlQuery } from "./html";
import { ErrorPF2e, getActionGlyph, signedInteger } from "./misc";
import {
	extractDamageDice,
	extractEphemeralEffects,
	extractModifiers,
} from "./rules";
import { traitSlugToObject } from "./tags";

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
export async function applyDamageFromMessage({
	message,
	multiplier = 1,
	addend = 0,
	promptModifier = false,
	rollIndex = 0,
	// added
	tokens,
	onDamageApplied,
}) {
	if (promptModifier) {
		return shiftAdjustDamage({
			message,
			multiplier,
			rollIndex,
			// added
			tokens,
			onDamageApplied,
		});
	}

	// changed
	tokens ??= (() => {
		const html = htmlQuery(
			ui.chat.element[0],
			`li.chat-message[data-message-id="${message.id}"]`,
		);
		return html?.dataset.actorIsTarget && message.token
			? [message.token]
			: game.user.getActiveTokens();
	})();
	if (tokens.length === 0) {
		ui.notifications.error("PF2E.ErrorMessage.NoTokenSelected", {
			localize: true,
		});
		return;
	}

	const shieldBlockRequest = CONFIG.PF2E.chatDamageButtonShieldToggle;
	const roll = message.rolls.at(rollIndex);
	if (!isInstanceOf(roll, "DamageRoll"))
		throw ErrorPF2e("Unexpected error retrieving damage roll");

	let damage =
		multiplier < 0
			? multiplier * roll.total + addend
			: roll.alter(multiplier, addend);

	// Get origin roll options and apply damage to a contextual clone: this may influence condition IWR, for example
	const messageRollOptions = [...(message.flags.pf2e.context?.options ?? [])];
	const originRollOptions = messageRollOptions
		.filter((o) => o.startsWith("self:"))
		.map((o) => o.replace(/^self/, "origin"));
	const messageItem = message.item;
	const effectRollOptions = messageItem?.isOfType(
		"affliction",
		"condition",
		"effect",
	)
		? messageItem.getRollOptions("item")
		: [];

	for (const token of tokens) {
		if (!token.actor) continue;

		// If no target was acquired during a roll, set roll options for it during damage application
		if (!messageRollOptions.some((o) => o.startsWith("target"))) {
			messageRollOptions.push(...token.actor.getSelfRollOptions("target"));
		}
		const domain = multiplier > 0 ? "damage-received" : "healing-received";
		const ephemeralEffects =
			multiplier > 0
				? await extractEphemeralEffects({
						affects: "target",
						origin: message.actor,
						target: token.actor,
						item: message.item,
						domains: [domain],
						options: messageRollOptions,
				  })
				: [];
		const contextClone = token.actor.getContextualClone(
			originRollOptions,
			ephemeralEffects,
		);
		const applicationRollOptions = new Set([
			...messageRollOptions.filter((o) => !/^(?:self|target):/.test(o)),
			...effectRollOptions,
			...originRollOptions,
			...contextClone.getSelfRollOptions(),
		]);

		// Target-specific damage/healing adjustments
		const outcome = message.flags.pf2e.context?.outcome;
		const breakdown = [];
		const rolls = [];
		if (typeof damage === "number" && damage < 0) {
			const critical = outcome === "criticalSuccess";

			const resolvables = (() => {
				if (messageItem?.isOfType("spell")) return { spell: messageItem };
				if (messageItem?.isOfType("weapon")) return { weapon: messageItem };
				return {};
			})();

			const damageDice = extractDamageDice(contextClone.synthetics.damageDice, {
				selectors: [domain],
				resolvables,
				test: applicationRollOptions,
			}).filter(
				(d) =>
					(d.critical === null || d.critical === critical) &&
					d.predicate.test(applicationRollOptions),
			);

			for (const dice of damageDice) {
				const formula = `${dice.diceNumber}${dice.dieSize}[${dice.label}]`;
				const roll = await new Roll(formula).evaluate({ async: true });
				roll._formula = `${dice.diceNumber}${dice.dieSize}`; // remove the label from the main formula
				await roll.toMessage({
					flags: { pf2e: { suppressDamageButtons: true } },
					flavor: dice.label,
					speaker: ChatMessage.getSpeaker({ token }),
				});
				breakdown.push(`${dice.label} ${dice.diceNumber}${dice.dieSize}`);
				rolls.push(roll);
			}
			if (rolls.length) {
				damage -= rolls
					.map((roll) => roll.total)
					.reduce((previous, current) => previous + current);
			}

			const modifiers = extractModifiers(contextClone.synthetics, [domain], {
				resolvables,
			}).filter(
				(m) =>
					(m.critical === null || m.critical === critical) &&
					m.predicate.test(applicationRollOptions),
			);

			// unlikely to have any typed modifiers, but apply stacking rules just in case even though the context of
			// previously applied modifiers has been lost
			damage -= applyStackingRules(modifiers ?? []);

			// target-specific modifiers breakdown
			breakdown.push(
				...modifiers
					.filter((m) => m.enabled)
					.map((m) => `${m.label} ${signedInteger(m.modifier)}`),
			);
		}

		await contextClone.applyDamage({
			damage,
			token,
			item: message.item,
			skipIWR: multiplier <= 0,
			rollOptions: applicationRollOptions,
			shieldBlockRequest,
			breakdown,
			outcome,
		});
	}
	toggleOffShieldBlock(message.id);

	// added
	onDamageApplied?.(message, tokens, rollIndex);
}

/**
 * @param {object} target
 * @param {HTMLElement} shieldButton
 * @param {HTMLElement} messageEl
 */
export function onClickShieldBlock(target, shieldButton, messageEl) {
	// changed
	const getTokens = () => {
		return [target];
	};
	const getNonBrokenShields = (tokens) => {
		const actor = tokens[0]?.actor;
		return (
			actor?.itemTypes.shield.filter(
				(s) => s.isEquipped && !s.isBroken && !s.isDestroyed,
			) ?? []
		);
	};

	// Add a tooltipster instance to the shield button if needed.
	if (!shieldButton.classList.contains("tooltipstered")) {
		$(shieldButton)
			.tooltipster({
				animation: "fade",
				trigger: "click",
				arrow: false,
				content: htmlQuery(messageEl, "div.hover-content"),
				contentAsHTML: true,
				contentCloning: true,
				debug: false,
				interactive: true,
				side: ["top"],
				theme: "crb-hover",
				functionBefore: () => {
					const tokens = getTokens();
					if (!tokens.length) return false;

					const nonBrokenShields = getNonBrokenShields(tokens);
					const hasMultipleShields =
						tokens.length === 1 && nonBrokenShields.length > 1;
					const shieldActivated =
						shieldButton.classList.contains("shield-activated");

					// More than one shield and no selection. Show tooltip.
					if (hasMultipleShields && !shieldActivated) {
						return true;
					}

					// More than one shield and one was previously selected. Remove selection and show tooltip.
					if (hasMultipleShields && shieldButton.dataset.shieldId) {
						shieldButton.attributes.removeNamedItem("data-shield-id");
						shieldButton.classList.remove("shield-activated");
						CONFIG.PF2E.chatDamageButtonShieldToggle = false;
						return true;
					}

					// Normal toggle behaviour. Tooltip is suppressed.
					shieldButton.classList.toggle("shield-activated");
					CONFIG.PF2E.chatDamageButtonShieldToggle =
						!CONFIG.PF2E.chatDamageButtonShieldToggle;
					return false;
				},
				functionFormat: (instance, _helper, contentEl) => {
					const tokens = getTokens();
					const nonBrokenShields = getNonBrokenShields(tokens);
					const multipleShields =
						tokens.length === 1 && nonBrokenShields.length > 1;
					const shieldActivated =
						shieldButton.classList.contains("shield-activated");

					// If the actor is wielding more than one shield, have the user pick which shield to use for blocking.
					if (multipleShields && !shieldActivated) {
						// Populate the list with the shield options
						const listEl = htmlQuery(contentEl, "ul.shield-options");
						if (!listEl) return $(contentEl);

						const shieldList = nonBrokenShields.map((shield) => {
							const input = document.createElement("input");
							input.classList.add("data");
							input.type = "radio";
							input.name = "shield-id";
							input.value = shield.id;
							input.addEventListener("click", () => {
								shieldButton.dataset.shieldId = input.value;
								shieldButton.classList.add("shield-activated");
								CONFIG.PF2E.chatDamageButtonShieldToggle = true;
								instance.close();
							});
							const shieldName = document.createElement("span");
							shieldName.classList.add("label");
							shieldName.innerHTML = shield.name;

							const hardness = document.createElement("span");
							hardness.classList.add("tag");
							const hardnessLabel = game.i18n.localize("PF2E.HardnessLabel");
							hardness.innerHTML = `${hardnessLabel}: ${shield.hardness}`;

							const itemLi = document.createElement("li");
							itemLi.classList.add("item");
							itemLi.append(input, shieldName, hardness);

							return itemLi;
						});

						listEl.replaceChildren(...shieldList);
					}

					return $(contentEl);
				},
			})
			.tooltipster("open");
	}
}

/**
 * adapted to toggle multiple buttons
 * @param {string} messageId
 */
export function toggleOffShieldBlock(messageId) {
	for (const app of ["#chat-log", "#chat-popout"]) {
		const selector = `${app} > li.chat-message[data-message-id="${messageId}"] button[data-action$=shield-block]`;
		for (const button of document.body.querySelectorAll(selector)) {
			button?.classList.remove("shield-activated");
		}
	}
	CONFIG.PF2E.chatDamageButtonShieldToggle = false;
}

/**
 * @param {object} options
 * @param {object} options.message
 * @param {number} options.multiplier
 * @param {number} options.rollIndex
 * @param {object[]} [options.tokens]
 * @param {OnDamageApplied} [options.onDamageApplied]
 */
async function shiftAdjustDamage({
	message,
	multiplier,
	rollIndex,
	// added
	tokens,
	onDamageApplied,
}) {
	const content = await renderTemplate(
		"systems/pf2e/templates/chat/damage/adjustment-dialog.hbs",
	);
	const AdjustmentDialog = class extends Dialog {
		activateListeners($html) {
			super.activateListeners($html);
			$html[0].querySelector("input")?.focus();
		}
	};
	const isHealing = multiplier < 0;
	new AdjustmentDialog({
		title: game.i18n.localize(
			isHealing
				? "PF2E.UI.shiftModifyHealingTitle"
				: "PF2E.UI.shiftModifyDamageTitle",
		),
		content,
		buttons: {
			ok: {
				label: game.i18n.localize("PF2E.OK"),
				callback: async ($dialog) => {
					// In case of healing, multipler will have negative sign. The user will expect that positive
					// modifier would increase healing value, while negative would decrease.
					const adjustment =
						(Number($dialog[0].querySelector("input")?.value) || 0) *
						Math.sign(multiplier);
					applyDamageFromMessage({
						message,
						multiplier,
						addend: adjustment,
						promptModifier: false,
						rollIndex,
						// added
						tokens,
						onDamageApplied,
					});
				},
			},
			cancel: {
				label: "Cancel",
			},
		},
		default: "ok",
		close: () => {
			toggleOffShieldBlock(message.id);
		},
	}).render(true);
}

/**
 * @param {Item} item
 * @param {string} rollMode
 * @returns {ChatMessage}
 */
export async function createSelfEffectMessage(item, rollMode = "roll") {
	if (!item.system.selfEffect) {
		throw ErrorPF2e(
			[
				"Only actions with self-applied effects can be passed to `ActorPF2e#useAction`.",
				"Support will be expanded at a later time.",
			].join(" "),
		);
	}

	const { actor, actionCost } = item;
	const token = actor.getActiveTokens(true, true).shift() ?? null;

	const ChatMessagePF2e = ChatMessage.implementation;
	const speaker = ChatMessagePF2e.getSpeaker({ actor, token });
	const flavor = await renderTemplate(
		"systems/pf2e/templates/chat/action/flavor.hbs",
		{
			action: { title: item.name, glyph: getActionGlyph(actionCost) },
			item,
			traits: item.system.traits.value.map((t) =>
				traitSlugToObject(t, CONFIG.PF2E.actionTraits),
			),
		},
	);

	// Get a preview slice of the message
	const previewLength = 100;
	const descriptionPreview = (() => {
		if (item.actor.pack) return null;
		const tempDiv = document.createElement("div");
		const documentTypes = [...CONST.DOCUMENT_LINK_TYPES, "Compendium", "UUID"];
		const linkPattern = new RegExp(
			`@(${documentTypes.join(
				"|",
			)})\\[([^#\\]]+)(?:#([^\\]]+))?](?:{([^}]+)})?`,
			"g",
		);
		tempDiv.innerHTML = item.description.replace(
			linkPattern,
			(_match, ...args) => args[3],
		);

		return tempDiv.innerText.slice(0, previewLength);
	})();
	const description = {
		full:
			descriptionPreview && descriptionPreview.length < previewLength
				? item.description
				: null,
		preview: descriptionPreview,
	};
	const content = await renderTemplate(
		"systems/pf2e/templates/chat/action/self-effect.hbs",
		{
			actor: item.actor,
			description,
		},
	);
	const flags = { pf2e: { context: { type: "self-effect", item: item.id } } };
	const messageData = ChatMessagePF2e.applyRollMode(
		{ speaker, flavor, content, flags },
		rollMode,
	);

	return ChatMessagePF2e.create(messageData);
}

/**
 * @param {string} subtitle
 * @returns {Promise<string>}
 */
export function createManipulateFlavor(subtitle) {
	return renderTemplate("systems/pf2e/templates/chat/action/flavor.hbs", {
		action: {
			title: "PF2E.Actions.Interact.Title",
			subtitle: subtitle,
			glyph: getActionGlyph(1),
		},
		traits: [
			{
				name: "manipulate",
				label: CONFIG.PF2E.featTraits.manipulate,
				description: CONFIG.PF2E.traitsDescriptions.manipulate,
			},
		],
	});
}

/**
 * @param {string} message
 * @param {string} img
 * @returns {Promise<string>}
 */
export function createTradeContent(message, img) {
	return renderTemplate("systems/pf2e/templates/chat/action/content.hbs", {
		imgPath: img,
		message: message.replace(/\b1 × /, ""),
	});
}

/**
 * @param {foundry.Document|string} docOrUuid
 * @param {object} [options]
 * @param {boolean} [options.async]
 * @param {string} [options.label]
 * @returns {Promise<string>}
 */
export function createFancyLink(docOrUuid, { async = true, label } = {}) {
	let link =
		docOrUuid instanceof foundry.abstract.Document
			? docOrUuid.link
			: `@UUID[${docOrUuid}]`;
	if (label) {
		link = link.replace(/\{.+?\}$/, "");
		link = `${link}{${label}}`;
	}
	return TextEditor.enrichHTML(link, { async });
}

/**
 *
 * @param {string} subtitle
 * @param {string} content
 * @param {Actor} actor
 * @param {string} [senderId]
 * @returns {Promise<ChatMessage>}
 */
export async function createManipulationMessage(
	subtitle,
	content,
	actor,
	senderId,
) {
	return ChatMessage.implementation.create({
		user: senderId ?? game.user.id,
		speaker: ChatMessage.getSpeaker({
			actor,
			alias: getHighestName(actor),
		}),
		flavor: await createManipulateFlavor(subtitle),
		content: content,
		type: CONST.CHAT_MESSAGE_TYPES.EMOTE,
	});
}

/**
 *
 * @param {string} subtitle
 * @param {string} message
 * @param {Actor} actor
 * @param {Item} item
 * @param {string} [senderId]
 * @returns {Promise<ChatMessage>}
 */
export async function createTradeMessage(
	subtitle,
	message,
	actor,
	item,
	senderId,
) {
	const content = await createTradeContent(message, item.img);
	return createManipulationMessage(subtitle, content, actor, senderId);
}
