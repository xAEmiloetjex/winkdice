import { fail, ok } from '../result.factory';
import { resultToPromise } from './result-to-promise';
describe('resultToPromise', function () {
    it('should map', function () {
        var sut = new Promise(function (resolve) { return resolve(ok('test')); });
        return sut
            .then(resultToPromise)
            .then(function (result) { return expect(result).toEqual('test'); })
            .catch(function () { return expect(false).toBe(true); });
    });
    it('should catch w/ fail result', function () {
        var sut = new Promise(function (resolve) { return resolve(fail(new Error('test error'))); });
        return sut
            .then(resultToPromise)
            .then(function () { return expect(false).toBe(true); })
            .catch(function (error) { return expect(error).toEqual(new Error('test error')); });
    });
});
//# sourceMappingURL=result-to-promise.spec.js.map