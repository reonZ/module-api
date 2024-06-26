import * as R from "remeda";
import { getSelectedActors } from "./actor";
import { calculateDC } from "./dc";
import { htmlClosest, htmlQueryAll } from "./html";
import { ErrorPF2e, getActionGlyph, sluggify, tupleHasValue } from "./misc";
import { eventToRollParams } from "./scripts";
import { EFFECT_AREA_SHAPES } from "./spell";

const SAVE_TYPES = ["fortitude", "reflex", "will"];
const inlineSelector = ["action", "check", "effect-area"]
    .map((keyword) => `[data-pf2-${keyword}]`)
    .join(",");

export const InlineRollLinks = {
    injectRepostElement: (links, foundryDoc) => {
        for (const link of links) {
            if (!foundryDoc || foundryDoc.isOwner) link.classList.add("with-repost");

            const repostButtons = htmlQueryAll(link, "i[data-pf2-repost]");
            if (repostButtons.length > 0) {
                if (foundryDoc && !foundryDoc.isOwner) {
                    for (const button of repostButtons) {
                        button.remove();
                    }
                    link.classList.remove("with-repost");
                }
                continue;
            }

            if (foundryDoc && !foundryDoc.isOwner) continue;

            const newButton = document.createElement("i");
            const icon =
                link.parentElement?.dataset?.pf2Checkgroup !== undefined
                    ? "fa-comment-alt-dots"
                    : "fa-comment-alt";
            newButton.classList.add("fa-solid", icon);
            newButton.dataset.pf2Repost = "";
            newButton.title = game.i18n.localize("PF2E.Repost");
            link.appendChild(newButton);

            newButton.addEventListener("click", (event) => {
                event.stopPropagation();
                const target = event.target;
                if (!(target instanceof HTMLElement)) return;
                const parent = target?.parentElement;
                if (!parent) return;

                const document = resolveDocument(target, foundryDoc);
                InlineRollLinks.repostAction(parent, document);
            });
        }
    },

    listen: (html, foundryDoc = resolveDocument(html)) => {
        const links = htmlQueryAll(html, inlineSelector).filter((l) =>
            ["A", "SPAN"].includes(l.nodeName)
        );
        InlineRollLinks.injectRepostElement(links, foundryDoc);

        InlineRollLinks.flavorDamageRolls(html, foundryDoc instanceof Actor ? foundryDoc : null);

        for (const link of links.filter((l) => l.dataset.pf2Action)) {
            const { pf2Action, pf2Glyph, pf2Variant, pf2Dc, pf2ShowDc, pf2Skill } = link.dataset;
            link.addEventListener("click", (event) => {
                const slug = sluggify(pf2Action ?? "");
                const visibility = pf2ShowDc ?? "all";
                const difficultyClass = Number.isNumeric(pf2Dc)
                    ? { scope: "check", value: Number(pf2Dc) || 0, visibility }
                    : pf2Dc;
                if (slug && game.pf2e.actions.has(slug)) {
                    game.pf2e.actions
                        .get(slug)
                        ?.use({
                            event,
                            variant: pf2Variant,
                            difficultyClass,
                            statistic: pf2Skill,
                        })
                        .catch((reason) => ui.notifications.warn(reason));
                } else {
                    const action =
                        game.pf2e.actions[
                            pf2Action ? sluggify(pf2Action, { camel: "dromedary" }) : ""
                        ];
                    if (pf2Action && action) {
                        action({
                            event,
                            glyph: pf2Glyph,
                            variant: pf2Variant,
                            difficultyClass,
                            skill: pf2Skill,
                        });
                    } else {
                        console.warn(`PF2e System | Skip executing unknown action '${pf2Action}'`);
                    }
                }
            });
        }

        for (const link of links.filter((l) => l.dataset.pf2Check && !l.dataset.invalid)) {
            const {
                pf2Check,
                pf2Dc,
                pf2Traits,
                pf2Label,
                pf2Defense,
                pf2Adjustment,
                pf2Roller,
                pf2RollOptions,
            } = link.dataset;
            const overrideTraits = "overrideTraits" in link.dataset;
            const targetOwner = "targetOwner" in link.dataset;

            if (!pf2Check) return;

            link.addEventListener("click", async (event) => {
                const parent = resolveActor(foundryDoc, link);
                // const actors = [parent];
                const actors = (() => {
                    switch (pf2Roller) {
                        case "self":
                            return parent?.canUserModify(game.user, "update") ? [parent] : [];
                        case "party":
                            if (parent?.isOfType("party")) return [parent];
                            return R.compact([game.actors.party]);
                    }

                    // Use the DOM document as a fallback if it's an actor and the check isn't a saving throw
                    const sheetActor = (() => {
                        const maybeActor =
                            foundryDoc instanceof Actor
                                ? foundryDoc
                                : foundryDoc instanceof Item && foundryDoc.actor
                                ? foundryDoc.actor
                                : null;
                        return maybeActor?.isOwner && !maybeActor.isOfType("loot", "party")
                            ? maybeActor
                            : null;
                    })();
                    const rollingActors = [
                        sheetActor ??
                            getSelectedActors({ exclude: ["loot"], assignedFallback: true }),
                    ].flat();

                    const isSave = tupleHasValue(SAVE_TYPES, pf2Check);
                    if (
                        parent?.isOfType("party") ||
                        (rollingActors.length === 0 && parent && !isSave)
                    ) {
                        return [parent];
                    }

                    return rollingActors;
                })();

                if (actors.length === 0) {
                    ui.notifications.error("PF2E.ErrorMessage.NoTokenSelected", {
                        localize: true,
                    });
                    return;
                }

                const extraRollOptions = [
                    ...(pf2Traits?.split(",").map((o) => o.trim()) ?? []),
                    ...(pf2RollOptions?.split(",").map((o) => o.trim()) ?? []),
                ];
                const eventRollParams = eventToRollParams(event, { type: "check" });
                const checkSlug = link.dataset.slug ? sluggify(link.dataset.slug) : null;

                switch (pf2Check) {
                    case "flat": {
                        for (const actor of actors) {
                            const flatCheck = new actor.saves.reflex.constructor(actor, {
                                label: "",
                                slug: "flat",
                                modifiers: [],
                                check: { type: "flat-check" },
                            });
                            const dc = Number.isInteger(Number(pf2Dc))
                                ? { label: pf2Label, value: Number(pf2Dc) }
                                : null;
                            flatCheck.roll({
                                ...eventRollParams,
                                slug: checkSlug,
                                extraRollOptions,
                                dc,
                            });
                        }
                        break;
                    }
                    default: {
                        const isSavingThrow = tupleHasValue(SAVE_TYPES, pf2Check);

                        // Get actual traits for display in chat cards
                        const traits = isSavingThrow
                            ? []
                            : extraRollOptions.filter((t) => t in CONFIG.PF2E.actionTraits) ?? [];

                        for (const actor of actors) {
                            const statistic = (() => {
                                if (
                                    pf2Check in CONFIG.PF2E.magicTraditions &&
                                    actor.isOfType("creature")
                                ) {
                                    const bestSpellcasting =
                                        actor.spellcasting
                                            .filter((c) => c.tradition === pf2Check)
                                            .flatMap((s) => s.statistic ?? [])
                                            .sort((a, b) => b.check.mod - a.check.mod)
                                            .shift() ?? null;
                                    if (bestSpellcasting) return bestSpellcasting;
                                }
                                return actor.getStatistic(pf2Check);
                            })();

                            if (!statistic) {
                                console.warn(
                                    ErrorPF2e(`Skip rolling unknown statistic ${pf2Check}`).message
                                );
                                continue;
                            }

                            const targetActor = pf2Defense
                                ? targetOwner
                                    ? parent
                                    : game.user.targets.first()?.actor
                                : null;

                            const dcValue = (() => {
                                const adjustment = Number(pf2Adjustment) || 0;
                                if (pf2Dc === "@self.level") {
                                    return calculateDC(actor.level) + adjustment;
                                }
                                return Number(pf2Dc ?? "NaN") + adjustment;
                            })();

                            const dc = (() => {
                                if (Number.isInteger(dcValue)) {
                                    return { label: pf2Label, value: dcValue };
                                }

                                if (pf2Defense) {
                                    const defenseStat = targetActor?.getStatistic(pf2Defense);
                                    return defenseStat
                                        ? {
                                              statistic: defenseStat.dc,
                                              scope: "check",
                                              value: defenseStat.dc.value,
                                          }
                                        : null;
                                }

                                return null;
                            })();

                            // Retrieve the item if:
                            // (2) The item is an action or,
                            // (1) The check is a saving throw and the item is not a weapon.
                            // Exclude weapons so that roll notes on strikes from incapacitation abilities continue to work.
                            const item = (() => {
                                const itemFromDoc =
                                    foundryDoc instanceof Item
                                        ? foundryDoc
                                        : foundryDoc instanceof ChatMessage
                                        ? foundryDoc.item
                                        : null;

                                return itemFromDoc?.isOfType("action", "feat", "campaignFeature") ||
                                    (isSavingThrow && !itemFromDoc?.isOfType("weapon"))
                                    ? itemFromDoc
                                    : null;
                            })();

                            const args = {
                                ...eventRollParams,
                                extraRollOptions,
                                origin: isSavingThrow && parent instanceof Actor ? parent : null,
                                dc,
                                target: !isSavingThrow && dc?.statistic ? targetActor : null,
                                item,
                                traits,
                            };

                            // Use a special header for checks against defenses
                            const itemIsEncounterAction =
                                !overrideTraits &&
                                !!(item?.isOfType("action", "feat") && item.actionCost) &&
                                !["flat-check", "saving-throw"].includes(statistic.check.type);
                            if (itemIsEncounterAction) {
                                const subtitleLocKey =
                                    pf2Check in CONFIG.PF2E.magicTraditions
                                        ? "PF2E.ActionsCheck.spell"
                                        : statistic.check.type === "attack-roll"
                                        ? "PF2E.ActionsCheck.x-attack-roll"
                                        : "PF2E.ActionsCheck.x";
                                args.label = await renderTemplate(
                                    "systems/pf2e/templates/chat/action/header.hbs",
                                    {
                                        glyph: getActionGlyph(item.actionCost),
                                        subtitle: game.i18n.format(subtitleLocKey, {
                                            type: statistic.label,
                                        }),
                                        title: item.name,
                                    }
                                );
                                extraRollOptions.push(...createActionOptions(item));
                            }

                            statistic.roll(args);
                        }
                    }
                }
            });
        }

        const templateConversion = {
            burst: "circle",
            cone: "cone",
            cube: "rect",
            emanation: "circle",
            line: "ray",
            rect: "rect",
            square: "rect",
        };

        for (const link of links.filter((l) => l.hasAttribute("data-pf2-effect-area"))) {
            const { pf2EffectArea, pf2Distance, pf2TemplateData, pf2Traits, pf2Width } =
                link.dataset;
            link.addEventListener("click", () => {
                if (!canvas.ready) return;

                if (typeof pf2EffectArea !== "string") {
                    console.warn(`PF2e System | Could not create template'`);
                    return;
                }

                const data = JSON.parse(pf2TemplateData ?? "{}");
                data.distance ||= Number(pf2Distance);
                data.fillColor ||= game.user.color;
                data.t = templateConversion[pf2EffectArea];

                switch (data.t) {
                    case "ray":
                        data.width =
                            Number(pf2Width) ||
                            CONFIG.MeasuredTemplate.defaults.width * canvas.dimensions.distance;
                        break;
                    case "cone":
                        data.angle ||= CONFIG.MeasuredTemplate.defaults.angle;
                        break;
                    case "rect": {
                        const distance = data.distance ?? 0;
                        data.distance = Math.hypot(distance, distance);
                        data.width = distance;
                        data.direction = 45;
                        break;
                    }
                }

                const flags = {
                    pf2e: {},
                };

                const normalSize = (Math.ceil(data.distance) / 5) * 5 || 5;
                if (
                    tupleHasValue(EFFECT_AREA_SHAPES, pf2EffectArea) &&
                    data.distance === normalSize
                ) {
                    flags.pf2e.areaShape = pf2EffectArea;
                }

                const messageId =
                    foundryDoc instanceof ChatMessage
                        ? foundryDoc.id
                        : htmlClosest(html, "[data-message-id]")?.dataset.messageId ?? null;
                if (messageId) {
                    flags.pf2e.messageId = messageId;
                }

                const actor = resolveActor(foundryDoc, link);
                if (actor || pf2Traits) {
                    const origin = {};
                    if (actor) {
                        origin.actor = actor.uuid;
                    }
                    if (pf2Traits) {
                        origin.traits = pf2Traits.split(",");
                    }
                    flags.pf2e.origin = origin;
                }

                if (!R.isEmpty(flags.pf2e)) {
                    data.flags = flags;
                }

                canvas.templates.createPreview(data);
            });
        }

        for (const link of html.querySelectorAll("a[data-damage-roll]")) {
            link.dataset.itemUuid = foundryDoc.uuid;
        }
    },

    makeRepostHtml: (target, defaultVisibility) => {
        const flavor = game.i18n.localize(target.dataset.pf2RepostFlavor ?? "");
        const showDC = target.dataset.pf2ShowDc ?? defaultVisibility;
        return `<span data-visibility="${showDC}">${flavor}</span> ${target.outerHTML}`.trim();
    },

    repostAction: async (target, foundryDoc = null) => {
        if (!["pf2Action", "pf2Check", "pf2EffectArea"].some((d) => d in target.dataset)) {
            return;
        }

        const actor = resolveActor(foundryDoc, target);
        const defaultVisibility = (actor ?? foundryDoc)?.hasPlayerOwner ? "all" : "gm";
        const content = (() => {
            if (target.parentElement?.dataset?.pf2Checkgroup !== undefined) {
                const content = htmlQueryAll(target.parentElement, inlineSelector)
                    .map((target) => InlineRollLinks.makeRepostHtml(target, defaultVisibility))
                    .join("<br>");

                return `<div data-pf2-checkgroup>${content}</div>`;
            }

            return InlineRollLinks.makeRepostHtml(target, defaultVisibility);
        })();

        const ChatMessagePF2e = ChatMessage.implementation;
        const speaker = actor
            ? ChatMessagePF2e.getSpeaker({
                  actor,
                  token: actor.getActiveTokens(true, true).shift(),
              })
            : ChatMessagePF2e.getSpeaker();

        // If the originating document is a journal entry, include its UUID as a flag. If a chat message, copy over
        // the origin flag.
        const message = game.messages.get(
            htmlClosest(target, "[data-message-id]")?.dataset.messageId ?? ""
        );
        const flags =
            foundryDoc instanceof JournalEntry
                ? { pf2e: { journalEntry: foundryDoc.uuid } }
                : message?.flags.pf2e.origin
                ? { pf2e: { origin: fu.foundry.utils.deepClone(message.flags.pf2e.origin) } }
                : {};

        return ChatMessagePF2e.create({ speaker, content, flags });
    },

    /** Give inline damage-roll links from items flavor text of the item name */
    flavorDamageRolls(html, actor = null) {
        for (const rollLink of htmlQueryAll(html, "a.inline-roll[data-damage-roll]")) {
            const itemId = htmlClosest(rollLink, "[data-item-id]")?.dataset.itemId;
            const item = actor?.items.get(itemId ?? "");
            if (item) rollLink.dataset.flavor ||= item.name;
        }
    },
};

