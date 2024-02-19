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
