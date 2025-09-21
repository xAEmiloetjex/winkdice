/**
 * Created by Bruno Grieder.
 */
import { option } from './Option.js';
export class Try {
    static from(value) {
        if (typeof value === 'function') {
            return new Try(value);
        }
        return new Try(() => value);
    }
    _computation;
    _result;
    _failed;
    constructor(computation) {
        this._computation = computation;
        this._result = void 0;
        this._failed = false;
    }
    compute() {
        return option(this._result).getOrElse(() => {
            try {
                this._result = this._computation();
                this._failed = false;
            }
            catch (e) {
                this._result = e;
                this._failed = true;
            }
            return this._result;
        });
    }
    computeThrow() {
        const res = this.compute();
        if (this._failed) {
            throw res;
        }
        return res;
    }
    /**
     * Applies the given mapper to this computation if it is a Success and the filter is satisfied
     */
    collect(filter) {
        return (mapper) => this.filter(filter).map(mapper);
    }
    /**
     * Inverts this Try.
     */
    get failed() {
        const res = this.compute();
        if (this._failed) {
            return new Try(() => res);
        }
        return new Try(() => new Error(res.toString()));
    }
    /**
     * Converts this to a Failure if the predicate is not satisfied.
     */
    filter(f) {
        const computeThrow = this.computeThrow.bind(this);
        return new Try(() => {
            if (f()) {
                return computeThrow();
            }
            throw new Error("Filter not statisfied");
        });
    }
    /**
     * Returns the given function applied to the value from this Success or returns this if this is a Failure.
     */
    flatMap(f) {
        return this.map(f).flatten();
    }
    /**
     * Transforms a nested Try, ie, a Try of type Try[Try[T]], into an un-nested Try, ie, a Try of type Try[T].
     */
    flatten() {
        return new Try(() => {
            const res = this.compute();
            if (this._failed) {
                throw res;
            }
            if (res instanceof Try) {
                return res.get;
            }
            return res;
        });
    }
    /**
     * Applies ffailure if this is a Failure or fsuccess if this is a Success.
     */
    fold(ffailure, fsuccess) {
        const res = this.compute();
        if (this._failed) {
            return ffailure(res);
        }
        return fsuccess(res);
    }
    /**
     * Applies the given function f if this is a Success, otherwise returns Unit if this is a Failure.
     */
    foreach(f) {
        const res = this.compute();
        if (this._failed) {
            return;
        }
        f(res);
    }
    /**
     * Returns the value from this Success or throws the exception if this is a Failure.
     */
    get get() {
        const res = this.compute();
        if (this._failed) {
            throw res;
        }
        return res;
    }
    /**
     * Returns the value from this Success or the given default argument if this is a Failure.
     */
    getOrElse(elseVal) {
        const res = this.compute();
        if (this._failed) {
            return elseVal();
        }
        return res;
    }
    /**
     * Returns true if the Try is a Failure, false otherwise.
     */
    get isFailure() {
        return option(this._result).map(() => this._failed).getOrElse(() => {
            this.compute();
            return this._failed;
        });
    }
    /**
     * Returns true if the Try is a Success, false otherwise.
     * Calling this method will compute the function if not already computed
     */
    get isSuccess() {
        return !this.isFailure;
    }
    /**
     * Maps the given function to the value from this Success or returns this if this is a Failure.
     */
    map(f) {
        return new Try(() => f(this.get));
    }
    /**
     * Returns this Try if it's a Success or the given default argument if this is a Failure.
     */
    orElse(f) {
        return new Try(() => {
            const res = this.compute();
            if (this._failed) {
                return f().get;
            }
            return res;
        });
    }
    /**
     * Applies the given function f if this is a Failure, otherwise returns this if this is a Success.
     */
    recover(fn) {
        return new Try(() => {
            const res = this.compute();
            if (this._failed) {
                return fn(res);
            }
            return res;
        });
    }
    /**
     * Applies the given function f if this is a Failure, otherwise returns this if this is a Success.
     */
    recoverWith(fn) {
        return this.recover(fn).flatten();
    }
    //     toEither: Either[Throwable, T]
    //     Returns Left with Throwable if this is a Failure, otherwise returns Right with Success value.
    /**
     * Returns None if this is a Failure or a Some containing the value if this is a Success.
     */
    get toOption() {
        const iter = {
            [Symbol.iterator]: () => {
                let done = false;
                return {
                    next: () => {
                        let res;
                        if (!done) {
                            res = this.compute();
                        }
                        const n = {
                            done: done || this._failed,
                            value: res instanceof Error ? void 0 : res
                        };
                        done = true;
                        return n;
                    }
                };
            }
        };
        return option(iter);
    }
    /**
     * Converts this Try to a Promise, resolving it if it is a Success, rejecting it otherwise
     */
    get toPromise() {
        return this.map(v => Promise.resolve(v)).getOrElse(() => Promise.reject(new Error('No such element None.get')));
    }
    /**
     * Transforms this Try by applying the function ffailure if this is a Failure, or conversely, by applying fsuccess if this is a Success.
     */
    transform(ffailure, fsuccess) {
        return new Try(() => this.fold(ffailure, fsuccess)).flatten();
    }
}
/**
 * Wraps this computation in a Try
 */
export function tri(computation) {
    return Try.from(computation);
}
