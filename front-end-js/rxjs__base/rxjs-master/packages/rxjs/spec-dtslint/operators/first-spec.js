import { of } from 'rxjs';
import { first } from 'rxjs/operators';
const isFooBar = (value) => /^(foo|bar)$/.test(value);
it('should support an undefined predicate with no default', () => {
    const o = of('foo').pipe(first(undefined)); // $ExpectType Observable<string>
});
it('should support an undefined predicate with a T default', () => {
    const o = of('foo').pipe(first(undefined, 'bar')); // $ExpectType Observable<string>
});
it('should support an undefined predicate with a non-T default', () => {
    const o = of('foo').pipe(first(undefined, false)); // $ExpectType Observable<string | boolean>
});
it('should default D to T with an undefined predicate', () => {
    const o = of('foo').pipe(first(undefined)); // $Observable<string>
});
it('should support a null predicate with no default', () => {
    const o = of('foo').pipe(first(null)); // $ExpectType Observable<string>
});
it('should support a null predicate with a T default', () => {
    const o = of('foo').pipe(first(null, 'bar')); // $ExpectType Observable<string>
});
it('should support a null predicate with a non-T default', () => {
    const o = of('foo').pipe(first(null, false)); // $ExpectType Observable<string | boolean>
});
it('should default D to T with a null predicate', () => {
    const o = of('foo').pipe(first(null)); // $Observable<string>
});
it('should support a user-defined type guard with no default', () => {
    const o = of('foo').pipe(first(isFooBar)); // $ExpectType Observable<"foo" | "bar">
});
it('should support a user-defined type guard with an S default', () => {
    const o = of('foo').pipe(first(isFooBar, 'bar')); // $ExpectType Observable<"foo" | "bar">
});
it('should widen a user-defined type guard with a non-S default', () => {
    const o = of('foo').pipe(first(isFooBar, false)); // $ExpectType Observable<boolean | "foo" | "bar">
});
it('should support a predicate with no default', () => {
    const o = of('foo').pipe(first(x => !!x)); // $ExpectType Observable<string>
});
it('should support a predicate with a T default', () => {
    const o = of('foo').pipe(first(x => !!x, 'bar')); // $ExpectType Observable<string>
});
it('should support a predicate with a non-T default', () => {
    const o = of('foo').pipe(first(x => !!x, false)); // $ExpectType Observable<string | boolean>
});
it('should work properly with the Boolean constructor', () => {
    const o1 = of('').pipe(first(Boolean)); // $ExpectType Observable<never>
    const o2 = of('', 'hi').pipe(first(Boolean)); // $ExpectType Observable<string>
    const o3 = of('', 'hi').pipe(first(Boolean)); // $ExpectType Observable<"hi">
    const o4 = of(0, 'hi').pipe(first(Boolean)); // $ExpectType Observable<"hi">
    const o5 = of(0, 'hi', 'what').pipe(first(Boolean)); // $ExpectType Observable<"hi" | "what">
});
it('should support inference from a predicate that returns any', () => {
    function isTruthy(value) {
        return !!value;
    }
    const o$ = of(1).pipe(first(isTruthy)); // $ExpectType Observable<number>
});
