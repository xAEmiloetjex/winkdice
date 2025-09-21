import { fail, ok } from '../result.factory';
import { resultToObservable } from './result-to-observable';
describe(resultToObservable.name, function () {
    it('should be ok', function (done) {
        var result = ok('hello');
        var sut = resultToObservable(result);
        sut
            .subscribe({
            next: function (v) {
                expect(v).toEqual('hello');
                done();
            },
            error: done
        });
    });
    it('should be ok', function (done) {
        var result = fail(new Error('I failed, sorry.'));
        var sut = resultToObservable(result);
        sut
            .subscribe({
            error: function (v) {
                expect(v.message).toEqual('I failed, sorry.');
                done();
            },
            next: done
        });
    });
});
//# sourceMappingURL=result-to-observable.spec.js.map