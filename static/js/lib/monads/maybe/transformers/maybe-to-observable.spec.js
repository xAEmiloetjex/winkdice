import { assert, integer, property } from 'fast-check';
import { merge, of } from '/js/lib/rxjs/index.js';
import { count } from '/js/lib/rxjs/operators/index.js';
import { maybe, maybeToObservable } from '../public_api';
describe('maybeToObservable', function () {
    var numRuns = 100;
    it('emits a value when containing a value', function () {
        expect.assertions(numRuns);
        assert(property(integer(), function (a) {
            var m = maybe(a);
            var o = maybeToObservable(m);
            o.subscribe(function (val) { return expect(val).toBe(a); });
        }), {
            numRuns: numRuns
        });
    });
    it('immediately completes if there is no contained value', function (done) {
        var m = maybe();
        var o = maybeToObservable(m);
        var c = of(1);
        merge(o, c)
            .pipe(count())
            .subscribe(function (count) {
            expect(count).toBe(1);
            done();
        });
    });
});
//# sourceMappingURL=maybe-to-observable.spec.js.map