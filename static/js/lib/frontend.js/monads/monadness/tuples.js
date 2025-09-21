/**
 * Builds a TupleN based on given value length.
 */
function factory(...values) {
    const tuple = values.slice(0); // [0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8]);
    Object.defineProperty(tuple, "length", { value: tuple.length });
    for (let i = 0, len = tuple.length; i < len; i++) {
        Object.defineProperty(tuple, `_${i + 1}`, { value: tuple[i] });
    }
    Object.defineProperty(tuple, "equals", {
        value: function (other) {
            if (this === other)
                return true;
            if (!other || "_1" in other === false)
                return false;
            if (this.length !== other.length)
                return false;
            for (let i = 0; i < this.length; i++) {
                if (this[i].equals !== undefined && !this[i].equals(other[i])) {
                    return false;
                }
                else if (this[i] !== other[i]) {
                    return false;
                }
            }
            return true;
        },
    });
    Object.defineProperty(tuple, "toJSON", {
        value: function () {
            return this.slice(0).map((i) => !!i && i.toJSON !== undefined ? i.toJSON() : i);
        },
    });
    Object.defineProperty(tuple, "toString", { value: function () { return JSON.stringify(this.toJSON()); } });
    Object.defineProperty(tuple, "map", {
        value: function (f) {
            if (tuple.length === 0) {
                return TUPLE_ZERO_SINGLETON;
            }
            const arr = new Array(tuple.length);
            for (const i in tuple) {
                arr[i] = f(tuple[i]);
            }
            return factory(...arr);
        },
    });
    Object.defineProperty(tuple, "fmap", {
        value: function (f) {
            if (tuple.length === 0) {
                return TUPLE_ZERO_SINGLETON;
            }
            const arr = new Array(tuple.length);
            for (const i in tuple) {
                arr[i] = f(tuple[i])[0];
            }
            return factory(...arr);
        },
    });
    Object.defineProperty(tuple, "applies", {
        value: function (f) {
            return function (tb) {
                if (tuple.length === 0) {
                    return TUPLE_ZERO_SINGLETON;
                }
                const arr = new Array(tuple.length);
                for (const i in tuple) {
                    arr[i] = f(tuple[i])(tb[i])[0];
                }
                return factory(...arr);
            };
        },
    });
    Object.defineProperty(tuple, "mbind", {
        value: function (f) {
            if (tuple.length === 0) {
                return TUPLE_ZERO_SINGLETON;
            }
            const arr = new Array(tuple.length);
            for (const i in tuple) {
                arr[i] = f[i](tuple[i])[0];
            }
            return factory(...arr);
        },
    });
    return Object.freeze(tuple);
}
/**
 * Tuple0 Singleton.
 */
const TUPLE_ZERO_SINGLETON = factory();
/**
 * Namespace for static generators.
 */
export class Tuples {
    constructor() { }
    static from(...args) {
        if (args.length === 0) {
            return TUPLE_ZERO_SINGLETON;
        }
        return factory.apply(this, args);
    }
}
