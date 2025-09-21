/**
 * Created by Bruno Grieder.
 */
import { Collection } from './Collection.js';
export declare class Option<A> extends Collection<A> {
    static from<A>(optVal: any): Option<A>;
    /**
     * Returns a Some containing the result of applying pf to this Option's contained value, if this option is nonempty and pf is defined for that value.
     */
    collect<B>(filter: (value: A) => boolean): (mapper: (value: A) => B) => Option<B>;
    /**
     * Tests whether the value of the Option pass the filter, and applies the partial function to it.
     */
    collectFirst<B>(filter: (value: A) => boolean): (mapper: (value: A) => B) => Option<B>;
    /**
     * Returns true if this option is nonempty and the predicate p returns true when applied to this Option's value.
     */
    exists(p: (value: A) => boolean): boolean;
    /**
     * Returns this Option if it is nonempty and applying the predicate p to this Option's value returns true.
     */
    filter(f: (value: A) => boolean): Option<A>;
    /**
     * Returns this Option if it is nonempty and applying the predicate p to this Option's value returns false.
     */
    filterNot(f: (value: A) => boolean): Option<A>;
    /**
     * Finds the first element of the iterable collection satisfying a predicate, if any.
     */
    find(p: (value: A) => boolean): Option<A>;
    /**
     * Returns the result of applying f to this Option's value if this Option is nonempty.
     */
    flatMap<U>(f: (value: A) => Option<U>): Option<U>;
    /**
     * Converts this Option of Option into an Option
     * e.g. some( some(1) ).flatten() -> some(1)
     */
    flatten<U>(): Option<U>;
    /**
     * Returns true if this option is empty or the predicate p returns true when applied to this Option's value.
     */
    forall(p: (value: A) => boolean): boolean;
    /**
     * Apply the given procedure f to the option's value, if it is nonempty.
     */
    foreach(f: (value: A) => void): void;
    get get(): A;
    /**
     * Returns the option's value if the option is nonempty, otherwise return the result of evaluating default.
     */
    getOrElse<U>(elseVal: () => U): A | U;
    /**
     * Optionally selects the first element.
     */
    get headOption(): Option<A>;
    /**
     * Returns true if the option is an instance of Some, false otherwise.
     */
    get isDefined(): boolean;
    /**
     * Selects the last element.
     */
    get last(): A;
    /**
     * Optionally selects the last element.
     */
    get lastOption(): Option<A>;
    /**
     * Returns a Some containing the result of applying f to this Option's value if this Option is nonempty.
     */
    map<U>(f: (value: A) => U): Option<U>;
    /**
     * Returns false if the option is None, true otherwise.
     */
    get nonEmpty(): boolean;
    /**
     * Returns this Option if it is nonempty, otherwise return the result of evaluating alternative.
     */
    orElse(alternative: () => Option<A>): Option<A>;
    /**
     * Returns the option's value if it is nonempty, or null if it is empty.
     */
    get orNull(): A;
    /**
     * Returns the option's value if it is nonempty, or throws an error with the specified message
     */
    orThrow(message: () => string): A;
    /**
     * Returns the option's value if it is nonempty, or undefined if it is empty.
     */
    get orUndefined(): A;
    /**
     * Converts this Option to a Promise, resolving it if it is a Some, rejecting it otherwise
     */
    get toPromise(): Promise<A>;
}
export declare function some<A>(value: A): Option<A>;
export declare function none(): Option<any>;
/**
 * Create a None if value is undefined or null or NaN
 * otherwise create a Some holding that value
 */
export declare function option<A>(value: A | Iterable<A>): Option<A>;