/** If the provided document exists returns it, otherwise attempt to derive it from the sheet */
function resolveDocument(html, foundryDoc) {
    if (foundryDoc) return foundryDoc;

    const sheet = ui.windows[Number(html.closest(".app.sheet")?.dataset.appid)] ?? null;

    const document = sheet?.document;
    return document instanceof Actor || document instanceof JournalEntry ? document : null;
}

/** Retrieve an actor via a passed document or item UUID in the dataset of a link */
function resolveActor(foundryDoc, anchor) {
    if (foundryDoc instanceof Actor) return foundryDoc;
    if (foundryDoc instanceof Item || foundryDoc instanceof ChatMessage) return foundryDoc.actor;

    // Retrieve item/actor from anywhere via UUID
    const itemUuid = anchor.dataset.itemUuid;
    const itemByUUID =
        itemUuid && !itemUuid.startsWith("Compendium.") ? fromUuidSync(itemUuid) : null;
    return itemByUUID instanceof Item ? itemByUUID.actor : null;
}

/** Create roll options with information about the action being used */
function createActionOptions(item, extra = []) {
    if (!item?.isOfType("action", "feat") || !item.actionCost) return [];

    const slug = item.slug ?? sluggify(item.name);
    const traits = R.uniq(
        [item.system.traits.value, extra.filter((t) => t in CONFIG.PF2E.actionTraits)].flat()
    );
    const actionCost = item.actionCost.value;

    return R.compact([
        `action:${slug}`,
        `action:cost:${actionCost}`,
        `self:action:slug:${slug}`,
        `self:action:cost:${actionCost}`,
        ...traits.map((t) => `self:action:trait:${t}`),
    ]);
}
