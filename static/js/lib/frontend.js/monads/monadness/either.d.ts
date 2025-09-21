import { Monad, FunctorFunc, ApplicativeFunc } from "./interfaces.js";
import { Maybe } from "./maybe.js";
import { Option } from "./option.js";
/**
 * The Either<L, R> abstract class.
 */
export declare abstract class Either<L, R> implements Monad<R> {
    abstract map<S>(f: (a: R) => S): Either<L, S>;
    abstract fmap<S>(f: FunctorFunc<R, S>): Either<L, S>;
    abstract applies<S, T>(f: ApplicativeFunc<R, S, T>): (mb: Either<L, S>) => Either<L, T>;
    abstract mbind<S>(f: Either<L, FunctorFunc<R, S>>): Either<L, S>;
    abstract bimap<M, S>(lf: (l: L) => M, rf: (r: R) => S): Either<M, S>;
    abstract cata<V>(lf: (l: L) => V, rf: (r: R) => V): V;
    abstract flatten<M, S>(): Either<M, S>;
    abstract get(): R | never;
    abstract getOrElse(f: () => R): R;
    abstract getOrElseGet(right: R): R;
    abstract getOrThrow(err?: Error): R | never;
    abstract orElse(f: () => Either<L, R>): Either<L, R>;
    abstract toObject(): {
        left?: L;
        right?: R;
    };
    /**
     * Is this a Left.
     * @returns {boolean}
     */
    isLeft(): boolean;
    /**
     * Is this a Right.
     * @returns {boolean}
     */
    isRight(): boolean;
    /**
     * Returns an undefined Left value.
     * @returns {L}
     */
    getLeft(): L | never;
    /**
     * Returns an undefined Right value.
     * @returns {R}
     */
    getRight(): R | never;
    /**
     * Returns an Maybe.None<R>.
     * @returns {Maybe<R>}
     * @since 0.5.0
     */
    toMaybe(): Maybe<R>;
    /**
     * Returns an Option.None<R>.
     * @returns {Option<R>}
     * @deprecated
     */
    toOption(): Option<R>;
    /**
     * Tests equality of Eithers.
     * @params {Either<L, R>} other - the other Either to test
     * @returns {boolean}
     */
    equals(other: Either<L, R>): boolean;
    /**
     * Returns the Either as a JSON object.
     * @returns {{left?: L; right?: R}}
     */
    toJSON(): {
        left?: L;
        right?: R;
    };
    /**
     * Returns the Either as a string.
     * @returns {string} '{"right": R}' or '{"left": L}'
     */
    toString(): string;
}
/**
 * The Either namespace.
 */
