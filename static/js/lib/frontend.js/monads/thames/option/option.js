/**
 * Enum-like object to represent the type of an Option (Some or None).
 */
export const OptionType = {
    Some: Symbol(':some'),
    None: Symbol(':none'),
};
/**
 * Represents a Some value of Option.
 */
class SomeImpl {
    val;
    constructor(val) {
        this.val = val;
    }
    get type() {
        return OptionType.Some;
    }
    isSome() {
        return true;
    }
    isNone() {
        return false;
    }
    match(fn) {
        return fn.some(this.val);
    }
    map(fn) {
        return Some(fn(this.val));
    }
    andThen(fn) {
        return fn(this.val);
    }
    or(_optb) {
        return this;
    }
    and(optb) {
        return optb;
    }
    unwrapOr(_def) {
        return this.val;
    }
    unwrap() {
        return this.val;
    }
}
/**
 * Represents a None value of Option.
 */
class NoneImpl {
    get type() {
        return OptionType.None;
    }
    isSome() {
        return false;
    }
    isNone() {
        return true;
    }
    match({ none }) {
        if (typeof none === 'function') {
            return none();
        }
        return none;
    }
    map(_fn) {
        return new NoneImpl();
    }
    andThen(_fn) {
        return new NoneImpl();
    }
    or(optb) {
        return optb;
    }
    and(_optb) {
        return new NoneImpl();
    }
    unwrapOr(def) {
        return def;
    }
    unwrap() {
        throw new ReferenceError('Trying to unwrap None.');
    }
}
/**
 * Creates a Some instance of Option containing the given value.
 * This function is used to represent the presence of a value in an operation that may not always produce a value.
 *
 * @param val The value to be wrapped in a Some Option.
 * @returns An Option instance representing the presence of a value.
 *
 * #### Example
 *
 * ```ts
 * const option = Some(42);
 * console.log(option.unwrap()); // Outputs: 42
 * ```
 */
export function Some(val) {
    return new SomeImpl(val);
}
/**
 * The singleton instance representing None, an Option with no value.
 * This constant is used to represent the absence of a value in operations that may not always produce a value.
 *
 * #### Example
 *
 * ```ts
 * const option = None;
 * console.log(option.isNone()); // Outputs: true
 * ```
 */
export const None = new NoneImpl(); // eslint-disable-line @typescript-eslint/no-explicit-any
/**
 * Type guard to check if an Option is a Some value.
 * This function is used to narrow down the type of an Option to SomeOption in TypeScript's type system.
 *
 * @deprecated Use `Option.isSome` instead.
 * @param val The Option to be checked.
 * @returns true if the provided Option is a SomeOption, false otherwise.
 *
 * #### Example
 *
 * ```ts
 * const option = Some('Success');
 * if (isSome(option)) {
 *   console.log('Option has a value:', option.unwrap());
 * }
 * ```
 */
export function isSome(val) {
    return val.isSome();
}
/**
 * Type guard to check if an Option is a None value.
 * This function is used to narrow down the type of an Option to NoneOption in TypeScript's type system.
 *
 * @deprecated Use `Option.isNone` instead.
 * @param val The Option to be checked.
 * @returns true if the provided Option is a NoneOption, false otherwise.
 *
 * #### Example
 *
 * ```ts
 * const option = None;
 * if (isNone(option)) {
 *   console.log('Option does not have a value.');
 * }
 * ```
 */
export function isNone(val) {
    return val.isNone();
}
