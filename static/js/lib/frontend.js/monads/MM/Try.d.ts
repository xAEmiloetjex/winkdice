/**
 * Created by Bruno Grieder.
 */
import { Option } from './Option.js';
export declare class Try<A> {
    static from<A>(value: any): Try<A>;
    private readonly _computation;
    private _result;
    private _failed;
    protected constructor(computation: (...args: any[]) => A);
    private compute;
    private computeThrow;
    /**
     * Applies the given mapper to this computation if it is a Success and the filter is satisfied
     */
    collect<B>(filter: () => boolean): (mapper: (value: A) => B) => Try<B>;
    /**
     * Inverts this Try.
     */
    get failed(): Try<Error>;
    /**
     * Converts this to a Failure if the predicate is not satisfied.
     */
    filter(f: () => boolean): Try<A>;
    /**
     * Returns the given function applied to the value from this Success or returns this if this is a Failure.
     */
    flatMap<U>(f: (value: A) => Try<U>): Try<U>;
    /**
     * Transforms a nested Try, ie, a Try of type Try[Try[T]], into an un-nested Try, ie, a Try of type Try[T].
     */
    flatten<U>(): Try<U>;
    /**
     * Applies ffailure if this is a Failure or fsuccess if this is a Success.
     */
    fold<U>(ffailure: (e: Error) => U, fsuccess: (vale: A) => U): U;
    /**
     * Applies the given function f if this is a Success, otherwise returns Unit if this is a Failure.
     */
    foreach(f: (value: A) => void): void;
    /**
     * Returns the value from this Success or throws the exception if this is a Failure.
     */
    get get(): A;
    /**
     * Returns the value from this Success or the given default argument if this is a Failure.
     */
    getOrElse<U>(elseVal: () => U): A | U;
    /**
     * Returns true if the Try is a Failure, false otherwise.
     */
    get isFailure(): boolean;
    /**
     * Returns true if the Try is a Success, false otherwise.
     * Calling this method will compute the function if not already computed
     */
    get isSuccess(): boolean;
    /**
     * Maps the given function to the value from this Success or returns this if this is a Failure.
     */
    map<U>(f: (value: A) => U): Try<U>;
    /**
     * Returns this Try if it's a Success or the given default argument if this is a Failure.
     */
    orElse<U>(f: () => Try<U>): Try<A | U>;
    /**
     * Applies the given function f if this is a Failure, otherwise returns this if this is a Success.
     */
    recover<U>(fn: (e: Error) => U): Try<A | U>;
    /**
     * Applies the given function f if this is a Failure, otherwise returns this if this is a Success.
     */
    recoverWith<U>(fn: (e: Error) => Try<U>): Try<A | U>;
    /**
     * Returns None if this is a Failure or a Some containing the value if this is a Success.
     */
    get toOption(): Option<A>;
    /**
     * Converts this Try to a Promise, resolving it if it is a Success, rejecting it otherwise
     */
    get toPromise(): Promise<A>;
    /**
     * Transforms this Try by applying the function ffailure if this is a Failure, or conversely, by applying fsuccess if this is a Success.
     */
    transform<U>(ffailure: (e: Error) => Try<U>, fsuccess: (vale: A) => Try<U>): Try<U>;
}
/**
 * Wraps this computation in a Try
 */
export declare function tri<A>(computation: () => A): Try<A>;
