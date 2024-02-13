import { isInstanceOf } from "../utils";
import { applyStackingRules } from "./actor";
import { htmlQuery } from "./html";
import { ErrorPF2e, signedInteger } from "./misc";
import {
	extractDamageDice,
	extractEphemeralEffects,
	extractModifiers,
	extractNotes,
} from "./rules";

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

			const damageDice = extractDamageDice(
				contextClone.synthetics.damageDice,
				[domain],
				{
					resolvables,
					test: applicationRollOptions,
				},
			).filter(
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

		const hasDamageOrHealing =
			typeof damage === "number" ? damage !== 0 : damage.total !== 0;
		const notes = hasDamageOrHealing
			? extractNotes(contextClone.synthetics.rollNotes, [domain]).filter(
					(n) =>
						(!outcome ||
							n.outcome.length === 0 ||
							n.outcome.includes(outcome)) &&
						n.predicate.test(applicationRollOptions),
			  )
			: [];

		await contextClone.applyDamage({
			damage,
			token,
			item: message.item,
			skipIWR: multiplier <= 0,
			rollOptions: applicationRollOptions,
			shieldBlockRequest,
			breakdown,
			notes,
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

					console.log("end of before", shieldButton);
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
	console.trace("toggleOffShieldBlock");
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