export declare namespace Either {
    /**
     * Returns a new Either.Left<L, R> instance.
     * @returns {Either.Left<L, R>}
     */
    function left<L, R>(left: L): Left<L, R>;
    /**
     * Returns a new Either.Right<L, R> instance.
     * @returns {Either.Right<L, R>}
     */
    function right<L, R>(right: R): Right<L, R>;
    /**
     * Returns the singleton instance of Either.Left<void, void>.
     * @returns {Either.Left<void, void>}
     */
    function nothing(): Left<void, void>;
    /**
     * Iterates over an Array of Either values. If any Either.Left, the iteration
     * stops and a Maybe.Left is returned.
     * @since 0.5.0
     */
    function sequence<L, R>(...eithers: Array<Either<L, R>>): Either<L, R[]>;
    /**
     * Maps over an Array with the given function. If the function ever returns
     * an Either.Left, the iteration stops and a Either.Left is returned.
     * @since 0.5.0
     */
    function traverse<L, R, S>(f: (a: R) => Either<L, S>): (as: R[]) => Either<L, S[]>;
    /**
     * Lifts the given partialFunction into a total function that returns an Either result.
     * Basically, wraps the function in try/catch and return Either.Right() or Either.Left().
     * @param {(...args: any[]) => T} partialFunction - the function to lift
     * @returns (...args: any[]) => Either<Error, T>
     */
    function lift<Error, T>(partialFunction: (...args: any[]) => T): (...args: any[]) => Either<Error, T>;
    /**
     * The Either.Left<L, R> class.
     */
    class Left<L, R> extends Either<L, R> {
        private left;
        constructor(left: L);
        /**
         *
         * @since 0.5.0
         */
        map<S>(f: (a: R) => S): Left<L, S>;
        /**
         *
         * @since 0.5.0
         */
        fmap<S>(f: (a: R) => Either<L, S>): Left<L, S>;
        /**
         *
         * @since 0.5.0
         */
        applies<S, T>(f: (a: R) => (b: S) => Left<L, T>): (mb: Either<L, S>) => Left<L, T>;
        /**
         *
         * @since 0.5.0
         */
        mbind<S>(f: Either<L, (a: R) => Either<L, S>>): Left<L, S>;
        /**
         *
         * @since 0.5.0
         */
        bimap<M, S>(lf: (l: L) => M, rf: (r: R) => S): Left<M, S>;
        /**
         *
         * @since 0.5.0
         */
        cata<V>(lf: (l: L) => V, rf: (r: R) => V): V;
        /**
         *
         * @since 0.5.0
         */
        flatten(): Left<L, R>;
        /**
         * Returns that this is a Left.
         * @returns {boolean}
         */
        isLeft(): boolean;
        /**
         * Throws a ReferenceError.
         */
        get(): never;
        /**
         * Returns the Left value.
         * @returns {L}
         */
        getLeft(): L;
        /**
         * Returns the evaluated given function.
         * @param {() => R} f - the or else function to evaluate
         * @returns {R}
         */
        getOrElse(f: () => R): R;
        /**
         * Returns the given R value.
         * @param {R} right - the or else value
         * @returns {R}
         */
        getOrElseGet(right: R): R;
        /**
         * Throws a ReferenceError or the given Error.
         * @param {Error} [err] - the optional Error to throw
         * @returns {R}
         */
        getOrThrow(err?: Error): never;
        /**
         * Returns the evaluated function.
         * @param {() => Either<L, R>} f - the or else function to evaluate
         * @returns {Either<L, R>}
         */
        orElse(f: () => Either<L, R>): Either<L, R>;
        /**
         * Returs the Either as a plain-old JS object.
         * @returns {{left: L}}
         */
        toObject(): {
            left?: L;
            right?: R;
        };
    }
    /**
     * The Either.Right<L, R> class.
     */
    class Right<L, R> extends Either<L, R> {
        private right;
        constructor(right: R);
        /**
         *
         * @since 0.5.0
         */
        map<S>(f: (a: R) => S): Right<L, S>;
        /**
         *
         * @since 0.5.0
         */
        fmap<S>(f: FunctorFunc<R, S>): Either<L, S>;
        /**
         *
         * @since 0.5.0
         */
        applies<S, T>(f: ApplicativeFunc<R, S, T>): (eb: Either<L, S>) => Either<L, T>;
        /**
         *
         * @since 0.5.0
         */
        mbind<S>(f: Either<L, FunctorFunc<R, S>>): Either<L, S>;
        /**
         *
         * @since 0.5.0
         */
        bimap<M, S>(lf: (l: L) => M, rf: (r: R) => S): Right<M, S>;
        /**
         *
         * @since 0.5.0
         */
        cata<V>(lf: (l: L) => V, rf: (r: R) => V): V;
        /**
         *
         * @since 0.5.0
         */
        flatten<M, S>(): Either<M, S>;
        /**
         * This is a Right.
         * @returns {boolean}
         */
        isRight(): boolean;
        /**
         * Returns the Right value.
         * @returns {R}
         */
        get(): R;
        /**
         * Returns the Right value.
         * @returns {R}
         */
        getRight(): R;
        /**
         * Returns the Right value.
         * @param {() => R} f - the function to evaluate if Left
         * @returns {R}
         */
        getOrElse(f: () => R): R;
        /**
         * Returns the Right value.
         * @param {R} right - the value to return if Left
         * @return {R}
         */
        getOrElseGet(right: R): R;
        /**
         * Returns the Right value.
         * @returns {R}
         */
        getOrThrow(): R;
        /**
         * Returns this Right.
         * @param {Either<L, R>} f - the function to evaluate if Left
         * @returns {Either<L, R>}
         */
        orElse(f: () => Either<L, R>): Either<L, R>;
        /**
         * Returns an Maybe.Just<R>.
         * @returns {Maybe<R>}
         * @since 0.5.0
         */
        toMaybe(): Maybe<R>;
        /**
         * Returns an Option.Some<R>.
         * @returns {Option<R>}
         * @deprecated
         */
        toOption(): Option<R>;
        /**
         * Returs the Either as a plain-old JS object.
         * @returns {{left: L | undefined; right: R | undefined;}}
         */
        toObject(): {
            left?: L;
            right?: R;
        };
    }
}
