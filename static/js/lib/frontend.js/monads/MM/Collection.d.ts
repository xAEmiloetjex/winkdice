import { Iterable, Iterator } from './Iter.js';
/**
 * The base class from which all other monads are created
 * Collection is an extension of ES6 Iterable: a collection of elements that can be iterated over
 */
export declare abstract class Collection<A> implements Iterable<A> {
    protected _value: Iterable<A>;
    protected constructor(value: any);
    [Symbol.iterator](): Iterator<A>;
    build<B>(next: () => {
        done: boolean;
        value?: B;
    }): Collection<B>;
    /**
     * Returns the element at index.
     * The first element is at index 0
     * O(1) if the underlying iterable is indexed, O(n) otherwise
     */
    at(index: number): A;
    /**
     * Creates a Collection by transforming values produced by this Collection with a partial function, dropping those values for which the partial function is not defined.
     */
    collect<B>(filter: (value: A) => boolean): (mapper: (value: A) => B) => Collection<B>;
    /**
     * Concatenates this Collection with another.
     */
    concat(that: Collection<A>): Collection<A>;
    /**
     * Tests whether this Collection contains a given value as an element.
     */
    contains(elem: any): boolean;
    /**
     * Counts the number of elements in the Collection which satisfy a predicate.
     */
    count(p: (value: A) => boolean): number;
    /**
     * Advances this Collection past the first n elements, or the length of the Collection, whichever is smaller.
     */
    drop(n: number): Collection<A>;
    /**
     * Skips longest sequence of elements of this Collection which satisfy given predicate p, and returns a Collection of the remaining elements.
     */
    dropWhile(p: (value: A) => boolean): Collection<A>;
    /**
     * Test whether these two Iters are equal by testing equality on all elements
     * Equality on elements is tested first by using an `equals` method if it exists, or `===` otherwise
     */
    equals(that: Collection<A>): boolean;
    /**
     * Tests whether a predicate holds for some of the values produced by this Collection
     */
    exists(p: (value: A) => boolean): boolean;
    /**
     * Returns a Collection over all the elements of this Collection that satisfy the predicate p.
     */
    filter(filter: (value: A) => boolean): Collection<A>;
    /**
     * Creates a Collection over all the elements of this Collection which do not satisfy a predicate p.
     */
    filterNot(filter: (value: A) => boolean): Collection<A>;
    /**
     * Creates a new Collection by applying a function to all values produced by this Collection and concatenating the results.
     */
    flatMap<B>(f: (value: A, index?: number) => Collection<B>): Collection<B>;
    /**
     * Converts this Collection of Collections into a Collection formed by the elements of the Collections
     * e.g. seq( seq(1,2), seq(3,4) ).flatten() = seq(1,2,3,4)
     */
    flatten<U>(): Collection<U>;
    /**
     * Applies a binary operator to a start value and all elements of Collection, going left to right.
     */
    foldLeft<B>(initialValue: B): (op: (accumulator: B, value: A, index?: number) => B) => B;
    /**
     * Applies a binary operator to all elements of Collection and a start value, going right to left.
     */
    foldRight<B>(initialValue: B): (op: (accumulator: B, value: A, index?: number) => B) => B;
    /**
     * Tests whether a predicate holds for all values produced by this Collection
     */
    forall(p: (value: A) => boolean): boolean;
    /**
     * Applies a function f to all values produced by this Collection
     */
    foreach(f: (value: A) => void): void;
    /**
     * Tests whether this Collection has a known size.
     */
    get hasDefiniteSize(): boolean;
    /**
     * Selects the first element
     */
    get head(): A;
    /**
     * Returns the index of the first occurrence of the specified object in Collection after or at some optional start index.
     */
    indexOf(elem: A, from?: number): number;
    /**
     * Tests whether this Collection is empty.
     */
    get isEmpty(): boolean;
    /**
     * Tests whether this Collection is an indexed Collection
     * i.e. its elements can be accessed using an index
     */
    get isIndexed(): boolean;
    /**
     * Selects the last element.
     */
    get last(): A;
    /**
     * Returns the number of elements
     */
    get length(): number;
    /**
     * Creates a new Collection that maps all produced values of this Collection to new values using a transformation function.
     */
    map<B>(f: (value: A, index?: number) => B): Collection<B>;
    /**
     * Displays all elements of this Collection in a string using an optional separator string.
     */
    mkString(sep?: string): string;
    /**
     * Displays all elements of this Collection in a string using start, end, and separator strings.
     */
    mkString(start?: string, sep?: string, end?: string): string;
    /**
     * Tests whether the Collection is not empty.
     */
    get nonEmpty(): boolean;
    /**
     * Returns a new Collection with the elements in reverse order
     * If a reverse iterator is available, it will be used otherwise:
     *      - reversing an indexed Collection will return a linear (non indexed Iter).
     *      - reversing a linear Collection will create an indexed Collection by by loading its content into an im-memory array
     */
    get reverse(): Collection<A>;
    /**
     * The size i.e. the number of elements
     */
    get size(): number;
    /**
     * Creates a Collection returning an interval of the values produced by this Collection
     */
    slice(from: number, until: number): Collection<A>;
    /**
     * Sums up the elements
     */
    get sum(): A;
    /**
     * Selects all elements but the first
     */
    get tail(): Collection<A>;
    /**
     * Selects the first n elements
     */
    take(n: number): Collection<A>;
    /**
     * Converts this Collection to an array.
     */
    get toArray(): Array<A>;
    /**
     * Converts this Collection to an indexed Collection if it not already one
     * by creating an in memory array with the content
     */
    get toIndexed(): Collection<A>;
    /**
     * Converts this Collection to a string.
     */
    get toString(): string;
}
