import { of } from 'rxjs';
import { min } from 'rxjs/operators';
it('should infer correctly', () => {
    const a = of(1, 2, 3).pipe(min()); // $ExpectType Observable<number>
    const b = of('abc', 'bcd', 'def').pipe(min()); // $ExpectType Observable<string>
});
it('should except empty comparer', () => {
    const a = of(1, 2, 3).pipe(min()); // $ExpectType Observable<number>
});
it('should enforce comparer types', () => {
    const a = of(1, 2, 3).pipe(min((a, b) => a - b)); // $ExpectType Observable<number>
    const b = of(1, 2, 3).pipe(min((a, b) => 0)); // $ExpectError
    const c = of(1, 2, 3).pipe(min((a, b) => 0)); // $ExpectError
});
