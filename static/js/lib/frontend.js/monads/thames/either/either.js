import { None, Some } from '../option/option.js';
/**
 * Enum-like object for representing the state of an Either: Left or Right.
 */
export const EitherType = {
    Left: Symbol(':left'),
    Right: Symbol(':right'),
};
/**
 * Implements the Either interface for a Left value.
 */
class LeftImpl {
    val;
    constructor(val) {
        this.val = val;
    }
    get type() {
        return EitherType.Left;
    }
    isLeft() {
        return true;
    }
    isRight() {
        return false;
    }
    left() {
        return Some(this.val);
    }
    right() {
        return None;
    }
    unwrap() {
        return this.val;
    }
    unwrapLeft() {
        return this.val;
    }
    unwrapRight() {
        throw new ReferenceError('Cannot unwrap Right value of Either.Left');
    }
    unwrapLeftOr(_other) {
        return this.val;
    }
    unwrapRightOr(other) {
        return other;
    }
    match(matchObject) {
        return matchObject.left(this.val);
    }
    mapLeft(fn) {
        return Left(fn(this.val));
    }
    mapRight(_fn) {
        return Left(this.val);
    }
    leftAndThen(fn) {
        return fn(this.val);
    }
    rightAndThen(_fn) {
        return Left(this.val);
    }
}
/**
 * Implements the Either interface for a Right value.
 */
class RightImpl {
    val;
    constructor(val) {
        this.val = val;
    }
    get type() {
        return EitherType.Right;
    }
    isLeft() {
        return false;
    }
    isRight() {
        return true;
    }
    left() {
        return None;
    }
    right() {
        return Some(this.val);
    }
    unwrap() {
        return this.val;
    }
    unwrapLeft() {
        throw new ReferenceError('Cannot unwrap Left value of Either.Right');
    }
    unwrapRight() {
        return this.val;
    }
    unwrapLeftOr(other) {
        return other;
    }
    unwrapRightOr(_other) {
        return this.val;
    }
    match(matchObject) {
        return matchObject.right(this.val);
    }
    mapLeft(_fn) {
        return Right(this.val);
    }
    mapRight(fn) {
        return Right(fn(this.val));
    }
    leftAndThen(_fn) {
        return Right(this.val);
    }
    rightAndThen(fn) {
        return fn(this.val);
    }
}
/**
 * Factory function for creating a Left instance of Either.
 */
export function Left(val) {
    return new LeftImpl(val);
}
/**
 * Factory function for creating a Right instance of Either.
 */
export function Right(val) {
    return new RightImpl(val);
}
/**
 * Type guard for checking if an Either is a Left.
 *
 * @deprecated Use `Either.isLeft` instead.
 */
export function isLeft(val) {
    return val.isLeft();
}
/**
 * Type guard for checking if an Either is a Right.
 *
 * @deprecated Use `Either.isRight` instead.
 */
export function isRight(val) {
    return val.isRight();
}
