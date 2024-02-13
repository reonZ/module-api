/**
 * @param {unknown} measuredTemplate
 * @param {{collisionOrigin?: {x: number, y: number}, collisionType?: "move" | "sight"}} [options]
 * @returns {unknown[]}
 */
export function getTemplateTokens(measuredTemplate: unknown, { collisionOrigin, collisionType }?: {
    collisionOrigin?: {
        x: number;
        y: number;
    };
    collisionType?: "move" | "sight";
}): unknown[];
