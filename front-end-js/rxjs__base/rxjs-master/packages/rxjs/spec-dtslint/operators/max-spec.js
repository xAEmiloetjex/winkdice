import { of } from 'rxjs';
import { max } from 'rxjs/operators';
it('should infer correctly', () => {
    const a = of(1, 2, 3).pipe(max()); // $ExpectType Observable<number>
    const b = of('abc', 'bcd', 'def').pipe(max()); // $ExpectType Observable<string>
});
it(' should except empty comparer', () => {
    const a = of(1, 2, 3).pipe(max()); // $ExpectType Observable<number>
});
it('should enforce comparer types', () => {
    const a = of(1, 2, 3).pipe(max((a, b) => a - b)); // $ExpectType Observable<number>
    const b = of(1, 2, 3).pipe(max((a, b) => 0)); // $ExpectError
    const c = of(1, 2, 3).pipe(max((a, b) => 0)); // $ExpectError
});
