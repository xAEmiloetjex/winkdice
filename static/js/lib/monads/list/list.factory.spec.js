import { listFrom, listOf } from './list.factory';
describe('List Factory', function () {
    describe(listFrom.name, function () {
        it('should', function () {
            var sut = listFrom([1, 2]).filter(function (a) { return a > 1; });
            expect(sut.toArray()).toEqual([2]);
        });
        it('should handle undefined', function () {
            var sut = listFrom().filter(function (a) { return a > 1; });
            expect(sut.toArray()).toEqual([]);
        });
    });
    describe(listOf.name, function () {
        it('should handle nominal', function () {
            var sut = listOf(1, 2).filter(function (a) { return a > 1; });
            expect(sut.toArray()).toEqual([2]);
        });
        it('should handle undefined', function () {
            var sut = listOf().filter(function (a) { return a > 1; });
            expect(sut.toArray()).toEqual([]);
        });
    });
});
//# sourceMappingURL=list.factory.spec.js.map