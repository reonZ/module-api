export namespace InlineRollLinks {
    function injectRepostElement(links: any, foundryDoc: any): void;
    function listen(html: any, foundryDoc?: any): void;
    function makeRepostHtml(target: any, defaultVisibility: any): string;
    function repostAction(target: any, foundryDoc?: any): Promise<any>;
    /** Give inline damage-roll links from items flavor text of the item name */
    function flavorDamageRolls(html: any, actor?: any): void;
}
