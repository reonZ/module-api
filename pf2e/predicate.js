import { isObject } from "./misc";

/**
 * Encapsulates logic to determine if a modifier should be active or not for a specific roll based
 * on a list of string values. This will often be based on traits, but that is not required - sneak
 * attack could be an option that is not a trait.
 * @category PF2
 */
export class PredicatePF2e extends Array {
	constructor(...statements) {
		super(...(Array.isArray(statements[0]) ? statements[0] : statements));
		this.isValid = PredicatePF2e.isValid(this);
		Object.defineProperty(this, "isValid", { enumerable: false });
	}

	/** Structurally validate the predicates */
	static isValid(statements) {
		return Array.isArray(statements);
	}

	/** Is this an array of predicatation statements? */
	static isArray(statements) {
		return (
			Array.isArray(statements) &&
			statements.every((s) => StatementValidator.isStatement(s))
		);
	}

	/** Test if the given predicate passes for the given list of options. */
	static test(predicate = [], options = []) {
		return predicate instanceof PredicatePF2e
			? predicate.test(options)
			: new PredicatePF2e(...predicate).test(options);
	}

	/** Test this predicate against a domain of discourse */
	test(options) {
		if (this.length === 0) {
			return true;
		}

		if (!this.isValid) {
			console.warn("PF2e System | The provided predicate set is malformed.");
			return false;
		}

		const domain = options instanceof Set ? options : new Set(options);
		return this.every((s) => this.#isTrue(s, domain));
	}

	toObject() {
		return deepClone([...this]);
	}

	clone() {
		return new PredicatePF2e(this.toObject());
	}

	/** Is the provided statement true? */
	#isTrue(statement, domain) {
		return (
			(typeof statement === "string" && domain.has(statement)) ||
			(StatementValidator.isBinaryOp(statement) &&
				this.#testBinaryOp(statement, domain)) ||
			(StatementValidator.isCompound(statement) &&
				this.#testCompound(statement, domain))
		);
	}

	#testBinaryOp(statement, domain) {
		if ("eq" in statement) {
			return domain.has(`${statement.eq[0]}:${statement.eq[1]}`);
		}

		const operator = Object.keys(statement)[0];

		// Allow for tests of partial statements against numeric values
		// E.g., `{ "gt": ["actor:level", 5] }` would match against "actor:level:6" and "actor:level:7"
		const [left, right] = Object.values(statement)[0];
		const domainArray = Array.from(domain);
		const getValues = (operand) => {
			const maybeNumber = Number(operand);
			if (!Number.isNaN(maybeNumber)) return [maybeNumber];
			const pattern = new RegExp(String.raw`^${operand}:([^:]+)$`);
			const values = domainArray
				.map((s) => Number(pattern.exec(s)?.[1] || NaN))
				.filter((v) => !Number.isNaN(v));
			return values.length > 0 ? values : [NaN];
		};
		const leftValues = getValues(left);
		const rightValues = getValues(right);

		switch (operator) {
			case "gt":
				return leftValues.some((l) => rightValues.every((r) => l > r));
			case "gte":
				return leftValues.some((l) => rightValues.every((r) => l >= r));
			case "lt":
				return leftValues.some((l) => rightValues.every((r) => l < r));
			case "lte":
				return leftValues.some((l) => rightValues.every((r) => l <= r));
			default:
				console.warn("PF2e System | Malformed binary operation encountered");
				return false;
		}
	}

	/** Is the provided compound statement true? */
	#testCompound(statement, domain) {
		return (
			("and" in statement &&
				statement.and.every((subProp) => this.#isTrue(subProp, domain))) ||
			("nand" in statement &&
				!statement.nand.every((subProp) => this.#isTrue(subProp, domain))) ||
			("or" in statement &&
				statement.or.some((subProp) => this.#isTrue(subProp, domain))) ||
			("xor" in statement &&
				statement.xor.filter((subProp) => this.#isTrue(subProp, domain))
					.length === 1) ||
			("nor" in statement &&
				!statement.nor.some((subProp) => this.#isTrue(subProp, domain))) ||
			("not" in statement && !this.#isTrue(statement.not, domain)) ||
			("if" in statement &&
				!(
					this.#isTrue(statement.if, domain) &&
					!this.#isTrue(statement.then, domain)
				))
		);
	}
}

function isStatement(statement) {
	return statement instanceof Object
		? isCompound(statement) || isBinaryOp(statement)
		: typeof statement === "string"
		  ? isAtomic(statement)
		  : false;
}

function isAtomic(statement) {
	return (
		(typeof statement === "string" && statement.length > 0) ||
		isBinaryOp(statement)
	);
}

const binaryOperators = new Set(["eq", "gt", "gte", "lt", "lte"]);

function isBinaryOp(statement) {
	if (!isObject(statement)) return false;
	const entries = Object.entries(statement);
	if (entries.length > 1) return false;
	const [operator, operands] = entries[0];
	return (
		binaryOperators.has(operator) &&
		Array.isArray(operands) &&
		operands.length === 2 &&
		typeof operands[0] === "string" &&
		["string", "number"].includes(typeof operands[1])
	);
}

function isCompound(statement) {
	return (
		isObject(statement) &&
		(isAnd(statement) ||
			isOr(statement) ||
			isNand(statement) ||
			isXor(statement) ||
			isNor(statement) ||
			isNot(statement) ||
			isIf(statement))
	);
}

function isAnd(statement) {
	return (
		Object.keys(statement).length === 1 &&
		Array.isArray(statement.and) &&
		statement.and.every((subProp) => isStatement(subProp))
	);
}

function isNand(statement) {
	return (
		Object.keys(statement).length === 1 &&
		Array.isArray(statement.nand) &&
		statement.nand.every((subProp) => isStatement(subProp))
	);
}

function isOr(statement) {
	return (
		Object.keys(statement).length === 1 &&
		Array.isArray(statement.or) &&
		statement.or.every((subProp) => isStatement(subProp))
	);
}

function isXor(statement) {
	return (
		Object.keys(statement).length === 1 &&
		Array.isArray(statement.xor) &&
		statement.xor.every((subProp) => isStatement(subProp))
	);
}

function isNor(statement) {
	return (
		Object.keys(statement).length === 1 &&
		Array.isArray(statement.nor) &&
		statement.nor.every((subProp) => isStatement(subProp))
	);
}

function isNot(statement) {
	return (
		Object.keys(statement).length === 1 &&
		!!statement.not &&
		isStatement(statement.not)
	);
}

function isIf(statement) {
	return (
		Object.keys(statement).length === 2 &&
		isStatement(statement.if) &&
		isStatement(statement.then)
	);
}
