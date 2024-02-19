/**
 * @generator
 * @template T
 * @param {number} nb
 * @param {T} [fromMessage]
 * @returns {{message: T, html: JQuery}}
 */
export function* latestChatMessages(nb, fromMessage) {
	const chat = ui.chat?.element;
	if (!chat) return;

	const messages = game.messages.contents;
	const start =
		(fromMessage
			? messages.findLastIndex((m) => m === fromMessage)
			: messages.length) - 1;

	for (let i = start; i >= start - nb; i--) {
		const message = messages[i];
		if (!message) return;

		const html = chat.find(`[data-message-id=${message.id}]`);
		if (!html.length) continue;

		yield { message, html };
	}
}

/**
 * @param {string} uuid
 * @param {string} [label]
 * @returns {string}
 */
export function chatUUID(uuid, label) {
	if (!uuid) {
		return `<span style="background: #DDD; padding: 1px 4px; border: 1px solid var(--color-border-dark-tertiary);
border-radius: 2px; white-space: nowrap; word-break: break-all;">${label}</span>`;
	}

	if (label) return `@UUID[${uuid}]{${label}}`;

	return `@UUID[${uuid}]`;
}

/**
 * @param {object} message
 * @returns {string}
 */
export function hasEmbeddedSpell(message) {
	return !!(
		message.getFlag("pf2e", "casting.embeddedSpell") ||
		message.item?.trickMagicEntry
	);
}
