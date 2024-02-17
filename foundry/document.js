import { MODULE, socketEmit } from ".";

/**
 * @param {object} doc
 * @param {string[]} path
 * @returns {unknown}
 */
export function getInMemory(doc, ...path) {
	return getProperty(doc, `modules.${MODULE.id}.${path.join(".")}`);
}

/**
 * @param {object} doc
 * @param  {(string|unknown)[]} args
 * @returns {Boolean}
 */
export function setInMemory(doc, ...args) {
	const value = args.splice(-1)[0];
	return setProperty(doc, `modules.${MODULE.id}.${args.join(".")}`, value);
}

/**
 * @param {object} doc
 * @param  {(string|unknown)[]} args
 * @returns {unknown}
 */
export function getInMemoryAndSetIfNot(doc, ...args) {
	const value = args.splice(-1)[0];
	const current = getInMemory(doc, ...args);
	if (current != null) return current;
	const result = typeof value === "function" ? value() : value;
	setInMemory(doc, ...args, result);
	return result;
}

/**
 * @param {object} doc
 * @param {string[]} path
 * @returns {boolean}
 */
export function deleteInMemory(doc, ...path) {
	const split = ["modules", MODULE.id, ...path];
	const last = split.pop();
	let cursor = doc;
	for (const key of split) {
		cursor = cursor[key];
		if (!cursor) return true;
	}
	return delete cursor[last];
}

/**
 * @param {object} options
 * @param {FoundryDocument} options.doc
 * @param {Record<string, unknown>} [options.updates]
 * @returns {Promise<void>}
 */
export async function updateDocument({ doc, updates, message }, userId) {
	const foundryDoc =
		doc instanceof foundry.abstract.Document ? doc : await fromUuid(doc);

	if (!foundryDoc.isOwner) {
		socketEmit({
			type: "permission.update-document",
			doc: foundryDoc.uuid,
			updates,
			message,
		});
		return;
	}

	foundryDoc.update(updates);

	if (message) {
		message.user = userId ?? game.user.id;
		ChatMessage.implementation.create(message);
	}
}
