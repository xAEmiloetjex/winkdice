import { map, of } from '/js/lib/rxjs/index.js';
import { ok, fail } from '../result.factory';
import { unwrapResultAsObservable } from './unwrap-result';
describe('unwrapResult', function () {
    it('should unwrap ok', function (done) {
        var sut = of(ok(1));
        sut.pipe(unwrapResultAsObservable(), map(function (a) { return a + 1; })).subscribe({
            next: function (v) {
                expect(v).toEqual(2);
                done();
            },
            error: function (e) {
                expect('should not emit from .error').toEqual(false);
                done(e);
            }
        });
    });
    it('should unwrap fail', function (done) {
        var sut = of(fail('i failed'));
        sut.pipe(unwrapResultAsObservable(), map(function (a) { return a + 2; })).subscribe({
            error: function (v) {
                expect(v).toEqual('i failed');
                done();
            },
            next: function (val) {
                expect('should not emit from .next').toEqual(false);
                done(val);
            }
        });
    });
});
//# sourceMappingURL=unwrap-result.spec.js.map