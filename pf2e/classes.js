/**
 * @returns { new (...args: unknkown[]) => object}
 */
export function getDamageRollClass() {
	return CONFIG.Dice.rolls.find((Roll) => Roll.name === "DamageRoll");
}
