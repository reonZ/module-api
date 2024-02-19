export namespace DEGREE_OF_SUCCESS {
    let CRITICAL_SUCCESS: number;
    let SUCCESS: number;
    let FAILURE: number;
    let CRITICAL_FAILURE: number;
}
export namespace DEGREE_ADJUSTMENT_AMOUNTS {
    let LOWER_BY_TWO: number;
    let LOWER: number;
    let INCREASE: number;
    let INCREASE_BY_TWO: number;
    let TO_CRITICAL_FAILURE: string;
    let TO_FAILURE: string;
    let TO_SUCCESS: string;
    let TO_CRITICAL_SUCCESS: string;
}
export const DEGREE_OF_SUCCESS_STRINGS: string[];
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
