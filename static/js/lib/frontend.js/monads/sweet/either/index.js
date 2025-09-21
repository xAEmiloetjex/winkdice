var EitherType;
(function (EitherType) {
    EitherType["Left"] = "Left";
    EitherType["Right"] = "Right";
})(EitherType || (EitherType = {}));
function isWrappedFunction(m) {
    return typeof m.value === "function";
}
class EitherConstructor {
    type;
    value;
    static chain(f) {
        return (m) => m.asyncChain(f);
    }
    static mergeInOne(eithers) {
        return eithers.reduce((res, v) => res.chain(res => v.map(v => res.concat([v]))), EitherConstructor.right([]));
    }
    static merge = EitherConstructor.mergeInOne;
    static mergeInMany(eithers) {
        return eithers.reduce((res, v) => {
            if (res.isLeft()) {
                return v.isLeft() ? EitherConstructor.left(res.value.concat([v.value])) : res;
            }
            return v.isLeft()
                ? EitherConstructor.left([v.value])
                : res.chain(res => v.map(v => [...res, v]));
        }, EitherConstructor.right([]));
    }
    static from(v) {
        return EitherConstructor.right(v);
    }
    static fromPromise(promise) {
        return promise.then(EitherConstructor.right).catch(e => EitherConstructor.left(e));
    }
    static fromTry(fn) {
        try {
            return EitherConstructor.right(fn());
        }
        catch (e) {
            return EitherConstructor.left(e);
        }
    }
    static right(v) {
        return new EitherConstructor("Right" /* EitherType.Right */, v);
    }
    static left(v) {
        return new EitherConstructor("Left" /* EitherType.Left */, v);
    }
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
    isLeft() {
        return this.type === "Left" /* EitherType.Left */;
    }
    isRight() {
        return this.type === "Right" /* EitherType.Right */;
    }
    join() {
        return this.chain(x => x);
    }
    mapRight(f) {
        return this.map(f);
    }
    mapLeft(f) {
        if (this.isLeft()) {
            return EitherConstructor.left(f(this.value));
        }
        return EitherConstructor.right(this.value);
    }
    map(f) {
        if (this.isLeft()) {
            return EitherConstructor.left(this.value);
        }
        return EitherConstructor.right(f(this.value));
    }
    asyncMap(f) {
        if (this.isLeft()) {
            return Promise.resolve(EitherConstructor.left(this.value));
        }
        return f(this.value).then(v => EitherConstructor.right(v));
    }
    apply(argOrFn) {
        if (this.isLeft()) {
            return EitherConstructor.left(this.value);
        }
        if (argOrFn.isLeft()) {
            return EitherConstructor.left(argOrFn.value);
        }
        if (isWrappedFunction(this)) {
            return argOrFn.map(this.value);
        }
        if (isWrappedFunction(argOrFn)) {
            return argOrFn.apply(this);
        }
        throw new Error("Some of the arguments should be a function");
    }
    asyncApply(argOrFn) {
        if (this.isLeft()) {
            return Promise.resolve(EitherConstructor.left(this.value));
        }
        if (argOrFn.isLeft()) {
            return Promise.resolve(EitherConstructor.left(argOrFn.value));
        }
        if (isWrappedFunction(this)) {
            return argOrFn
                .map(a => Promise.resolve(a))
                .asyncMap(pa => pa.then(this.value));
        }
        if (isWrappedFunction(argOrFn)) {
            return argOrFn.asyncApply(this);
        }
        throw new Error("Some of the arguments should be a function");
    }
    chain(f) {
        if (this.isLeft()) {
            return EitherConstructor.left(this.value);
        }
        return f(this.value);
    }
    asyncChain(f) {
        if (this.isLeft()) {
            return Promise.resolve(EitherConstructor.left(this.value));
        }
        return f(this.value);
    }
    or(x) {
        return this.isLeft() ? x : this;
    }
    unwrap(errorFactory = () => new Error("Either state is Left")) {
        if (this.isRight())
            return this.value;
        throw errorFactory(this.value);
    }
    unwrapOr(x) {
        return this.isRight() ? this.value : x;
    }
    unwrapOrElse(f) {
        return this.isRight() ? this.value : f(this.value);
    }
    fold(mapLeft, mapRight) {
        return this.isRight() ? mapRight(this.value) : mapLeft(this.value);
    }
    get [Symbol.toStringTag]() {
        return "Either";
    }
}
export const { merge, mergeInOne, mergeInMany, left, right, from, fromTry, fromPromise, chain } = EitherConstructor;
export const isEither = (value) => value instanceof EitherConstructor;
