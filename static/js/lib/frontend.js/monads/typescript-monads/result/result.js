import { maybe, none } from '../maybe/public_api.js';
export class Result {
    static ok(value) {
        return new OkResult(value);
    }
    static fail(value) {
        return new FailResult(value);
    }
}
export class OkResult extends Result {
    successValue;
    constructor(successValue) {
        super();
        this.successValue = successValue;
    }
    isOk() {
        return true;
    }
    isFail() {
        return false;
    }
    unwrap() {
        return this.successValue;
    }
    unwrapOr() {
        return this.unwrap();
    }
    unwrapFail() {
        throw new ReferenceError('Cannot unwrap a success as a failure');
    }
    maybeOk() {
        return maybe(this.successValue);
    }
    maybeFail() {
        return none();
    }
    match(fn) {
        return fn.ok(this.successValue);
    }
    map(fn) {
        return Result.ok(fn(this.successValue));
    }
    mapFail() {
        return Result.ok(this.successValue);
    }
    flatMap(fn) {
        return fn(this.successValue);
    }
    toFailWhenOk(fn) {
        return Result.fail(fn(this.successValue));
    }
    toFailWhenOkFrom(val) {
        return Result.fail(val);
    }
    tap(val) {
        typeof val.ok === 'function' && val.ok(this.successValue);
    }
    tapOk(fn) {
        fn(this.successValue);
    }
    tapFail() { }
    tapFailThru() {
        return this;
    }
    tapOkThru(fn) {
        this.tapOk(fn);
        return this;
    }
    tapThru(val) {
        this.tap(val);
        return this;
    }
}
export class FailResult extends Result {
    failureValue;
    constructor(failureValue) {
        super();
        this.failureValue = failureValue;
    }
    isOk() {
        return false;
    }
    isFail() {
        return true;
    }
    unwrap() {
        throw new Error('Cannot unwrap a failure');
    }
    unwrapOr(opt) {
        return opt;
    }
    unwrapFail() {
        return this.failureValue;
    }
    maybeOk() {
        return none();
    }
    maybeFail() {
        return maybe(this.failureValue);
    }
    match(fn) {
        return fn.fail(this.failureValue);
    }
    mapFail(fn) {
        return Result.fail(fn(this.failureValue));
    }
    map() {
        return Result.fail(this.failureValue);
    }
    flatMap() {
        return Result.fail(this.failureValue);
    }
    toFailWhenOk() {
        return this;
    }
    toFailWhenOkFrom(val) {
        return Result.fail(val);
    }
    tap(val) {
        typeof val.fail === 'function' && val.fail(this.failureValue);
    }
    tapOk() { }
    tapFail(fn) {
        fn(this.failureValue);
    }
    tapFailThru(fn) {
        this.tapFail(fn);
        return this;
    }
    tapOkThru() {
        return this;
    }
    tapThru(val) {
        this.tap(val);
        return this;
    }
}
