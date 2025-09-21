import { Maybe } from "./maybe.js";
import { Option } from "./option.js";
/**
 * The Either<L, R> abstract class.
 */
export class Either {
    /**
     * Is this a Left.
     * @returns {boolean}
     */
    isLeft() { return false; }
    /**
     * Is this a Right.
     * @returns {boolean}
     */
    isRight() { return false; }
    /**
     * Returns an undefined Left value.
     * @returns {L}
     */
    getLeft() { throw new ReferenceError("This either is Right."); }
    /**
     * Returns an undefined Right value.
     * @returns {R}
     */
    getRight() { throw new ReferenceError("This either is Left."); }
    /**
     * Returns an Maybe.None<R>.
     * @returns {Maybe<R>}
     * @since 0.5.0
     */
    toMaybe() {
        return Maybe.none();
    }
    /**
     * Returns an Option.None<R>.
     * @returns {Option<R>}
     * @deprecated
     */
    toOption() {
        return Option.none();
    }
    /**
     * Tests equality of Eithers.
     * @params {Either<L, R>} other - the other Either to test
     * @returns {boolean}
     */
    equals(other) {
        if (this === other)
            return true;
        if (!other || other instanceof Either === false)
            return false;
        if (this.isRight() !== other.isRight())
            return false;
        if (this.isRight() && this.getRight() === other.getRight())
            return true;
        if (this.getLeft() && this.getLeft() === other.getLeft())
            return true;
        return false;
    }
    /**
     * Returns the Either as a JSON object.
     * @returns {{left?: L; right?: R}}
     */
    toJSON() {
        return this.toObject();
    }
    /**
     * Returns the Either as a string.
     * @returns {string} '{"right": R}' or '{"left": L}'
     */
    toString() {
        return JSON.stringify(this.toJSON());
    }
}
/**
 * The Either namespace.
 */
