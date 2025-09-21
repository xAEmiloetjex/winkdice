import { Either } from "./either.js";
/**
 * The Option<T> abstract class.
 * @deprecated
 */
export class Option {
    /**
     * Returns that this is None.
     * returns {boolean}
     */
    isDefined() {
        return false;
    }
    /**
     * Returns that this is Some.
     * @returns {boolean}
     */
    isEmpty() {
        return false;
    }
    /**
     * Throws a ReferenceError.
     */
    get() {
        throw new ReferenceError("This is option is None.");
    }
    /**
     * Returns a Either.Left<Error, T>.
     * @returns {Either.Left<Error, T>}
     */
    toEither() {
        return Either.left(new ReferenceError("This either is Left."));
    }
    /**
     * Tests equality of Options.
     * @param {Option<T>} other - the other Option to test
     * @returns {boolean}
     */
    equals(other) {
        if (!other || other instanceof Option === false)
            return false;
        if (this === other)
            return true;
        if (this.isDefined() === false && other.isDefined() === false)
            return true;
        return this.isDefined() === other.isDefined() && this.get() === other.get();
    }
    /**
     * Returns the Option as a JSON object.
     * @returns {{some: T | null}}
     */
    toJSON() {
        return this.toObject();
    }
    /**
     * Returns the Option as a string.
     * @returns {string} '{"some": T | null}'
     */
    toString() {
        return JSON.stringify(this.toJSON());
    }
}
/**
 * The Option namespace.
 * @deprecated
 */
(function (Option) {
    /**
     * Returns a new Option.Some<T> instance.
     * @returns {Option.some<T>}
     */
    function some(value) {
        return new Some(value);
    }
    Option.some = some;
    /**
     * Returns a new Option.None<T> instance.
     * @returns {Option.None<T>}
     */
    function none() {
        return new None();
    }
    Option.none = none;
    /**
     * Returns the singleton instance of Option.None<void>.
     * @returns {Option.None<void>}
     */
    function nothing() {
        return nothingOption;
    }
    Option.nothing = nothing;
    /**
     * Lifts the given partialFunction into a total function that returns an Option result.
     * Basically, wraps the function in try/catch and returns Option.Some() or Option.None().
     * @param {(...args: any[]) => T} partialFunction - the function to lift
     * @returns (...args: any[]) => Option<T>
     */
    function lift(partialFunction) {
        return (...args) => {
            try {
                return Option.some(partialFunction.apply(partialFunction, args));
            }
            catch (err) {
                return Option.none();
            }
        };
    }
    Option.lift = lift;
    /**
     * The Option.None<T> class.
     * @deprecated
     */
    class None extends Option {
        constructor() {
            super();
        }
        /**
         * Returns that this option is empty.
         * @returns {boolean}
         */
        isEmpty() {
            return true;
        }
        /**
         * Returns the evaluated given function.
         * @param {() => T} f - the or else function to evaluate
         * @returns {T}
         */
        getOrElse(f) {
            return f();
        }
        /**
         * Returns the T value.
         * @param {T} value - the or else value
         * @returns {T}
         */
        getOrElseGet(value) {
            return value;
        }
        /**
         * Throws a ReferenceError or the given Error.
         * @param {Error} [err] - the optional Error to throw
         * @returns {T}
         */
        getOrThrow(err) {
            throw err || new ReferenceError("This option is None.");
        }
        /**
         * Returns the evaluated function.
         * @param {() => Option<T>} f - the or else function to evaluate
         * @returns {Option<T>}
         */
        orElse(f) {
            return f();
        }
        /**
         * Returns an Either.Left<Error, T>.
         */
        toEither() {
            return Either.left(new ReferenceError("This either is Left."));
        }
        /**
         * Returns the Option as a plain-old JS object.
         * @returns {{some: null}}
         */
        toObject() {
            return { some: null };
        }
    }
    Option.None = None;
    /**
     * The Option.Some<T> class.
     * @deprecated
     */
    class Some extends Option {
        value;
        constructor(value) {
            super();
            this.value = value;
        }
        /**
         * Returns that this option is Option.Some<T>.
         * @returns {boolean}
         */
        isDefined() {
            return true;
        }
        /**
         * Returns the Some value.
         * @returns {T}
         */
        get() {
            return this.value;
        }
        /**
         * Returns the Some value.
         * @param {() => T} f - the function to evaluate if Left
         * @returns {T}
         */
        getOrElse(value) {
            return this.value;
        }
        /**
         * Returns the Some value.
         * @param {T} value - the value to return if None
         * @return {T}
         */
        getOrElseGet(value) {
            return this.value;
        }
        /**
         * Returns the Some value.
         * @returns {T}
         */
        getOrThrow(err) {
            return this.value;
        }
        /**
         * Returns this Some value.
         * @param {Option<T>} f - the function to evaluate if Left
         */
        orElse(o) {
            return this;
        }
        /**
         * Returns an Either.Right<Error, T>.
         * @returns {Either.Right<Error, T>}
         */
        toEither() {
            return Either.right(this.value);
        }
        /**
         * Returns the Option as a plain-old JS object.
         * @returns {{some: T}}
         */
        toObject() {
            return { some: this.value };
        }
    }
    Option.Some = Some;
    const nothingOption = new None();
})(Option || (Option = {}));
