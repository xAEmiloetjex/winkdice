import { ok, fail, result } from './result.factory';
describe('result', function () {
    describe('ok', function () {
        it('should return true when "isOk" invoked on a success path', function () {
            expect(ok(1).isOk()).toEqual(true);
        });
        it('should return false when "isFail" invoked on a success path', function () {
            expect(ok(1).isFail()).toEqual(false);
        });
        it('should unwrap', function () {
            expect(ok(1).unwrap()).toEqual(1);
            expect(ok('Test').unwrap()).toEqual('Test');
        });
        it('should return proper value when "unwrapOr" is applied', function () {
            expect(ok(1).unwrapOr(25)).toEqual(1);
            expect(ok('Test').unwrapOr('Some Other')).toEqual('Test');
        });
        it('should throw an exception whe "unwrapOrFail" called on an ok value', function () {
            expect(function () {
                ok(1).unwrapFail();
            }).toThrowError();
        });
        it('should ...', function () {
            var _sut = ok('Test')
                .maybeOk()
                .map(function (b) { return b; })
                .valueOr('Some Other');
            expect(_sut).toEqual('Test');
        });
        it('should ...', function () {
            var _sut = ok('Test')
                .maybeFail()
                .valueOrUndefined();
            expect(_sut).toEqual(undefined);
        });
        it('should map function', function () {
            var sut = ok(1)
                .map(function (b) { return b.toString(); })
                .unwrap();
            expect(sut).toEqual('1');
        });
        it('should not mapFail', function () {
            var sut = ok(1)
                .mapFail(function () { return ''; })
                .unwrap();
            expect(sut).toEqual(1);
        });
        it('should flatMap', function () {
            var sut = ok(1)
                .flatMap(function (a) { return ok(a.toString()); })
                .unwrap();
            expect(sut).toEqual('1');
        });
        it('should match', function () {
            var sut = ok(1)
                .match({
                fail: function () { return 2; },
                ok: function (val) { return val; }
            });
            expect(sut).toEqual(1);
        });
    });
    describe('fail', function () {
        it('should return false when "isOk" invoked', function () {
            expect(fail(1).isOk()).toEqual(false);
        });
        it('should return true when "isFail" invoked', function () {
            expect(fail(1).isFail()).toEqual(true);
        });
        it('should return empty maybe when "maybeOk" is invoked', function () {
            var sut = fail('Test')
                .maybeOk()
                .valueOr('Some Other1');
            expect(sut).toEqual('Some Other1');
        });
        it('should return fail object when "maybeFail" is invoked', function () {
            var sut = fail('Test')
                .maybeFail()
                .valueOr('Some Other2');
            expect(sut).toEqual('Test');
        });
        it('should throw an exception on "unwrap"', function () {
            expect(function () { fail(1).unwrap(); }).toThrowError();
        });
        it('should return fail object on "unwrapFail"', function () {
            expect(fail('123').unwrapFail()).toEqual('123');
        });
        it('should return input object on "unwrapOr"', function () {
            expect(fail('123').unwrapOr('456')).toEqual('456');
        });
        it('should not map', function () {
            var sut = fail(1)
                .map(function (b) { return b.toString(); })
                .unwrapFail();
            expect(sut).toEqual(1);
        });
        it('should mapFail', function () {
            var sut = fail(1)
                .mapFail(function (b) { return b.toString(); })
                .unwrapFail();
            expect(sut).toEqual('1');
        });
        it('should not flatMap', function () {
            var sut = fail(1)
                .flatMap(function (a) { return ok(a.toString()); })
                .unwrapFail();
            expect(sut).toEqual(1);
        });
        it('should match', function () {
            var sut = fail(1)
                .match({
                fail: function () { return 2; },
                ok: function (val) { return val; }
            });
            expect(sut).toEqual(2);
        });
    });
    describe('result', function () {
        it('should return failure when predicate yields false', function () {
            var sut = result(function () { return 1 + 1 === 3; }, true, 'FAILURE!');
            expect(sut.isFail()).toEqual(true);
        });
        it('should return ok when predicate yields true', function () {
            var sut = result(function () { return 1 + 1 === 2; }, true, 'FAILURE!');
            expect(sut.isOk()).toEqual(true);
        });
        it('should return fail when predicate yields false', function () {
            var sut = result(function () { return 1 + 1 === 1; }, true, 'FAILURE!');
            expect(sut.isFail()).toEqual(true);
        });
    });
    describe('toFailIfExists', function () {
        it('should toFailWhenOk', function () {
            var sut = ok(1)
                .map(function (a) { return a + 2; })
                .toFailWhenOk(function (a) { return new Error("only have ".concat(a)); });
            expect(sut.isFail()).toEqual(true);
            expect(sut.unwrapFail()).toBeInstanceOf(Error);
            expect(sut.unwrapFail().message).toEqual('only have 3');
        });
        it('should toFailWhenOkFrom from fail', function () {
            var sut = fail(new Error('started as error'))
                .map(function (a) { return a + 2; })
                .toFailWhenOkFrom(new Error('ended as an error'));
            expect(sut.isFail()).toEqual(true);
            expect(sut.unwrapFail()).toBeInstanceOf(Error);
            expect(sut.unwrapFail().message).toEqual('ended as an error');
        });
        it('should toFailWhenOk from fail', function () {
            var sut = fail(new Error('started as error'))
                .map(function (a) { return a + 2; })
                .toFailWhenOk(function (a) { return new Error("ended as an error ".concat(a)); });
            expect(sut.isFail()).toEqual(true);
            expect(sut.unwrapFail()).toBeInstanceOf(Error);
            expect(sut.unwrapFail().message).toEqual('started as error');
        });
        it('should toFailWhenOkFrom', function () {
            var sut = ok(1)
                .map(function (a) { return a + 2; })
                .toFailWhenOkFrom(new Error('error msg'));
            expect(sut.isFail()).toEqual(true);
            expect(sut.unwrapFail()).toBeInstanceOf(Error);
            expect(sut.unwrapFail().message).toEqual('error msg');
        });
    });
    describe('tap', function () {
        it('should tap.ok', function (done) {
            var sut = ok(1);
            sut.tap({
                ok: function (num) {
                    expect(num).toEqual(1);
                    done();
                },
                fail: done
            });
        });
        it('should tap.ok', function (done) {
            var sut = fail('failed');
            sut.tap({
                fail: function (str) {
                    expect(str).toEqual('failed');
                    done();
                },
                ok: done
            });
        });
        it('should tapOk', function (done) {
            var sut = ok(1);
            sut.tapOk(function (num) {
                expect(num).toEqual(1);
                done();
            });
            sut.tapFail(function () {
                expect(true).toBeFalsy();
                done();
            });
        });
        it('should tapFail', function (done) {
            var sut = fail('failed');
            sut.tapFail(function (err) {
                expect(err).toEqual('failed');
                done();
            });
            sut.tapOk(function () {
                expect(true).toBeFalsy();
                done();
            });
        });
        it('should tapThru', function (done) {
            var result = ok(1);
            var sideEffect = 0;
            var sut = result.tapOkThru(function (v) {
                sideEffect = v;
            }).map(function (a) { return a + 2; });
            expect(sut.unwrap()).toEqual(3);
            expect(sideEffect).toEqual(1);
            done();
        });
        it('should tapThru failed side', function (done) {
            var result = fail('failed');
            var sideEffect = 0;
            var sut = result.tapOkThru(function (v) {
                sideEffect = v;
            }).map(function (a) { return a + 2; });
            expect(sut.unwrapFail()).toEqual('failed');
            expect(sideEffect).toEqual(0);
            done();
        });
        it('should tapFailThru', function (done) {
            var result = fail('failed');
            var sideEffect = '';
            var sut = result.tapFailThru(function (v) {
                sideEffect = v + ' inside';
            }).map(function (a) { return a + 2; });
            expect(sut.unwrapFail()).toEqual('failed');
            expect(sideEffect).toEqual('failed inside');
            done();
        });
        it('should tapFailThru Ok side', function (done) {
            var result = ok(1);
            var sideEffect = '';
            var sut = result.tapFailThru(function (v) {
                sideEffect = v + ' inside';
            }).map(function (a) { return a + 2; });
            expect(sut.unwrap()).toEqual(3);
            expect(sideEffect).toEqual('');
            done();
        });
        it('should tapThru', function (done) {
            var result = ok(1);
            var sideEffect = 0;
            var sut = result.tapThru({
                ok: function (v) {
                    sideEffect = v;
                }
            }).map(function (a) { return a + 2; });
            expect(sut.unwrap()).toEqual(3);
            expect(sideEffect).toEqual(1);
            done();
        });
        it('should tapThru', function (done) {
            var result = ok(1);
            var sideEffect = 0;
            var sut = result.tapThru({
                ok: function (v) {
                    sideEffect = v;
                },
                fail: function (f) {
                    sideEffect = +f;
                }
            }).map(function (a) { return a + 2; });
            expect(sut.unwrap()).toEqual(3);
            expect(sideEffect).toEqual(1);
            done();
        });
        it('should tapThru', function (done) {
            var result = fail('failed');
            var sideEffect = '';
            var sut = result.tapThru({
                ok: function (v) {
                    sideEffect = v + '';
                },
                fail: function (f) {
                    sideEffect = f + ' in here';
                }
            }).map(function (a) { return a + 2; });
            expect(sut.unwrapFail()).toEqual('failed');
            expect(sideEffect).toEqual('failed in here');
            done();
        });
    });
});
//# sourceMappingURL=result.spec.js.map