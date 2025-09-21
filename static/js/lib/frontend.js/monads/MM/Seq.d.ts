import { Option } from './Option.js';
import { Collection } from './Collection.js';
/**
 * A Seq is an ordered collection of elements
 */
export declare class Seq<A> extends Collection<A> {
    static from<A>(...vals: any[]): Seq<A>;
    /**
     * Finds the first element of the Seq for which the given partial function is defined, and applies the partial function to it.
     */
    collectFirst<B>(filter: (value: A) => boolean): (mapper: (value: A) => B) => Option<B>;
    /**
     * Finds the first value produced by the Seq satisfying a predicate, if any.
     */
    find(p: (value: A) => boolean): Option<A>;
    /**
     * Optionally selects the first element.
     */
    get headOption(): Option<A>;
    /**
     * Optionally selects the last element.
     */
    get lastOption(): Option<A>;
}
export declare function seq<A>(...vals: any[]): Seq<A>;
