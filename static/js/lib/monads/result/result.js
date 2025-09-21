var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { maybe, none } from '../maybe/public_api';
var Result = /** @class */ (function () {
    function Result() {
    }
    Result.ok = function (value) {
        return new OkResult(value);
    };
    Result.fail = function (value) {
        return new FailResult(value);
    };
    return Result;
}());
export { Result };
var OkResult = /** @class */ (function (_super) {
    __extends(OkResult, _super);
    function OkResult(successValue) {
        var _this = _super.call(this) || this;
        _this.successValue = successValue;
        return _this;
    }
    OkResult.prototype.isOk = function () {
        return true;
    };
    OkResult.prototype.isFail = function () {
        return false;
    };
    OkResult.prototype.unwrap = function () {
        return this.successValue;
    };
    OkResult.prototype.unwrapOr = function () {
        return this.unwrap();
    };
    OkResult.prototype.unwrapFail = function () {
        throw new ReferenceError('Cannot unwrap a success as a failure');
    };
    OkResult.prototype.maybeOk = function () {
        return maybe(this.successValue);
    };
    OkResult.prototype.maybeFail = function () {
        return none();
    };
    OkResult.prototype.match = function (fn) {
        return fn.ok(this.successValue);
    };
    OkResult.prototype.map = function (fn) {
        return Result.ok(fn(this.successValue));
    };
    OkResult.prototype.mapFail = function () {
        return Result.ok(this.successValue);
    };
    OkResult.prototype.flatMap = function (fn) {
        return fn(this.successValue);
    };
    OkResult.prototype.toFailWhenOk = function (fn) {
        return Result.fail(fn(this.successValue));
    };
    OkResult.prototype.toFailWhenOkFrom = function (val) {
        return Result.fail(val);
    };
    OkResult.prototype.tap = function (val) {
        typeof val.ok === 'function' && val.ok(this.successValue);
    };
    OkResult.prototype.tapOk = function (fn) {
        fn(this.successValue);
    };
    OkResult.prototype.tapFail = function () { };
    OkResult.prototype.tapFailThru = function () {
        return this;
    };
    OkResult.prototype.tapOkThru = function (fn) {
        this.tapOk(fn);
        return this;
    };
    OkResult.prototype.tapThru = function (val) {
        this.tap(val);
        return this;
    };
    return OkResult;
}(Result));
export { OkResult };
var FailResult = /** @class */ (function (_super) {
    __extends(FailResult, _super);
    function FailResult(failureValue) {
        var _this = _super.call(this) || this;
        _this.failureValue = failureValue;
        return _this;
    }
    FailResult.prototype.isOk = function () {
        return false;
    };
    FailResult.prototype.isFail = function () {
        return true;
    };
    FailResult.prototype.unwrap = function () {
        throw new Error('Cannot unwrap a failure');
    };
    FailResult.prototype.unwrapOr = function (opt) {
        return opt;
    };
    FailResult.prototype.unwrapFail = function () {
        return this.failureValue;
    };
    FailResult.prototype.maybeOk = function () {
        return none();
    };
    FailResult.prototype.maybeFail = function () {
        return maybe(this.failureValue);
    };
    FailResult.prototype.match = function (fn) {
        return fn.fail(this.failureValue);
    };
    FailResult.prototype.mapFail = function (fn) {
        return Result.fail(fn(this.failureValue));
    };
    FailResult.prototype.map = function () {
        return Result.fail(this.failureValue);
    };
    FailResult.prototype.flatMap = function () {
        return Result.fail(this.failureValue);
    };
    FailResult.prototype.toFailWhenOk = function () {
        return this;
    };
    FailResult.prototype.toFailWhenOkFrom = function (val) {
        return Result.fail(val);
    };
    FailResult.prototype.tap = function (val) {
        typeof val.fail === 'function' && val.fail(this.failureValue);
    };
    FailResult.prototype.tapOk = function () { };
    FailResult.prototype.tapFail = function (fn) {
        fn(this.failureValue);
    };
    FailResult.prototype.tapFailThru = function (fn) {
        this.tapFail(fn);
        return this;
    };
    FailResult.prototype.tapOkThru = function () {
        return this;
    };
    FailResult.prototype.tapThru = function (val) {
        this.tap(val);
        return this;
    };
    return FailResult;
}(Result));
export { FailResult };
//# sourceMappingURL=result.js.map