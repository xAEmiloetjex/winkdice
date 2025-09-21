import { of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
it('should support a user-defined type guard', () => {
    const o = of('foo').pipe(takeWhile((s) => true)); // $ExpectType Observable<"foo">
});
it('should support a user-defined type guard with inclusive option', () => {
    const o = of('foo').pipe(takeWhile((s) => true, false)); // $ExpectType Observable<"foo">
});
it('should support a predicate', () => {
    const o = of('foo').pipe(takeWhile(s => true)); // $ExpectType Observable<string>
});
it('should support a predicate with inclusive option', () => {
    const o = of('foo').pipe(takeWhile(s => true, true)); // $ExpectType Observable<string>
});
it('should properly support Boolean constructor', () => {
    const a = of(false, 0, -0, 0n, '', null, undefined).pipe(takeWhile(Boolean)); // $ExpectType Observable<never>
    const b = of(false, 0, -0, 0n, '', null, undefined).pipe(takeWhile(Boolean, true)); // $ExpectType Observable<false | "" | 0 | 0n | null | undefined>
    const c = of(false, 0, 'hi', -0, 0n, '', null, undefined).pipe(takeWhile(Boolean)); // $ExpectType Observable<"hi">
    const d = of(false, 0, 'hi', -0, 0n, '', null, undefined).pipe(takeWhile(Boolean, false)); // $ExpectType Observable<"hi">
    const e = of(false, 0, 'hi', -0, 0n, '', null, undefined).pipe(takeWhile(Boolean, true)); // $ExpectType Observable<false | "" | 0 | 0n | "hi" | null | undefined>
    const f = of(1, ['hi'], false, 0, -0, 0n, '', null, undefined).pipe(takeWhile(Boolean, true)); // $ExpectType Observable<number | false | "" | 0n | string[] | null | undefined>
});
it('should properly handle predicates that always return false', () => {
    const a = of(1, 2, 3).pipe(takeWhile(() => false)); // $ExpectType Observable<number>
    const b = of(1, 2, 3).pipe(takeWhile(() => false, true)); // $ExpectType Observable<number>
});
it('should support inference from a predicate that returns any', () => {
    function isTruthy(value) {
        return !!value;
    }
    const o$ = of(1).pipe(takeWhile(isTruthy)); // $ExpectType Observable<number>
});
