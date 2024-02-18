/**
 * @param {string} actorType
 */
export function refreshActorSheets(actorType) {
	for (const app of Object.values(ui.windows)) {
		if (app instanceof ActorSheet && app.actor?.type === actorType) {
			app.render();
		}
	}
}
