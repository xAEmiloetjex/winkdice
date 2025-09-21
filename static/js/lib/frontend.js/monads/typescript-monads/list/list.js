/* eslint-disable @typescript-eslint/no-explicit-any */
// Repurposed from this great piece of code: https://gist.github.com/gvergnaud/6e9de8e06ef65e65f18dbd05523c7ca9
// Implements a number of functions from the .NET LINQ library: https://docs.microsoft.com/en-us/dotnet/api/system.linq.enumerable.reverse?view=netcore-3.1
/**
 * A lazily evaluated list with useful extension methods.
 */
export class List {
    length;
    constructor(generator, length) {
        this.length = length;
        this[Symbol.iterator] = generator;
    }
    generator() {
        return this[Symbol.iterator]();
    }
    static flattenArgs(args) {
        return args
            .reduce((acc, curr) => {
            return Array.isArray(curr)
                ? [...acc, ...curr]
                : [...acc, curr];
        }, []);
    }
    static of(...args) {
        return new List(function* () {
            return yield* args;
        }, args.length);
    }
    static from(iterable) {
        return iterable
            ? new List(function* () {
                yield* iterable;
            }, iterable.length)
            : List.empty();
    }
    static range(start, end, step = 1) {
        return new List(function* () {
            let i = start;
            while (i <= end) {
                yield i;
                i += step;
            }
        }, Math.floor((end - start + 1) / step));
    }
    static integers() {
        return this.range(0, Infinity);
    }
    static empty() {
        return new List(function* () { }, 0);
    }
    map(fn) {
        const generator = this.generator();
        return new List(function* () {
            for (const value of generator) {
                yield fn(value);
            }
        }, this.length);
    }
    /**
     * Delete the first N elements from a list.
     * @param count
     */
    drop(count) {
        const generator = this.generator();
        return new List(function* () {
            let next = generator.next();
            let n = 1;
            while (!next.done) {
                if (n > count)
                    yield next.value;
                n++;
                next = generator.next();
            }
        }, this.length - count);
    }
    /**
     * Deletes the first element from a list.
     * @param count
     */
    tail() {
        return this.drop(1);
    }
    scan(fn, seed) {
        const generator = this.generator();
        return new List(function* () {
            let acc = seed;
            for (const value of generator) {
                yield acc = fn(acc, value);
            }
        }, this.length);
    }
    reduce(fn, seed) {
        return this.toArray().reduce(fn, seed);
    }
    /**
     * Filters a sequence of values based on a predicate.
     * @param fn A function to test each element for a condition.
     */
    filter(fn) {
        const generator = this.generator();
        return new List(function* () {
            for (const value of generator) {
                if (fn(value))
                    yield value;
            }
        }, this.length);
    }
    /**
     * Filters a sequence of values based on a predicate. Alias to filter
     * @param fn A function to test each element for a condition.
     */
    where(fn) {
        return this.filter(fn);
    }
    concat(...args) {
        const generator = this.generator();
        const toAdd = List.flattenArgs(args);
        return new List(function* () {
            yield* generator;
            yield* toAdd;
        }, this.length + toAdd.length);
    }
    /**
     * Make a new list containing just the first N elements from an existing list.
     * @param count The number of elements to return.
     */
    take(count) {
        const generator = this.generator();
        return new List(function* () {
            let next = generator.next();
            let n = 0;
            while (!next.done && count > n) {
                yield next.value;
                n++;
                next = generator.next();
            }
        }, this.length > count ? count : this.length);
    }
    /**
     * Determines whether all elements of a sequence satisfy a condition.
     */
    all(fn) {
        const generator = this.generator();
        const newList = new List(function* () {
            for (const value of generator) {
                if (fn(value)) {
                    yield value;
                }
                else {
                    return yield value;
                }
            }
        }, this.length);
        return newList.toArray().length === this.length;
    }
    /**
     * Determines whether a sequence contains any elements matching the predicate.
     * @param fn A function to test each element for a condition.
     */
    any(fn) {
        const generator = this.generator();
        const newList = new List(function* () {
            for (const value of generator) {
                if (fn(value)) {
                    return yield value;
                }
            }
        }, this.length);
        return newList.toArray().length >= 1;
    }
    /**
     * Determines whether a sequence contains any elements matching the predicate.
     * @param fn A function to test each element for a condition.
     * Aliased to any()
     */
    some(fn) {
        return this.any(fn);
    }
    /**
     * Filters the elements of the list based on a specified type.
     * @param type The type to filter the elements of the sequence on.
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    ofType(type) {
        return this.filter(a => a instanceof type);
    }
    toDictionary(key) {
        return this.reduce((acc, curr, idx) => {
            return key
                ? curr[key]
                    ? { ...acc, [curr[key]]: curr }
                    : acc
                : { ...acc, [idx]: curr };
        }, {});
    }
    // /**
    //  * Sorts the elements of a sequence in ascending order.
    //  */
    // public orderBy<K extends keyof T>(prop?: T extends object ? K : never): List<T> {
    //   throw Error('Not Implemented')
    // }
    // public orderByDescending(): List<T> {
    //   throw Error('Not Implemented')
    // }
    /**
     * Inverts the order of the elements in a sequence.
     */
    // reverse(): List<T> {
    //   throw new Error('Not Implemented')
    // }
    sum() {
        return this
            .toArray()
            .reduce((acc, curr) => {
            return typeof curr === 'number'
                ? acc + curr
                : 0;
        }, 0);
    }
    /**
     * Gets the first item in the collection or returns the provided value when undefined
     */
    headOr(valueWhenUndefined) {
        return this.headOrUndefined() || valueWhenUndefined;
    }
    /**
     * Gets the first item in the collection or returns undefined
     */
    headOrUndefined() {
        return this.generator().next().value;
    }
    /**
     * Gets the first item in the collection or returns a computed function
     */
    headOrCompute(fn) {
        return this.headOrUndefined() || fn();
    }
    /**
     * Gets the first item in the collection or throws an error if undefined
     */
    headOrThrow(msg) {
        return this.headOrUndefined() || (() => { throw new Error(msg); })();
    }
    /** Convert to standard array */
    toArray() {
        return [...this];
    }
    /** Convert to standard array. Aliased to toArray() */
    toIterable() {
        return this.toArray();
    }
}
