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
import { maybe, none } from './public_api';
import { Maybe } from './maybe';
describe('Maybe', function () {
    describe('when returning a value with possible throw', function () {
        it('should handle "none" case', function () {
            var sut = undefined;
            expect(function () {
                maybe(sut).valueOrThrow('A STRING VALUE IS REQUIRED');
            }).toThrowError('A STRING VALUE IS REQUIRED');
        });
        it('should handle "some" case', function () {
            var sut = 'test';
            var maybeAString = maybe(sut).valueOrThrow('A STRING VALUE IS REQUIRED');
            expect(maybeAString).toEqual('test');
        });
    });
    describe('when returning a value with explicit throw error', function () {
        // tslint:disable-next-line: no-class
        var UserException = /** @class */ (function (_super) {
            __extends(UserException, _super);
            function UserException(message) {
                if (message === void 0) { message = 'A STRING VALUE IS REQUIRED'; }
                var _this = _super.call(this, message) || this;
                _this.message = message;
                _this.customProp = '123 - extended error object';
                return _this;
            }
            return UserException;
        }(Error));
        it('should handle "none" case', function () {
            var sut = undefined;
            expect(function () {
                maybe(sut).valueOrThrowErr(new UserException());
            }).toThrowError('A STRING VALUE IS REQUIRED');
            expect(function () {
                maybe(sut).valueOrThrowErr();
            }).toThrowError('');
        });
        it('should handle "some" case', function () {
            var sut = 'test';
            var maybeAString = maybe(sut).valueOrThrowErr(new UserException('A STRING VALUE IS REQUIRED'));
            expect(maybeAString).toEqual('test');
        });
    });
    describe('when returning a value by default', function () {
        it('should handle "none" case', function () {
            var sut = undefined;
            var maybeAString = maybe(sut).valueOr('default output');
            expect(maybeAString).toEqual('default output');
        });
        it('should handle "some" case', function () {
            var sut = 'actual input';
            var maybeAString = maybe(sut).valueOr('default output');
            expect(maybeAString).toEqual('actual input');
        });
        it('should handle "some" case when input is null', function () {
            var sut = null;
            var maybeAString = maybe(sut).valueOr('default output');
            expect(maybeAString).toEqual('default output');
        });
        it('should handle "some" case when input is ""', function () {
            var sut = '';
            var maybeAString = maybe(sut).valueOr('fallback');
            expect(maybeAString).toEqual('');
        });
        it('should handle "some" case when input is 0', function () {
            var sut = 0;
            var maybeAString = maybe(sut).valueOr(10);
            expect(maybeAString).toEqual(0);
        });
    });
    describe('when returning a value by computation', function () {
        it('should handle "none" case', function () {
            var sut = undefined;
            var maybeAString = maybe(sut).valueOrCompute(function () { return 'default output'; });
            expect(maybeAString).toEqual('default output');
        });
        it('should handle "some" case', function () {
            var sut = 'actual input';
            var maybeAString = maybe(sut).valueOrCompute(function () { return 'default output'; });
            expect(maybeAString).toEqual('actual input');
        });
        it('should handle "some" case when input is null', function () {
            var sut = null;
            var maybeAString = maybe(sut).valueOrCompute(function () { return 'fallback'; });
            expect(maybeAString).toEqual('fallback');
        });
        it('should handle "some" case when input is ""', function () {
            var sut = '';
            var maybeAString = maybe(sut).valueOrCompute(function () { return 'fallback'; });
            expect(maybeAString).toEqual('');
        });
        it('should handle "some" case when input is 0', function () {
            var sut = 0;
            var maybeAString = maybe(sut).valueOrCompute(function () { return 10; });
            expect(maybeAString).toEqual(0);
        });
    });
    describe('when returning from a match operation', function () {
        it('should handle "none" case', function () {
            var sut = undefined;
            var maybeAMappedString = maybe(sut)
                .match({
                none: function () { return 'fallback'; },
                some: function (_original) { return _original; }
            });
            expect(maybeAMappedString).toEqual('fallback');
        });
        it('should handle "some" case', function () {
            var sut = 'existing value';
            var maybeAMappedString = maybe(sut)
                .match({
                none: function () { return 'fallback'; },
                some: function (_original) { return _original; }
            });
            expect(maybeAMappedString).toEqual('existing value');
        });
    });
    describe('when performing side-effect operations', function () {
        it('should handle "none" case', function () {
            var sideEffectStore = '';
            var sut = undefined;
            maybe(sut)
                .tap({
                none: function () {
                    sideEffectStore = 'hit none';
                },
                some: function () { return undefined; }
            });
            expect(sideEffectStore).toEqual('hit none');
        });
        it('should handle "some" case', function () {
            var sideEffectStore = '';
            var sut = 'existing value';
            maybe(sut)
                .tap({
                none: function () { return undefined; },
                some: function (original) {
                    sideEffectStore = original;
                }
            });
            expect(sideEffectStore).toEqual('existing value');
        });
    });
    describe('when mapping', function () {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function getUserService(testReturn) {
            return testReturn;
        }
        it('should handle valid input', function () {
            var sut = 'initial input';
            var maybeSomeString = maybe(sut)
                .map(function () { return getUserService('initial input mapped'); })
                .valueOr('fallback');
            var maybeNotSomeSomeString = maybe(sut)
                .map(function () { return getUserService(undefined); })
                .valueOr('fallback');
            var maybeNotSomeSome2 = maybe(sut)
                .map(function () { return getUserService(0); })
                .valueOr('fallback');
            var maybeNotSomeSome3 = maybe(sut)
                .map(function () { return 'sut'; })
                .valueOr('fallback');
            expect(maybeSomeString).toEqual('initial input mapped');
            expect(maybeNotSomeSomeString).toEqual('fallback');
            expect(maybeNotSomeSome2).toEqual(0);
            expect(maybeNotSomeSome3).toEqual('sut');
        });
        it('should handle undefined input', function () {
            var sut = undefined;
            var maybeSomeString = maybe(sut)
                .map(function () { return getUserService('initial input mapped'); })
                .valueOr('fallback');
            var maybeNotSomeSomeString = maybe(sut)
                .map(function () { return getUserService(undefined); })
                .valueOr('fallback');
            var maybeNotSomeSome2 = maybe(sut)
                .map(function () { return getUserService(0); })
                .valueOr('fallback');
            var maybeNotSomeSome3 = maybe(sut)
                .map(function () { return getUserService(''); })
                .valueOr('fallback');
            expect(maybeSomeString).toEqual('fallback');
            expect(maybeNotSomeSomeString).toEqual('fallback');
            expect(maybeNotSomeSome2).toEqual('fallback');
            expect(maybeNotSomeSome3).toEqual('fallback');
        });
        it('should handle input of 0', function () {
            var sut = 0;
            var maybeSomeString = maybe(sut)
                .map(function () { return getUserService('initial input mapped'); })
                .valueOr('fallback');
            var maybeNotSomeSomeString = maybe(sut)
                .map(function () { return getUserService(undefined); })
                .valueOr('fallback');
            var maybeNotSomeSome2 = maybe(sut)
                .map(function () { return getUserService(0); })
                .valueOr('fallback');
            var maybeNotSomeSome3 = maybe(sut)
                .map(function () { return getUserService(''); })
                .valueOr('fallback');
            expect(maybeSomeString).toEqual('initial input mapped');
            expect(maybeNotSomeSomeString).toEqual('fallback');
            expect(maybeNotSomeSome2).toEqual(0);
            expect(maybeNotSomeSome3).toEqual('');
        });
        it('should handle input of ""', function () {
            var sut = '';
            var maybeSomeString = maybe(sut)
                .map(function () { return getUserService('initial input mapped'); })
                .valueOr('fallback');
            var maybeNotSomeSomeString = maybe(sut)
                .map(function () { return getUserService(undefined); })
                .valueOr('fallback');
            var maybeNotSomeSome2 = maybe(sut)
                .map(function () { return getUserService(0); })
                .valueOr('fallback');
            var maybeNotSomeSome3 = maybe(sut)
                .map(function () { return getUserService(''); })
                .valueOr('fallback');
            expect(maybeSomeString).toEqual('initial input mapped');
            expect(maybeNotSomeSomeString).toEqual('fallback');
            expect(maybeNotSomeSome2).toEqual(0);
            expect(maybeNotSomeSome3).toEqual('');
        });
    });
    describe('when flatMapping', function () {
        it('should handle "none" case', function () {
            var sut = undefined;
            var nsut = undefined;
            var maybeSomeNumber = maybe(sut)
                .flatMap(function () { return maybe(nsut); })
                .valueOr(1);
            expect(maybeSomeNumber).toEqual(1);
        });
        it('should handle "some" case', function () {
            var sut = 'initial';
            var nsut = 20;
            var maybeSomeNumber = maybe(sut)
                .flatMap(function () { return maybe(nsut); })
                .valueOr(0);
            expect(maybeSomeNumber).toEqual(20);
        });
    });
    describe('when getting monadic unit', function () {
        it('should get value', function () {
            var sut = undefined;
            var maybeSomeNumber = maybe(sut)
                .of('ok')
                .valueOr('fail');
            expect(maybeSomeNumber).toEqual('ok');
        });
    });
    describe('when tapSome', function () {
        it('should work', function () {
            var sut = 'abc';
            expect.assertions(1);
            maybe(sut).tapSome(function (a) { return expect(a).toEqual('abc'); });
            maybe(sut).tapNone(function () { return expect(1).toEqual(1); });
        });
    });
    describe('when tapNone', function () {
        it('should work', function () {
            var sut = undefined;
            expect.assertions(1);
            maybe(sut).tapNone(function () { return expect(1).toEqual(1); });
            maybe(sut).tapSome(function () { return expect(1).toEqual(1); });
        });
    });
    describe('when filtering', function () {
        it('pass value through if predicate is resolves true', function () {
            var thing = { isGreen: true };
            expect.assertions(1);
            maybe(thing)
                .filter(function (a) { return a.isGreen === true; })
                .tap({
                some: function (_thing) { return expect(_thing).toEqual(thing); },
                none: function () { return expect(1).toEqual(1); }
            });
        });
        it('should not pass value through if predicate is resolves false', function () {
            var thing = { isGreen: false };
            expect.assertions(1);
            maybe(thing)
                .filter(function (a) { return a.isGreen === true; })
                .tap({
                some: function () { return expect(true).toBe(false); },
                none: function () { return expect(1).toEqual(1); }
            });
        });
        it('should handle undefineds correctly', function () {
            var thing = undefined;
            expect.assertions(1);
            maybe(thing)
                .filter(function (a) { return a.isGreen === true; })
                .tap({
                some: function () { return expect(true).toBe(false); },
                none: function () { return expect(1).toEqual(1); }
            });
        });
    });
    describe('when returning a value or undefined', function () {
        it('should handle "none" case', function () {
            var sut = undefined;
            var maybeAString = maybe(sut).valueOrUndefined();
            expect(maybeAString).toBeUndefined();
        });
        it('should handle "some" case', function () {
            var sut = 'actual input';
            var maybeAString = maybe(sut).valueOrUndefined();
            expect(maybeAString).toEqual('actual input');
        });
    });
    describe('when returning a value or null', function () {
        it('should handle "none" case', function () {
            var sut = undefined;
            var maybeAString = maybe(sut).valueOrNull();
            expect(maybeAString).toBeNull();
        });
        it('should handle "some" case', function () {
            var sut = 'actual input';
            var maybeAString = maybe(sut).valueOrNull();
            expect(maybeAString).toEqual('actual input');
        });
    });
    describe('when returning an array', function () {
        it('should handle "none" case', function () {
            var sut = undefined;
            var maybeThing = maybe(sut).toArray();
            expect(maybeThing).toHaveLength(0);
            expect(maybeThing).toEqual([]);
        });
        it('should handle "some" case', function () {
            var sut = 'actual input';
            var maybeThing = maybe(sut).toArray();
            expect(maybeThing).toHaveLength(1);
            expect(maybeThing).toEqual(['actual input']);
        });
        it('should handle "some" case existing array', function () {
            var sut = ['actual input'];
            var maybeThing = maybe(sut).toArray();
            expect(maybeThing).toHaveLength(1);
            expect(maybeThing).toEqual(['actual input']);
        });
    });
    describe('flatMapAuto', function () {
        it('should flatMapAuto', function () {
            var sut = {
                thing: undefined
            };
            var maybeAString = maybe(sut)
                .flatMapAuto(function (a) { return a.thing; })
                .valueOrUndefined();
            expect(maybeAString).toBeUndefined();
        });
        it('should flatMapAuto inner', function () {
            var sut = {
                thing: 'testval'
            };
            var maybeAString = maybe(sut)
                .flatMapAuto(function (a) { return a.thing; })
                .map(function (a) { return a + 1; })
                .valueOrUndefined();
            expect(maybeAString).toEqual('testval1');
        });
        it('should flatMapAuto with intial input as empty', function () {
            var sut = undefined;
            var maybeAString = maybe(sut)
                .flatMapAuto(function (a) { return a.thing; })
                .map(function (a) { return a + 1; })
                .valueOrUndefined();
            expect(maybeAString).toBeUndefined();
        });
        it('should be nonnullable value outlet', function () {
            var imgWidth = maybe('url.com')
                .flatMapAuto(function (imgUrl) { return /width=[0-9]*/.exec(imgUrl); })
                .flatMapAuto(function (a) { return a[0].split('=')[1]; })
                .map(function (a) { return +a; })
                .valueOr(0);
            expect(imgWidth).toEqual(0);
        });
    });
    describe('chain', function () {
        it('should', function () {
            var obj = { thing: 1, name: 'string' };
            var chained = maybe(obj)
                .project(function (a) { return a.name; })
                .map(function (a) { return "".concat(a, " hello"); });
            expect(chained.isSome()).toEqual(true);
            expect(chained.valueOrUndefined()).toEqual('string hello');
        });
        it('should', function () {
            var obj = { thing: 1, name: 'string', obj: { initial: 'PJM' } };
            var chained = maybe(obj)
                .project(function (a) { return a.obj; })
                .project(function (a) { return a.initial; })
                .map(function (a) { return "Hello, ".concat(a); });
            expect(chained.isSome()).toEqual(true);
            expect(chained.valueOrUndefined()).toEqual('Hello, PJM');
        });
        it('should', function () {
            var obj = { thing: 1, name: undefined };
            var chained = maybe(obj)
                .project(function (a) { return a.name; })
                .project(function (a) { return a; })
                .map(function (a) { return "".concat(a, " hello"); });
            expect(chained.isNone()).toEqual(true);
            expect(chained.valueOrUndefined()).toBeUndefined();
        });
        it('should', function () {
            var obj = undefined;
            var chained = maybe(obj)
                .project(function (a) { return a.name; })
                .map(function (a) { return "".concat(a, " hello"); });
            expect(chained.isNone()).toEqual(true);
            expect(chained.valueOrUndefined()).toBeUndefined();
        });
    });
    describe('isSome', function () {
        it('false path', function () {
            var sut = undefined;
            var sut2 = null;
            expect(maybe(sut).isSome()).toEqual(false);
            expect(maybe(sut2).isSome()).toEqual(false);
        });
        it('true path', function () {
            var sut = 'test';
            var sut2 = 2;
            var sut3 = false;
            expect(maybe(sut).isSome()).toEqual(true);
            expect(maybe(sut2).isSome()).toEqual(true);
            expect(maybe(sut3).isSome()).toEqual(true);
            expect(maybe(sut).map(function (a) { return "".concat(a, "_1"); }).isSome()).toEqual(true);
        });
    });
    describe('isNone', function () {
        it('true path', function () {
            var sut = undefined;
            var sut2 = null;
            expect(maybe(sut).isNone()).toEqual(true);
            expect(maybe(sut2).isNone()).toEqual(true);
        });
        it('false path', function () {
            var sut = 'test';
            var sut2 = 2;
            var sut3 = true;
            expect(maybe(sut).isNone()).toEqual(false);
            expect(maybe(sut2).isNone()).toEqual(false);
            expect(maybe(sut3).isNone()).toEqual(false);
        });
    });
    describe('apply', function () {
        it('should apply the IMaybe<function>', function () {
            var a = maybe(function (a) { return a * 2; });
            var b = maybe(5);
            expect(a.apply(b).valueOrThrow()).toBe(10);
        });
        it('should apply the non-function maybe', function () {
            var a = maybe(2);
            var b = maybe(5);
            expect(a.apply(b).valueOrThrow()).toBe(5);
        });
    });
    describe('static', function () {
        it('should return new maybe with some', function () {
            expect(Maybe.some(1).valueOrThrowErr()).toEqual(1);
        });
    });
    describe('mapTo', function () {
        it('should return new maybe with some', function () {
            expect(Maybe.some(1).mapTo('deltaforce').valueOrThrowErr()).toEqual('deltaforce');
            expect(Maybe.none().mapTo('deltaforce').valueOrNull()).toEqual(null);
        });
    });
    describe('toResult', function () {
        it('should return result object with success', function () {
            var hasSome = maybe('hi');
            var sut = hasSome.toResult(new Error('oops'));
            expect(sut.unwrap()).toEqual('hi');
        });
        it('should return result object with fail', function () {
            var hasSome = maybe();
            var sut = hasSome.toResult(new Error('oops'));
            expect(sut.unwrapFail()).toEqual(new Error('oops'));
        });
    });
    describe('tapThruSome', function () {
        it('should tapThruSome', function () {
            // eslint-disable-next-line prefer-const
            var variable = undefined;
            var hasSome = maybe(1);
            var sut = hasSome.tapThruSome(function (v) {
                variable = v + 9;
            });
            expect(sut.isSome()).toBeTruthy();
            expect(sut.valueOrThrowErr()).toEqual(1);
            expect(variable).toEqual(10);
            expect(sut).toBeInstanceOf(Maybe);
        });
    });
    describe('tapThruNone', function () {
        it('should tapThruNone', function () {
            // eslint-disable-next-line prefer-const
            var variable = undefined;
            var hasSome = none();
            var sut = hasSome.tapThruNone(function () {
                variable = 'whatever';
            });
            expect(sut.isNone()).toBeTruthy();
            expect(sut.valueOrUndefined()).toBeUndefined();
            expect(variable).toEqual('whatever');
            expect(sut).toBeInstanceOf(Maybe);
        });
    });
    describe('tapThru', function () {
        it('should tap on some ', function () {
            // eslint-disable-next-line prefer-const
            var variable = undefined;
            var hasSome = maybe('hi there');
            var sut = hasSome.tapThru({
                none: function () { },
                some: function (v) { variable = v + ' joe'; }
            });
            expect(sut.isSome()).toBeTruthy();
            expect(sut.valueOrThrowErr()).toBeTruthy();
            expect(variable).toEqual('hi there joe');
            expect(sut).toBeInstanceOf(Maybe);
        });
        it('should tap on none ', function () {
            // eslint-disable-next-line prefer-const
            var variable = undefined;
            var hasSome = none();
            var sut = hasSome.tapThru({
                none: function () { variable = 'sorry joe'; },
                some: function (v) { variable = v + ' joe'; }
            });
            expect(sut.isNone()).toBeTruthy();
            expect(sut.valueOrUndefined()).toBeUndefined();
            expect(variable).toEqual('sorry joe');
            expect(sut).toBeInstanceOf(Maybe);
        });
    });
});
//# sourceMappingURL=maybe.spec.js.map