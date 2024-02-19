/**
 * Encapsulates logic to determine if a modifier should be active or not for a specific roll based
 * on a list of string values. This will often be based on traits, but that is not required - sneak
 * attack could be an option that is not a trait.
 * @category PF2
 */
export class PredicatePF2e extends Array<any> {
    /** Structurally validate the predicates */
    static isValid(statements: any): boolean;
    /** Is this an array of predicatation statements? */
    static isArray(statements: any): boolean;
    /** Test if the given predicate passes for the given list of options. */
    static test(predicate?: any[], options?: any[]): boolean;
    constructor(...statements: any[]);
    isValid: boolean;
    /** Test this predicate against a domain of discourse */
    test(options: any): boolean;
    toObject(): any;
    clone(): PredicatePF2e;
    #private;
}
