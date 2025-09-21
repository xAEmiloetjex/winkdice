import { maybe, Maybe, either, Either, ok, fail, Result, reader, Reader, listOf, List, unwrapResultAsObservable } from './index';
describe('package api', function () {
    it('should export maybe', function () {
        expect(maybe(1)).toBeInstanceOf(Maybe);
    });
    it('should export either', function () {
        expect(either(1)).toBeInstanceOf(Either);
    });
    it('should export result', function () {
        expect(ok(1)).toBeInstanceOf(Result);
        expect(fail(1)).toBeInstanceOf(Result);
    });
    it('should export reader', function () {
        expect(reader(function () { return 1; })).toBeInstanceOf(Reader);
    });
    it('should export reader', function () {
        expect(listOf(1, 2)).toBeInstanceOf(List);
    });
    it('should export unwrapResult', function () {
        expect(unwrapResultAsObservable()).toBeInstanceOf(Function);
    });
});
//# sourceMappingURL=index.spec.js.map