import { None, Some } from '../option/option.js';
/**
 * Enum-like object to represent the type of a Result (Ok or Err).
 */
export const ResultType = {
    Ok: Symbol(':ok'),
    Err: Symbol(':err'),
};
/**
 * Represents a Ok Result.
 */
class OkImpl {
    val;
    constructor(val) {
        this.val = val;
    }
    get type() {
        return ResultType.Ok;
    }
    isOk() {
        return true;
    }
    isErr() {
        return false;
    }
    ok() {
        return Some(this.val);
    }
    err() {
        return None;
    }
    match(matchObject) {
        return matchObject.ok(this.val);
    }
    map(fn) {
        return Ok(fn(this.val));
    }
    mapErr(_fn) {
        return Ok(this.val);
    }
    andThen(fn) {
        return fn(this.val);
    }
    orElse(_fn) {
        return Ok(this.val);
    }
    unwrap() {
        return this.val;
    }
    unwrapErr() {
        throw new ReferenceError('Cannot unwrap Err value of Result.Ok');
    }
    unwrapOr(_optb) {
        return this.val;
    }
}
/**
 * Represents an Err Result.
 */
class ErrImpl {
    val;
    constructor(val) {
        this.val = val;
    }
    get type() {
        return ResultType.Err;
    }
    isOk() {
        return false;
    }
    isErr() {
        return true;
    }
    ok() {
        return None;
    }
    err() {
        return Some(this.val);
    }
    match(matchObject) {
        return matchObject.err(this.val);
    }
    map(_fn) {
        return Err(this.val);
    }
    mapErr(fn) {
        return Err(fn(this.val));
    }
    andThen(_fn) {
        return Err(this.val);
    }
    orElse(fn) {
        return fn(this.val);
    }
    unwrap() {
        throw new ReferenceError('Cannot unwrap Ok value of Result.Err');
    }
    unwrapErr() {
        return this.val;
    }
    unwrapOr(optb) {
        return optb;
    }
}
/**
 * Creates an Ok instance of Result containing the success value.
 * This function is used to represent a successful result in operations that could potentially fail.
 *
 * @param val The value to be contained within the Ok Result.
 * @returns A Result instance representing success and containing the provided value.
 *
 * #### Example
 *
 * ```ts
 * const successResult = Ok(42);
 * console.log(successResult.unwrap()); // Outputs: 42
 * ```
 */
export function Ok(val) {
    return new OkImpl(val);
}
/**
 * Creates an Err instance of Result containing the error value.
 * This function is used to represent a failure in operations that could potentially fail.
 *
 * @param val The error value to be contained within the Err Result.
 * @returns A Result instance representing an error and containing the provided error value.
 *
 * #### Example
 *
 * ```ts
 * const errorResult = Err('Something went wrong');
 * console.log(errorResult.unwrapErr()); // Outputs: Something went wrong
 * ```
 */
export function Err(val) {
    return new ErrImpl(val);
}
/**
 * Type guard to check if a Result is an Ok value.
 * This function is used to narrow down the type of a Result to OkResult in TypeScript type system.
 *
 * @deprecated Use `Result.isOk` instead.
 * @param val The Result to be checked.
 * @returns true if the provided Result is an OkResult, false otherwise.
 *
 * #### Example
 *
 * ```ts
 * const result = Ok('Success');
 * if (isOk(result)) {
 *   console.log('Operation was successful:', result.unwrap());
 * }
 * ```
 */
export function isOk(val) {
    return val.isOk();
}
/**
 * Type guard to check if a Result is an Err value.
 * This function is used to narrow down the type of a Result to ErrResult in TypeScript type system.
 *
 * @deprecated Use `Result.isErr` instead.
 * @param val The Result to be checked.
 * @returns true if the provided Result is an ErrResult, false otherwise.
 *
 * #### Example
 *
 * ```ts
 * const result = Err('Failure');
 * if (isErr(result)) {
 *   console.log('Operation failed with error:', result.unwrapErr());
 * }
 * ```
 */
export function isErr(val) {
    return val.isErr();
}
