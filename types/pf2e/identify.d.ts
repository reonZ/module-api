export function getItemIdentificationDCs(item: any, { pwol, notMatchingTraditionModifier }: {
    pwol?: boolean;
    notMatchingTraditionModifier: any;
}): {
    arcana: number;
    nature: number;
    occultism: number;
    religion: number;
} | {
    crafting: number;
};
export class IdentifyItemPopup {
    static get defaultOptions(): any;
    dcs: {
        arcana: number;
        nature: number;
        occultism: number;
        religion: number;
    } | {
        crafting: number;
    };
    getData(): Promise<any>;
    activateListeners($html: any): void;
    _updateObject(_event: any, formData: any): Promise<any>;
}
