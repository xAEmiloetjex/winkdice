import { Either } from "./either.js";
/**
 * The Option<T> abstract class.
 * @deprecated
 */
export declare abstract class Option<T> {
    abstract getOrElse(f: () => T): T;
    abstract getOrElseGet(value: T): T;
    abstract getOrThrow(err: Error): T;
    abstract orElse(o: () => Option<T>): Option<T>;
    abstract toObject(): {
        some: T | null;
    };
    /**
     * Returns that this is None.
     * returns {boolean}
     */
    isDefined(): boolean;
    /**
     * Returns that this is Some.
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * Throws a ReferenceError.
     */
    get(): T;
    /**
     * Returns a Either.Left<Error, T>.
     * @returns {Either.Left<Error, T>}
     */
    toEither(): Either<Error, T>;
    /**
     * Tests equality of Options.
     * @param {Option<T>} other - the other Option to test
     * @returns {boolean}
     */
    equals(other: Option<T>): boolean;
    /**
     * Returns the Option as a JSON object.
     * @returns {{some: T | null}}
     */
    toJSON(): {
        some: T | null;
    };
    /**
     * Returns the Option as a string.
     * @returns {string} '{"some": T | null}'
     */
    toString(): string;
}
/**
 * The Option namespace.
 * @deprecated
 */
export declare namespace Option {
    /**
     * Returns a new Option.Some<T> instance.
     * @returns {Option.some<T>}
     */
    function some<T>(value: T): Some<T>;
    /**
     * Returns a new Option.None<T> instance.
     * @returns {Option.None<T>}
     */
    function none<T>(): None<T>;
    /**
     * Returns the singleton instance of Option.None<void>.
     * @returns {Option.None<void>}
     */
    function nothing(): None<void>;
    /**
     * Lifts the given partialFunction into a total function that returns an Option result.
     * Basically, wraps the function in try/catch and returns Option.Some() or Option.None().
     * @param {(...args: any[]) => T} partialFunction - the function to lift
     * @returns (...args: any[]) => Option<T>
     */
    function lift<T>(partialFunction: (...args: any[]) => T): (...args: any[]) => Option<T>;
    /**
     * The Option.None<T> class.
     * @deprecated
     */
    class None<T> extends Option<T> {
        constructor();
        /**
         * Returns that this option is empty.
         * @returns {boolean}
         */
        isEmpty(): boolean;
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
        getOrThrow(err?: Error): T;
        /**
         * Returns the evaluated function.
         * @param {() => Option<T>} f - the or else function to evaluate
         * @returns {Option<T>}
         */
        orElse(f: () => Option<T>): Option<T>;
        /**
         * Returns an Either.Left<Error, T>.
         */
        toEither(): Either.Left<Error, T>;
        /**
         * Returns the Option as a plain-old JS object.
         * @returns {{some: null}}
         */
        toObject(): {
            some: null;
        };
    }
    /**
     * The Option.Some<T> class.
     * @deprecated
     */
    class Some<T> extends Option<T> {
        private value;
        constructor(value: T);
        /**
         * Returns that this option is Option.Some<T>.
         * @returns {boolean}
         */
        isDefined(): boolean;
        /**
         * Returns the Some value.
         * @returns {T}
         */
        get(): T;
        /**
         * Returns the Some value.
         * @param {() => T} f - the function to evaluate if Left
         * @returns {T}
         */
        getOrElse(value: () => T): T;
        /**
         * Returns the Some value.
         * @param {T} value - the value to return if None
         * @return {T}
         */
        getOrElseGet(value: T): T;
        /**
         * Returns the Some value.
         * @returns {T}
         */
        getOrThrow(err: Error): T;
        /**
         * Returns this Some value.
         * @param {Option<T>} f - the function to evaluate if Left
         */
        orElse(o: () => Option<T>): Option<T>;
        /**
         * Returns an Either.Right<Error, T>.
         * @returns {Either.Right<Error, T>}
         */
        toEither(): Either.Right<Error, T>;
        /**
         * Returns the Option as a plain-old JS object.
         * @returns {{some: T}}
         */
        toObject(): {
            some: T;
        };
    }
}
