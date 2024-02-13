/**
 * @param {string} hook
 * @param {Functionn} fn
 * @returns {number}
 */
export function registerUpstreamHook(hook, fn) {
	const id = Hooks.on(hook, fn);
	const index = Hooks.events[hook].findIndex((x) => x.id === id);

	if (index !== 0) {
		const [hooked] = Hooks.events[hook].splice(index, 1);
		Hooks.events[hook].unshift(hooked);
	}

	return id;
}
