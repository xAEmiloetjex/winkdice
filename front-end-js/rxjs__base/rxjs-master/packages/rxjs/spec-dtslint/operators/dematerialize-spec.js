import { of } from 'rxjs';
import { dematerialize } from 'rxjs/operators';
it('should infer correctly', () => {
    const o = of({ kind: 'N', value: 'foo' }).pipe(dematerialize()); // $ExpectType Observable<string>
});
it('should enforce types', () => {
    const o = of({ kind: 'N', value: 'foo' }).pipe(dematerialize(() => { })); // $ExpectError
});
it('should enforce types from POJOS', () => {
    const source = of({
        kind: 'N',
        value: 'test'
    }, {
        kind: 'N',
        value: 123
    }, {
        kind: 'N',
        value: [true, false]
    });
    const o = source.pipe(dematerialize()); // $ExpectType Observable<string | number | boolean[]>
    // NOTE: The `const` is required, because TS doesn't yet have a way to know for certain the
    // `kind` properties of these objects won't be mutated at runtime.
    const source2 = of({
        kind: 'N',
        value: 1
    }, {
        kind: 'C'
    });
    const o2 = source2.pipe(dematerialize()); // $ExpectType Observable<number>
    const source3 = of({
        kind: 'C'
    });
    const o3 = source3.pipe(dematerialize()); // $ExpectType Observable<never>
    const source4 = of({
        kind: 'E',
        error: new Error('bad')
    });
    const o4 = source4.pipe(dematerialize()); // $ExpectType Observable<never>
    const source5 = of({
        kind: 'E'
    });
    const o5 = source5.pipe(dematerialize()); // $ExpectError
    // Next notifications should have a value.
    const source6 = of({
        kind: 'N'
    });
    const o6 = source6.pipe(dematerialize()); // $ExpectError
});
it('should enforce Notification source', () => {
    const o = of('foo').pipe(dematerialize()); // $ExpectError
});
