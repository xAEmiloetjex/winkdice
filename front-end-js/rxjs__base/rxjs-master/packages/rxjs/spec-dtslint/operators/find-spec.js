import { of } from 'rxjs';
import { find } from 'rxjs/operators';
it('should support a user-defined type guard', () => {
    const o = of('foo').pipe(find((s) => true)); // $ExpectType Observable<"foo" | undefined>
});
it('should support a user-defined type guard that takes an index', () => {
    const o = of('foo').pipe(find((s, index) => true)); // $ExpectType Observable<"foo" | undefined>
});
it('should support a user-defined type guard that takes an index and the source', () => {
    const o = of('foo').pipe(find((s, index, source) => true)); // $ExpectType Observable<"foo" | undefined>
});
it('should support a predicate', () => {
    const o = of('foo').pipe(find(s => true)); // $ExpectType Observable<string | undefined>
});
it('should support a predicate that takes an index', () => {
    const o = of('foo').pipe(find((s, index) => true)); // $ExpectType Observable<string | undefined>
});
it('should support a predicate that takes an index and the source', () => {
    const o = of('foo').pipe(find((s, index, source) => true)); // $ExpectType Observable<string | undefined>
});
it('should support Boolean properly', () => {
    const o1 = of('').pipe(find(Boolean)); // $ExpectType Observable<never>
    const o2 = of('', 'hi').pipe(find(Boolean)); // $ExpectType Observable<"hi">
    const o3 = of('', 0, 'test', 'what').pipe(find(Boolean)); // $ExpectType Observable<"test" | "what">
    const o5 = of(false, null, undefined, '', 0, 0).pipe(find(Boolean)); // $ExpectType Observable<never>
    // Intentionally weird looking: Because `Observable<boolean>` is `Observable<true | false>` and `true` is the truthy bit.
    const o4 = of(false, false, false, false).pipe(find(Boolean)); // $ExpectType Observable<true>
});
