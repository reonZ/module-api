/**
 * @class
 * @constructor
 */
export class DegreeOfSuccess {
    static CRITICAL_FAILURE: number;
    static FAILURE: number;
    static SUCCESS: number;
    static CRITICAL_SUCCESS: number;
    /**
     * @param {{dieResult: number, rollTotal: number}} roll
     * @param {number|{value: number}} dc
     * @param {object|null} [dosAdjustments]
     */
    constructor(roll: {
        dieResult: number;
        rollTotal: number;
    }, dc: number | {
        value: number;
    }, dosAdjustments?: object | null);
    dieResult: any;
    rollTotal: any;
    dc: {
        value: number;
    };
    unadjusted: any;
    adjustment: {
        label: any;
        amount: any;
    };
    /**
     * @type {0|1|2|3}
     */
    value: 0 | 1 | 2 | 3;
    #private;
}
