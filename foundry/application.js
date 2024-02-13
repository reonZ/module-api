/**
 * @param {unknown} actor
 */
export function refreshCharacterSheets(actor) {
	for (const win of Object.values(ui.windows)) {
		const winActor = win.actor;
		if (!(win instanceof ActorSheet) || !winActor.isOfType("character"))
			continue;
		if (!actor || actor === winActor) win.render();
	}
}
