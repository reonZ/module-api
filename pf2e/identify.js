import { adjustDCByRarity, calculateDC } from "./dc";
import { setHasElement } from "./misc";
import { MAGIC_TRADITIONS } from "./spell";

export class IdentifyItemPopup extends FormApplication {
	static get defaultOptions() {
		return {
			...FormApplication.defaultOptions,
			id: "identify-item",
			title: game.i18n.localize("PF2E.identification.Identify"),
			template: "systems/pf2e/templates/actors/identify-item.hbs",
			width: "auto",
			classes: ["identify-popup"],
		};
	}

	dcs = getItemIdentificationDCs(this.object, {
		pwol: game.pf2e.settings.variants.pwol.enabled,
		notMatchingTraditionModifier: game.settings.get(
			"pf2e",
			"identifyMagicNotMatchingTraditionModifier",
		),
	});

	async getData() {
		const item = this.object;
		return {
			...(await super.getData()),
			isMagic: item.isMagical,
			isAlchemical: item.isAlchemical,
			dcs: this.dcs,
		};
	}

	activateListeners($html) {
		const html = $html[0];

		const updateButton =
			html.querySelector < HTMLButtonElement > "button.update-identification";
		updateButton?.addEventListener("click", () => {
			this.submit({ updateData: { status: updateButton.value } });
		});

		// Add listener on Post skill checks to chat button that posts item unidentified img and name and skill checks
		html
			.querySelector("button.post-skill-checks")
			?.addEventListener("click", async () => {
				const item = this.object;
				const identifiedName = item.system.identification.identified.name;
				const dcs = this.dcs;
				const action = item.isMagical
					? "identify-magic"
					: item.isAlchemical
					  ? "identify-alchemy"
					  : "recall-knowledge";

				const content = await renderTemplate(
					"systems/pf2e/templates/actors/identify-item-chat-skill-checks.hbs",
					{
						identifiedName,
						action,
						skills: R.omit(dcs, ["dc"]),
						unidentified: item.system.identification.unidentified,
						uuid: item.uuid,
					},
				);

				await ChatMessage.implementation.create({
					user: game.user.id,
					content,
				});
			});
	}

	async _updateObject(_event, formData) {
		const status = formData.status;
		if (status === "identified") {
			return this.object.setIdentificationStatus(status);
		}
	}
}

export function getItemIdentificationDCs(
	item,
	{ pwol = false, notMatchingTraditionModifier },
) {
	const baseDC = calculateDC(item.level, { pwol });
	const rarity = getDcRarity(item);
	const dc = adjustDCByRarity(baseDC, rarity);
	if (item.isMagical) {
		return getIdentifyMagicDCs(item, dc, notMatchingTraditionModifier);
	}

	return { crafting: dc };
}

/**
 *
 * @param {Item} item
 * @returns {import('./dc').Rarity}
 */
function getDcRarity(item) {
	return item.traits.has("cursed") ? "unique" : item.rarity;
}

/**
 *
 * @param {PhysicalItemPF2e} item
 * @param {number} baseDC
 * @param {number} notMatchingTraditionModifier
 * @returns {{arcana: number; nature: number; occultism: number; religion: number;}}
 */
function getIdentifyMagicDCs(item, baseDC, notMatchingTraditionModifier) {
	const result = {
		occult: baseDC,
		primal: baseDC,
		divine: baseDC,
		arcane: baseDC,
	};
	const traditions = getMagicTraditions(item);
	for (const key of MAGIC_TRADITIONS) {
		// once an item has a magic tradition, all skills
		// that don't match the tradition are hard
		if (traditions.size > 0 && !traditions.has(key)) {
			result[key] = baseDC + notMatchingTraditionModifier;
		}
	}
	return {
		arcana: result.arcane,
		nature: result.primal,
		religion: result.divine,
		occultism: result.occult,
	};
}

/**
 * @param {PhysicalItemPF2e} item
 * @returns {MAGIC_TRADITIONS}
 */
function getMagicTraditions(item) {
	const traits = item.system.traits.value;
	return new Set(traits.filter((t) => setHasElement(MAGIC_TRADITIONS, t)));
}
