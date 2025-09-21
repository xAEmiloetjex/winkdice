import { Result, fail, ok, result, resultToPromise, resultToObservable } from './public_api';
describe('result api', function () {
    it('should export', function () {
        expect(fail(Error('Test'))).toBeInstanceOf(Result);
        expect(ok(1)).toBeInstanceOf(Result);
        expect(result(function () { return true; }, 1, Error('Test'))).toBeInstanceOf(Result);
        expect(typeof resultToPromise).toEqual('function');
        expect(typeof resultToObservable).toEqual('function');
    });
});
//# sourceMappingURL=pubcli_api.spec.js.map