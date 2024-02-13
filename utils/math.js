/**
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
export function calculateDistanceBetweenPoints(x1, y1, x2, y2) {
	const x = x2 - x1;
	const y = y2 - y1;
	return Math.sqrt(x * x + y * y);
}
