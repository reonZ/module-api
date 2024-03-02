/**
 * @typedef {"equipment"} TabName
 * @typedef {TabName | Record<string, unknown>} TabOrTabName
 */

/**
 * @param {TabOrTabName} tabOrName
 * @returns {Promise<object[]>}
 */
export function getTabResults(tabOrName) {
	const tab = tabFromTabOrTabName(tabOrName);
	return Promise.all(
		tab.currentIndex.flatMap(async ({ uuid }) =>
			(await fromUuid(uuid))?.toObject(),
		),
	);
}

/**
 * @returns {object}
 */
export function getBrowser() {
	return game.pf2e.compendiumBrowser;
}

/**
 * @param {TabName} tabName
 * @returns {object}
 */
export function getBrowserTab(tabName) {
	return game.pf2e.compendiumBrowser.tabs[tabName];
}

/**
 * @param {TabName} tabOrName
 * @param {object|false} [data]
 * @returns {Promise<void>}
 */
export function openBrowserTab(tabOrName, data) {
	const tab = tabFromTabOrTabName(tabOrName);
	const tabData =
		typeof data === "object"
			? data
			: data === false && tab.isInitialized
			  ? deepClone(tab.defaultFilterData)
			  : undefined;
	return game.pf2e.compendiumBrowser.openTab(tab.tabName, tabData);
}

/**
 *
 * @param {TabOrTabName} tab
 * @returns {object}
 */
function tabFromTabOrTabName(tab) {
	if (typeof tab === "string") {
		return getBrowserTab(tab);
	}
	return tab;
}

let equipmentTabData;
export function getEquipmentTabData({ collapsed = false, mergeWith } = {}) {
	const tab = getBrowserTab("equipment");

	const returned = (equipmentData) => {
		const filterData = deepClone(equipmentData);

		if (collapsed) {
			for (const [typeName, type] of Object.entries(filterData)) {
				if (typeName === "order" || typeName === "search") continue;
				for (const category of Object.values(type)) {
					if ("isExpanded" in category) {
						category.isExpanded = false;
					}
				}
			}
		}

		if (typeof mergeWith === "object") {
			mergeObject(filterData, mergeWith);

			for (const data of Object.values(filterData.checkboxes)) {
				if (!data.selected.length) continue;

				data.isExpanded = true;
				for (const selected of data.selected) {
					data.options[selected].selected = true;
				}
			}

			for (const type of ["ranges", "sliders"]) {
				const defaultType = equipmentData[type];

				for (const [category, data] of Object.entries(filterData[type])) {
					const defaultCategory = defaultType[category];
					if (objectsEqual(data.values, defaultCategory.values)) continue;
					data.isExpanded = true;
				}
			}
		}

		return filterData;
	};

	if (tab.defaultFilterData) {
		return returned(tab.defaultFilterData);
	}

	if (equipmentTabData) {
		return returned(equipmentTabData);
	}

	equipmentTabData = tab.prepareFilterData();

	equipmentTabData.checkboxes.armorTypes.options = tab.generateCheckboxOptions(
		CONFIG.PF2E.armorCategories,
	);
	mergeObject(
		equipmentTabData.checkboxes.armorTypes.options,
		tab.generateCheckboxOptions(CONFIG.PF2E.armorGroups),
	);
	equipmentTabData.checkboxes.weaponTypes.options = tab.generateCheckboxOptions(
		CONFIG.PF2E.weaponCategories,
	);
	mergeObject(
		equipmentTabData.checkboxes.weaponTypes.options,
		tab.generateCheckboxOptions(CONFIG.PF2E.weaponGroups),
	);

	equipmentTabData.multiselects.traits.options = tab.generateMultiselectOptions(
		{
			...CONFIG.PF2E.armorTraits,
			...CONFIG.PF2E.consumableTraits,
			...CONFIG.PF2E.equipmentTraits,
			...CONFIG.PF2E.shieldTraits,
			...CONFIG.PF2E.weaponTraits,
		},
	);

	equipmentTabData.checkboxes.itemTypes.options = tab.generateCheckboxOptions({
		weapon: "TYPES.Item.weapon",
		shield: "TYPES.Item.shield",
		armor: "TYPES.Item.armor",
		equipment: "TYPES.Item.equipment",
		consumable: "TYPES.Item.consumable",
		treasure: "TYPES.Item.treasure",
		backpack: "TYPES.Item.backpack",
		kit: "TYPES.Item.kit",
	});
	equipmentTabData.checkboxes.rarity.options = tab.generateCheckboxOptions(
		CONFIG.PF2E.rarityTraits,
		false,
	);

	return returned(equipmentTabData);
}
