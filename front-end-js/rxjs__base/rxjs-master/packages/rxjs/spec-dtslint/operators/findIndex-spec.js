import { of } from 'rxjs';
import { findIndex } from 'rxjs/operators';
it('should infer correctly', () => {
    const o = of('foo', 'bar', 'baz').pipe(findIndex(p => p === 'foo')); // $ExpectType Observable<number>
});
it('should support a predicate that takes an index ', () => {
    const o = of('foo', 'bar', 'baz').pipe(findIndex((p, index) => index === 3)); // $ExpectType Observable<number>
});
it('should support a predicate that takes a source ', () => {
    const o = of('foo', 'bar', 'baz').pipe(findIndex((p, index, source) => p === 'foo')); // $ExpectType Observable<number>
});
it('should enforce types', () => {
    const o = of('foo', 'bar', 'baz').pipe(findIndex()); // $ExpectError
});
it('should enforce predicate types', () => {
    const o = of('foo', 'bar', 'baz').pipe(findIndex((p) => p === 3)); // $ExpectError
    const p = of('foo', 'bar', 'baz').pipe(findIndex((p, index) => p === 3)); // $ExpectError
    const q = of('foo', 'bar', 'baz').pipe(findIndex((p, index, source) => p === 3)); // $ExpectError
});
it('should enforce predicate return type', () => {
    const o = of('foo', 'bar', 'baz').pipe(findIndex(p => p)); // $ExpectError
});
it('should support Boolean constructor', () => {
    const a = of(0, -0, null, undefined, false, '').pipe(findIndex(Boolean)); // $ExpectType Observable<-1>
    const b = of(0, -0, null, 'hi there', undefined, false, '').pipe(findIndex(Boolean)); // $ExpectType Observable<number>
});
it('should support inference from a predicate that returns any', () => {
    function isTruthy(value) {
        return !!value;
    }
    const a = of(1).pipe(findIndex(isTruthy)); // $ExpectType Observable<number>
});
