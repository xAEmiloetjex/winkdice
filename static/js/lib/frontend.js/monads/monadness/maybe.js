import { Either } from "./either.js";
/**
 * The Maybe<T> abstract class.
 * @since 0.5.0
 */
export class Maybe {
    /**
     * Returns that this is None.
     * returns {boolean}
     */
    isDefined() {
        return false;
    }
    /**
     * Returns that this is Just.
     * @returns {boolean}
     */
    isEmpty() {
        return false;
    }
    /**
     * Returns a Either.Left<Error, T>.
     * @returns {Either.Left<Error, T>}
     */
    toEither() {
        return Either.left(new ReferenceError("This either is Left."));
    }
    /**
     * Tests equality of Maybes.
     * @param {Maybe<T>} other - the other Maybe to test
     * @returns {boolean}
     */
    equals(other) {
        if (!other || other instanceof Maybe === false)
            return false;
        if (this === other)
            return true;
        if (this.isDefined() === false && other.isDefined() === false)
            return true;
        return this.isDefined() === other.isDefined() && this.get() === other.get();
    }
    /**
     * Returns the Maybe as a JSON object.
     * @returns {{just: T | null}}
     */
    toJSON() {
        return this.toObject();
    }
    /**
     * Returns the Maybe as a string.
     * @returns {string} '{"just": T | null}'
     */
    toString() {
        return JSON.stringify(this.toJSON());
    }
}
/**
 * The Maybe namespace.
 * @since 0.5.0
 */
(function (Maybe) {
    /**
     * Returns a new Maybe.Just<T> instance.
     * @returns {Maybe.just<T>}
     */
    function just(value) {
        return new Just(value);
    }
    Maybe.just = just;
    /**
     * Returns a new Maybe.None<T> instance.
     * @returns {Maybe.None<T>}
     */
    function none() {
        return new None();
    }
    Maybe.none = none;
    /**
     * Returns the singleton instance of Maybe.None<void>.
     * @returns {Maybe.None<void>}
     */
    function nothing() {
        return nothingMaybe;
    }
    Maybe.nothing = nothing;
    /**
     * Returns a Maybe.Just<T> instance, or Maybe.None<T> for null and undefined.
     * @returns {Maybe<T>}
     */
    function fromNull(value) {
        if (value === null || value === undefined) {
            return Maybe.none();
        }
        else {
            return Maybe.just(value);
        }
    }
    Maybe.fromNull = fromNull;
    /**
     * Iterates over an Array of Maybe values. If any Maybe.None, the iteration
     * stops and a Maybe.None is returned.
     * @since 0.5.0
     */
    function sequence(...maybes) {
        const arr = [];
        for (const i in maybes) {
            if (maybes[i].isEmpty()) {
                return new None();
            }
            arr[i] = maybes[i].get();
        }
        return new Just(arr);
    }
    Maybe.sequence = sequence;
    /**
     * Maps over an Array with the given function. If the function ever returns
     * a Maybe.None, the iteration stops and a Maybe.None is returned.
     * @since 0.5.0
     */
    function traverse(f) {
        return function (as) {
            const arr = [];
            for (const i in as) {
                const r = f(as[i]);
                if (r.isEmpty()) {
                    return new None();
                }
                arr[i] = r.get();
            }
            return new Just(arr);
        };
    }
    Maybe.traverse = traverse;
    /**
     * Lifts the given partialFunction into a total function that returns an Maybe result.
     * Basically, wraps the function in try/catch and returns Maybe.Just() or Maybe.None().
     * @param {(...args: any[]) => T} partialFunction - the function to lift
     * @returns (...args: any[]) => Maybe<T>
     */
    function lift(partialFunction) {
        return (...args) => {
            try {
                return Maybe.just(partialFunction.apply(partialFunction, args));
            }
            catch (err) {
                return Maybe.none();
            }
        };
    }
    Maybe.lift = lift;
    /**
     * The Maybe.None<T> class.
     * @since 0.5.0
     */
    class None extends Maybe {
        constructor() {
            super();
        }
        /**
         *
         * @since 0.5.0
         */
        map(f) {
            return new None();
        }
        /**
         *
         * @since 0.5.0
         */
        fmap(f) {
            return new None();
        }
        /**
         *
         * @since 0.5.0
         */
        applies(f) {
            return function (mb) {
                return new None();
            };
        }
        /**
         *
         * @since 0.5.0
         */
        mbind(f) {
            return new None();
        }
        /**
         *
         * @since 0.5.0
         */
        flatten() {
            return this;
        }
        /**
         * Returns that this option is empty.
         * @returns {boolean}
         */
        isEmpty() {
            return true;
        }
        /**
         * Throws a ReferenceError.
         */
        get() {
            throw new ReferenceError("This is option is None.");
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
         * @param {() => Maybe<T>} f - the or else function to evaluate
         * @returns {Maybe<T>}
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
         * Returns the Maybe as a plain-old JS object.
         * @returns {{just: null}}
         */
        toObject() {
            return { just: null };
        }
    }
    Maybe.None = None;
    /**
     * The Maybe.Just<T> class.
     * @since 0.5.0
     */
    class Just extends Maybe {
        value;
        constructor(value) {
            super();
            this.value = value;
        }
        /**
         *
         * @since 0.5.0
         */
        map(f) {
            return new Just(f(this.value));
        }
        /**
         *
         * @since 0.5.0
         */
        fmap(f) {
            return f(this.value);
        }
        /**
         *
         * @since 0.5.0
         */
        applies(f) {
            return mb => mb.fmap(f(this.value));
        }
        /**
         *
         * @since 0.5.0
         */
        mbind(f) {
            return this.applies(a => (b) => b(a))(f);
        }
        /**
         * If this Maybe is a Maybe of a Maybe, etc., then it will unwrap to the last Maybe.
         * @since 0.5.0
         */
        flatten() {
            const val = this.get();
            if (val instanceof Maybe) {
                return val.flatten();
            }
            else {
                return this;
            }
        }
        /**
         * Returns that this option is Maybe.Just<T>.
         * @returns {boolean}
         */
        isDefined() {
            return true;
        }
        /**
         * Returns the Just value.
         * @returns {T}
         */
        get() {
            return this.value;
        }
        /**
         * Returns the Just value.
         * @param {() => T} f - the function to evaluate if Left
         * @returns {T}
         */
        getOrElse(value) {
            return this.value;
        }
        /**
         * Returns the Just value.
         * @param {T} value - the value to return if None
         * @return {T}
         */
        getOrElseGet(value) {
            return this.value;
        }
        /**
         * Returns the Just value.
         * @returns {T}
         */
        getOrThrow(err) {
            return this.value;
        }
        /**
         * Returns this Just value.
         * @param {Maybe<T>} f - the function to evaluate if Left
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
         * Returns the Maybe as a plain-old JS object.
         * @returns {{just: T}}
         */
        toObject() {
            return { just: this.value };
        }
    }
    Maybe.Just = Just;
    const nothingMaybe = new None();
})(Maybe || (Maybe = {}));
