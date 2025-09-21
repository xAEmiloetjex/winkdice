import { FailResult, OkResult } from '../result/result.js';
export class Maybe {
    value;
    constructor(value) {
        this.value = value;
    }
    of(value) {
        return new Maybe(value);
    }
    static none() {
        return new Maybe();
    }
    static some(value) {
        return new Maybe(value);
    }
    isSome() {
        return !this.isNone();
    }
    isNone() {
        return this.value === null || this.value === undefined;
    }
    valueOr(value) {
        return this.isSome() ? this.value : value;
    }
    valueOrUndefined() {
        return this.isSome() ? this.value : undefined;
    }
    valueOrNull() {
        return this.isSome() ? this.value : null;
    }
    valueOrCompute(fn) {
        return this.isSome() ? this.value : fn();
    }
    valueOrThrow(msg) {
        return this.isNone() ? (() => { throw new Error(msg); })() : this.value;
    }
    valueOrThrowErr(err) {
        return this.isNone()
            ? (() => err instanceof Error ? (() => { throw err; })() : (() => { throw new Error(); })())()
            : this.value;
    }
    tap(obj) {
        this.isNone()
            ? typeof obj.none === 'function' && obj.none()
            : typeof obj.some === 'function' && obj.some(this.value);
    }
    tapNone(fn) {
        (this.isNone()) && fn();
    }
    tapSome(fn) {
        (this.isSome()) && fn(this.value);
    }
    tapThru(val) {
        this.tap(val);
        return this;
    }
    tapThruNone(fn) {
        this.tapNone(fn);
        return this;
    }
    tapThruSome(fn) {
        this.tapSome(fn);
        return this;
    }
    match(pattern) {
        return this.isNone()
            ? pattern.none()
            : pattern.some(this.value);
    }
    toArray() {
        return this.isNone()
            ? []
            : Array.isArray(this.value)
                ? this.value
                : [this.value];
    }
    map(fn) {
        return this.isSome()
            ? new Maybe(fn(this.value))
            : new Maybe();
    }
    mapTo(t) {
        return this.isSome()
            ? new Maybe(t)
            : new Maybe();
    }
    flatMap(fn) {
        return this.isNone() ? new Maybe() : fn(this.value);
    }
    flatMapAuto(fn) {
        return this.isNone()
            ? new Maybe()
            : new Maybe(fn(this.value));
    }
    project(fn) {
        return this.flatMapAuto(fn);
    }
    filter(fn) {
        return this.isNone()
            ? new Maybe()
            : fn(this.value)
                ? new Maybe(this.value)
                : new Maybe();
    }
    apply(maybeFn) {
        return this.flatMap(v => maybeFn.flatMapAuto(f => f(v)));
    }
    toResult(error) {
        return this
            .map(b => new OkResult(b))
            .valueOr(new FailResult(error));
    }
}
