import { maybe, none, some } from './maybe.factory';
describe('should construct maybes', function () {
    it('should handle "maybe" case', function () {
        var sut = 'asdasd';
        expect(maybe(sut).isSome()).toEqual(true);
    });
    it('should handle "none" case', function () {
        expect(none().isNone()).toEqual(true);
    });
    it('should handle "some" case', function () {
        expect(some('test').isSome()).toEqual(true);
    });
});
//# sourceMappingURL=maybe.factory.spec.js.map