/**
 * @param {object} tab
 * @returns {Promise<object[]>}
 */
export function getTabResults(tab) {
	return Promise.all(
		tab.currentIndex.flatMap(async ({ uuid }) =>
			(await fromUuid(uuid))?.toObject(),
		),
	);
}