(function (Either) {
    /**
     * Returns a new Either.Left<L, R> instance.
     * @returns {Either.Left<L, R>}
     */
    function left(left) {
        return new Left(left);
    }
    Either.left = left;
    /**
     * Returns a new Either.Right<L, R> instance.
     * @returns {Either.Right<L, R>}
     */
    function right(right) {
        return new Right(right);
    }
    Either.right = right;
    /**
     * Returns the singleton instance of Either.Left<void, void>.
     * @returns {Either.Left<void, void>}
     */
    function nothing() {
        return nothingEither;
    }
    Either.nothing = nothing;
    /**
     * Iterates over an Array of Either values. If any Either.Left, the iteration
     * stops and a Maybe.Left is returned.
     * @since 0.5.0
     */
    function sequence(...eithers) {
        const arr = [];
        for (const i in eithers) {
            if (eithers[i].isLeft()) {
                return new Left(eithers[i].getLeft());
            }
            arr[i] = eithers[i].get();
        }
        return new Right(arr);
    }
    Either.sequence = sequence;
    /**
     * Maps over an Array with the given function. If the function ever returns
     * an Either.Left, the iteration stops and a Either.Left is returned.
     * @since 0.5.0
     */
    function traverse(f) {
        return function (as) {
            const arr = [];
            for (const i in as) {
                const r = f(as[i]);
                if (r.isLeft()) {
                    return new Left(r.getLeft());
                }
                arr[i] = r.get();
            }
            return new Right(arr);
        };
    }
    Either.traverse = traverse;
    /**
     * Lifts the given partialFunction into a total function that returns an Either result.
     * Basically, wraps the function in try/catch and return Either.Right() or Either.Left().
     * @param {(...args: any[]) => T} partialFunction - the function to lift
     * @returns (...args: any[]) => Either<Error, T>
     */
    function lift(partialFunction) {
        return (...args) => {
            try {
                return Either.right(partialFunction.apply(partialFunction, args));
            }
            catch (err) {
                return Either.left(err);
            }
        };
    }
    Either.lift = lift;
    /**
     * The Either.Left<L, R> class.
     */
    class Left extends Either {
        left;
        constructor(left) {
            super();
            this.left = left;
        }
        /**
         *
         * @since 0.5.0
         */
        map(f) {
            return new Left(this.left);
        }
        /**
         *
         * @since 0.5.0
         */
        fmap(f) {
            return new Left(this.left);
        }
        /**
         *
         * @since 0.5.0
         */
        applies(f) {
            return function (mb) {
                return new Left(this.left);
            };
        }
        /**
         *
         * @since 0.5.0
         */
        mbind(f) {
            return new Left(this.left);
        }
        /**
         *
         * @since 0.5.0
         */
        bimap(lf, rf) {
            return new Left(lf(this.left));
        }
        /**
         *
         * @since 0.5.0
         */
        cata(lf, rf) {
            return lf(this.left);
        }
        /**
         *
         * @since 0.5.0
         */
        flatten() {
            return this;
        }
        /**
         * Returns that this is a Left.
         * @returns {boolean}
         */
        isLeft() {
            return true;
        }
        /**
         * Throws a ReferenceError.
         */
        get() {
            throw new ReferenceError("This either is Left.");
        }
        /**
         * Returns the Left value.
         * @returns {L}
         */
        getLeft() {
            return this.left;
        }
        /**
         * Returns the evaluated given function.
         * @param {() => R} f - the or else function to evaluate
         * @returns {R}
         */
        getOrElse(f) {
            return f();
        }
        /**
         * Returns the given R value.
         * @param {R} right - the or else value
         * @returns {R}
         */
        getOrElseGet(right) {
            return right;
        }
        /**
         * Throws a ReferenceError or the given Error.
         * @param {Error} [err] - the optional Error to throw
         * @returns {R}
         */
        getOrThrow(err) {
            throw err || new ReferenceError("This either is Left.");
        }
        /**
         * Returns the evaluated function.
         * @param {() => Either<L, R>} f - the or else function to evaluate
         * @returns {Either<L, R>}
         */
        orElse(f) {
            return f();
        }
        /**
         * Returs the Either as a plain-old JS object.
         * @returns {{left: L}}
         */
        toObject() {
            return { left: this.left };
        }
    }
    Either.Left = Left;
    /**
     * The Either.Right<L, R> class.
     */
    class Right extends Either {
        right;
        constructor(right) {
            super();
            this.right = right;
        }
        /**
         *
         * @since 0.5.0
         */
        map(f) {
            return new Right(f(this.right));
        }
        /**
         *
         * @since 0.5.0
         */
        fmap(f) {
            return f(this.right);
        }
        /**
         *
         * @since 0.5.0
         */
        applies(f) {
            return eb => eb.fmap(f(this.right));
        }
        /**
         *
         * @since 0.5.0
         */
        mbind(f) {
            return this.applies(a => (b) => b(a))(f);
        }
        /**
         *
         * @since 0.5.0
         */
        bimap(lf, rf) {
            return new Right(rf(this.right));
        }
        /**
         *
         * @since 0.5.0
         */
        cata(lf, rf) {
            return rf(this.right);
        }
        /**
         *
         * @since 0.5.0
         */
        flatten() {
            const val = this.get();
            if (val instanceof Either) {
                return val.flatten();
            }
            else {
                return this;
            }
        }
        /**
         * This is a Right.
         * @returns {boolean}
         */
        isRight() {
            return true;
        }
        /**
         * Returns the Right value.
         * @returns {R}
         */
        get() {
            return this.right;
        }
        /**
         * Returns the Right value.
         * @returns {R}
         */
        getRight() {
            return this.right;
        }
        /**
         * Returns the Right value.
         * @param {() => R} f - the function to evaluate if Left
         * @returns {R}
         */
        getOrElse(f) {
            return this.right;
        }
        /**
         * Returns the Right value.
         * @param {R} right - the value to return if Left
         * @return {R}
         */
        getOrElseGet(right) {
            return this.right;
        }
        /**
         * Returns the Right value.
         * @returns {R}
         */
        getOrThrow() {
            return this.right;
        }
        /**
         * Returns this Right.
         * @param {Either<L, R>} f - the function to evaluate if Left
         * @returns {Either<L, R>}
         */
        orElse(f) {
            return this;
        }
        /**
         * Returns an Maybe.Just<R>.
         * @returns {Maybe<R>}
         * @since 0.5.0
         */
        toMaybe() {
            return Maybe.just(this.right);
        }
        /**
         * Returns an Option.Some<R>.
         * @returns {Option<R>}
         * @deprecated
         */
        toOption() {
            return Option.some(this.right);
        }
        /**
         * Returs the Either as a plain-old JS object.
         * @returns {{left: L | undefined; right: R | undefined;}}
         */
        toObject() {
            return { right: this.right };
        }
    }
    Either.Right = Right;
})(Either || (Either = {}));
const nothingEither = new Either.Left(void (0));
