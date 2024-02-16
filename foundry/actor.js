/**
 * @param {unknown} actor
 * @returns {unknown}
 */
export function getOwner(actor) {
	const isValidUser = (user) => user.active && !user.isGM;

	let owners = game.users.filter(
		(user) => isValidUser(user) && user.character === actor,
	);

	if (!owners.length) {
		owners = game.users.filter(
			(user) => isValidUser(user) && doc.testUserPermission(user, "OWNER"),
		);
	}

	owners.sort((a, b) => (a.id > b.id ? 1 : -1));

	return owners[0] || null;
}

/**
 * @param {unknown} actor
 * @returns {boolean}
 */
export function isOwner(actor) {
	return getOwner(actor) === game.user;
}

/**
 * @param {Actor} actor
 * @returns {string}
 */
export function getHighestName(actor) {
	return actor.token?.name ?? actor.prototypeToken?.name ?? actor.name;
}
