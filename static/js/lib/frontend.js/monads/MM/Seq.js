import { none, some } from './Option.js';
import { Collection } from './Collection.js';
/**
 * A Seq is an ordered collection of elements
 */
export class Seq extends Collection {
    static from(...vals) {
        if (vals.length === 0) {
            return new Seq([]);
        }
        if (vals.length > 1) {
            return new Seq(vals);
        }
        const value = vals[0];
        if (typeof value[Symbol.iterator] === 'undefined') {
            return new Seq([value]);
        }
        return new Seq(value);
    }
    /**
     * Finds the first element of the Seq for which the given partial function is defined, and applies the partial function to it.
     */
    collectFirst(filter) {
        return (mapper) => {
            try {
                return some(this.filter(filter).map(mapper).head);
            }
            catch (e) {
                return none();
            }
        };
    }
    /**
     * Finds the first value produced by the Seq satisfying a predicate, if any.
     */
    find(p) {
        const it = this[Symbol.iterator]();
        for (let n = it.next(); !n.done; n = it.next()) {
            if (p(n.value))
                return some(n.value);
        }
        return none();
    }
    /**
     * Optionally selects the first element.
     */
    get headOption() {
        try {
            return some(this.head);
        }
        catch (e) {
            return none();
        }
    }
    // init: collection.Seq<A>
    // Selects all elements except the last.
    // inits: collection.Iterator<collection.Seq<A>>
    // Iterates over the inits of this iterable collection.
    /**
     * Optionally selects the last element.
     */
    get lastOption() {
        try {
            return some(this.last);
        }
        catch (e) {
            return none();
        }
    }
}
export function seq(...vals) {
    return Seq.from(...vals);
}
