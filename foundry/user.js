function getUser() {
	return game.user ?? game.data.users.find((x) => x._id === game.data.userId);
}

/**
 * @returns {boolean}
 */
export function isUserGM() {
	const user = getUser();
	return user && user.role >= CONST.USER_ROLES.ASSISTANT;
}

/**
 * @returns {boolean}
 */
export function isActiveGM() {
	return game.user === game.users.activeGM;
}

/**
 * @returns {boolean}
 */
export function isGMOnline() {
	return game.users.some((user) => user.active && user.isGM);
}
