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
import { catchResult } from './try-catch-to-result';
describe(catchResult.name, function () {
    it('should try', function (done) {
        function someThrowable() {
            return 'I worked!';
        }
        var sut = catchResult(someThrowable);
        expect(sut.isOk()).toEqual(true);
        expect(sut.unwrap()).toEqual('I worked!');
        done();
    });
    it('should catch', function (done) {
        function someThrowable() {
            throw new Error('I failed!');
        }
        var sut = catchResult(someThrowable);
        expect(sut.isFail()).toEqual(true);
        done();
    });
    it('should catch with error mapping function', function (done) {
        function someThrowable() {
            throw new Error('I failed!');
        }
        var CustomError = /** @class */ (function (_super) {
            __extends(CustomError, _super);
            function CustomError(message) {
                return _super.call(this, message) || this;
            }
            CustomError.fromUnknown = function (err) {
                if (err instanceof Error) {
                    return new CustomError(err.message);
                }
                return new CustomError('new error');
            };
            return CustomError;
        }(Error));
        var sut = catchResult(someThrowable, CustomError.fromUnknown);
        expect(sut.isFail()).toEqual(true);
        expect(sut.unwrapFail().message).toEqual('I failed!');
        done();
    });
});
//# sourceMappingURL=try-catch-to-result.spec.js.map