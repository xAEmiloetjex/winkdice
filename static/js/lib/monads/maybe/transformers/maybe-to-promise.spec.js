import { maybeToPromise } from './maybe-to-promise';
import { maybe } from '../public_api';
describe('maybeToPromise', function () {
    it('should flatmap', function () {
        var sut = new Promise(function (resolve) { return resolve(maybe('test')); });
        sut
            .then(maybeToPromise())
            .then(function (result) { return expect(result).toEqual('test'); })
            .catch(function () { return expect(false).toBe(true); });
    });
    it('should catch w/ empty message', function () {
        var sut = new Promise(function (resolve) { return resolve(maybe()); });
        sut
            .then(maybeToPromise())
            .then(function () { return expect(false).toBe(true); })
            .catch(function (error) { return expect(error).toBeUndefined(); });
    });
    it('should catch w/ custom message', function () {
        var sut = new Promise(function (resolve) { return resolve(maybe()); });
        sut
            .then(maybeToPromise('caught!'))
            .then(function () { return expect(false).toBe(true); })
            .catch(function (error) { return expect(error).toEqual('caught!'); });
    });
    it('should catch w/ custom object', function () {
        var sut = new Promise(function (resolve) { return resolve(maybe()); });
        sut
            .then(maybeToPromise({ error: { msg: 'test' } }))
            .then(function () { return expect(false).toBe(true); })
            .catch(function (error) { return expect(error).toEqual({ error: { msg: 'test' } }); });
    });
});
//# sourceMappingURL=maybe-to-promise.spec.js.map