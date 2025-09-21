function isWrappedFunction(m) {
    return typeof m.value === "function";
}
function isWrappedAsyncFunction(m) {
    return typeof m.value === "function";
}
export default class Identity {
    value;
    static chain(f) {
        return (m) => m.asyncChain(f);
    }
    static from(v) {
        return new Identity(v);
    }
    constructor(value) {
        this.value = value;
    }
    join() {
        return this.chain(x => x);
    }
    map(f) {
        return Identity.from(f(this.value));
    }
    asyncMap(f) {
        return f(this.value).then(Identity.from);
    }
    apply(argOrFn) {
        if (isWrappedFunction(this)) {
            return argOrFn.map(this.value);
        }
        if (isWrappedFunction(argOrFn)) {
            return argOrFn.apply(this);
        }
        throw new Error("Some of the arguments should be a function");
    }
    asyncApply(argOrFn) {
        if (isWrappedAsyncFunction(this)) {
            return argOrFn
                .map(a => Promise.resolve(a))
                .asyncMap(pa => pa.then(this.value));
        }
        if (isWrappedAsyncFunction(argOrFn)) {
            return argOrFn.asyncApply(this);
        }
        throw new Error("Some of the arguments should be a function");
    }
    chain(f) {
        return f(this.value);
    }
    asyncChain(f) {
        return f(this.value);
    }
    unwrap() {
        return this.value;
    }
    get [Symbol.toStringTag]() {
        return this.constructor.name;
    }
}
export const { from, chain } = Identity;
export const isIdentity = (value) => value instanceof Identity;
