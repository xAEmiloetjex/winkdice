import { Monad, FunctorFunc, ApplicativeFunc } from "./interfaces.js";
import { Either } from "./either.js";
/**
 * The Maybe<T> abstract class.
 * @since 0.5.0
 */
export declare abstract class Maybe<T> implements Monad<T> {
    abstract map<U>(f: (a: T) => U): Maybe<U>;
    abstract fmap<U>(f: FunctorFunc<T, U>): Maybe<U>;
    abstract applies<U, V>(f: ApplicativeFunc<T, U, V>): (mb: Maybe<U>) => Maybe<V>;
    abstract mbind<U>(f: Maybe<FunctorFunc<T, U>>): Maybe<U>;
    abstract flatten<U>(): Maybe<U>;
    abstract get(): T | never;
    abstract getOrElse(f: () => T): T;
    abstract getOrElseGet(value: T): T;
    abstract getOrThrow(err?: Error): T | never;
    abstract orElse(o: () => Maybe<T>): Maybe<T>;
    abstract toObject(): {
        just: T | null;
    };
    /**
     * Returns that this is None.
     * returns {boolean}
     */
    isDefined(): boolean;
    /**
     * Returns that this is Just.
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * Returns a Either.Left<Error, T>.
     * @returns {Either.Left<Error, T>}
     */
    toEither(): Either<Error, T>;
    /**
     * Tests equality of Maybes.
     * @param {Maybe<T>} other - the other Maybe to test
     * @returns {boolean}
     */
    equals(other: Maybe<T>): boolean;
    /**
     * Returns the Maybe as a JSON object.
     * @returns {{just: T | null}}
     */
    toJSON(): {
        just: T | null;
    };
    /**
     * Returns the Maybe as a string.
     * @returns {string} '{"just": T | null}'
     */
    toString(): string;
}
/**
 * The Maybe namespace.
 * @since 0.5.0
 */
export declare namespace Maybe {
    /**
     * Returns a new Maybe.Just<T> instance.
     * @returns {Maybe.just<T>}
     */
    function just<T>(value: T): Just<T>;
    /**
     * Returns a new Maybe.None<T> instance.
     * @returns {Maybe.None<T>}
     */
    function none<T>(): None<T>;
    /**
     * Returns the singleton instance of Maybe.None<void>.
     * @returns {Maybe.None<void>}
     */
    function nothing(): None<void>;
    /**
     * Returns a Maybe.Just<T> instance, or Maybe.None<T> for null and undefined.
     * @returns {Maybe<T>}
     */
    function fromNull<T>(value: T | undefined | null): Maybe<T>;
    /**
     * Iterates over an Array of Maybe values. If any Maybe.None, the iteration
     * stops and a Maybe.None is returned.
     * @since 0.5.0
     */
    function sequence<T>(...maybes: Array<Maybe<T>>): Maybe<T[]>;
    /**
     * Maps over an Array with the given function. If the function ever returns
     * a Maybe.None, the iteration stops and a Maybe.None is returned.
     * @since 0.5.0
     */
    function traverse<T, U>(f: (a: T) => Maybe<U>): (as: T[]) => Maybe<U[]>;
    /**
     * Lifts the given partialFunction into a total function that returns an Maybe result.
     * Basically, wraps the function in try/catch and returns Maybe.Just() or Maybe.None().
     * @param {(...args: any[]) => T} partialFunction - the function to lift
     * @returns (...args: any[]) => Maybe<T>
     */
    function lift<T>(partialFunction: (...args: any[]) => T): (...args: any[]) => Maybe<T>;
    /**
     * The Maybe.None<T> class.
     * @since 0.5.0
     */
    class None<T> extends Maybe<T> {
        constructor();
        /**
         *
         * @since 0.5.0
         */
        map<U>(f: (a: T) => U): None<U>;
        /**
         *
         * @since 0.5.0
         */
        fmap<U>(f: (a: T) => Maybe<U>): None<U>;
        /**
         *
         * @since 0.5.0
         */
        applies<U, V>(f: (a: T) => (b: U) => Maybe<V>): (mb: Maybe<U>) => None<V>;
        /**
         *
         * @since 0.5.0
         */
        mbind<U>(f: Maybe<(a: T) => Maybe<U>>): None<U>;
        /**
         *
         * @since 0.5.0
         */
        flatten(): None<T>;
        /**
         * Returns that this option is empty.
         * @returns {boolean}
         */
        isEmpty(): boolean;
        /**
         * Throws a ReferenceError.
         */
        get(): never;
        /**
         * Returns the evaluated given function.
         * @param {() => T} f - the or else function to evaluate
         * @returns {T}
         */
        getOrElse(f: () => T): T;
        /**
         * Returns the T value.
         * @param {T} value - the or else value
         * @returns {T}
         */
        getOrElseGet(value: T): T;
        /**
         * Throws a ReferenceError or the given Error.
         * @param {Error} [err] - the optional Error to throw
         * @returns {T}
         */
        getOrThrow(err?: Error): never;
        /**
         * Returns the evaluated function.
         * @param {() => Maybe<T>} f - the or else function to evaluate
         * @returns {Maybe<T>}
         */
        orElse(f: () => Maybe<T>): Maybe<T>;
        /**
         * Returns an Either.Left<Error, T>.
         */
        toEither(): Either.Left<Error, T>;
        /**
         * Returns the Maybe as a plain-old JS object.
         * @returns {{just: null}}
         */
        toObject(): {
            just: null;
        };
    }
    /**
     * The Maybe.Just<T> class.
     * @since 0.5.0
     */
    class Just<T> extends Maybe<T> {
        private value;
        constructor(value: T);
        /**
         *
         * @since 0.5.0
         */
        map<U>(f: (a: T) => U): Just<U>;
        /**
         *
         * @since 0.5.0
         */
        fmap<U>(f: (a: T) => Maybe<U>): Maybe<U>;
        /**
         *
         * @since 0.5.0
         */
        applies<U, V>(f: (a: T) => (b: U) => Maybe<V>): (mb: Maybe<U>) => Maybe<V>;
        /**
         *
         * @since 0.5.0
         */
        mbind<U>(f: Maybe<(a: T) => Maybe<U>>): Maybe<U>;
        /**
         * If this Maybe is a Maybe of a Maybe, etc., then it will unwrap to the last Maybe.
         * @since 0.5.0
         */
        flatten<U>(): Maybe<U>;
        /**
         * Returns that this option is Maybe.Just<T>.
         * @returns {boolean}
         */
        isDefined(): boolean;
        /**
         * Returns the Just value.
         * @returns {T}
         */
        get(): T;
        /**
         * Returns the Just value.
         * @param {() => T} f - the function to evaluate if Left
         * @returns {T}
         */
        getOrElse(value: () => T): T;
        /**
         * Returns the Just value.
         * @param {T} value - the value to return if None
         * @return {T}
         */
        getOrElseGet(value: T): T;
        /**
         * Returns the Just value.
         * @returns {T}
         */
        getOrThrow(err?: Error): T;
        /**
         * Returns this Just value.
         * @param {Maybe<T>} f - the function to evaluate if Left
         */
        orElse(o: () => Maybe<T>): Maybe<T>;
        /**
         * Returns an Either.Right<Error, T>.
         * @returns {Either.Right<Error, T>}
         */
        toEither(): Either.Right<Error, T>;
        /**
         * Returns the Maybe as a plain-old JS object.
         * @returns {{just: T}}
         */
        toObject(): {
            just: T;
        };
    }
}
