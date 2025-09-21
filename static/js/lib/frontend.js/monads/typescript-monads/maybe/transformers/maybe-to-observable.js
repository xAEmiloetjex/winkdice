import { EMPTY, of } from '../../../../rxjs/rxjs/index.js';
import { take } from '../../../../rxjs/rxjs/operators/index.js';
/**
 * Convert a Maybe into an observable
 *
 * If the Maybe is empty, the observable will immediately complete without emitting a value, otherwise it will emit
 * the value contained and complete.
 *
 * @requires rxjs@^7.0
 * @example
 * of(maybe(5)).pipe(
 *   flatMap(maybeToObservable)
 * ).subscribe(a => console.log(a))
 * // prints 5 and completes
 *
 * of(maybe()).pipe(
 *   flatMap(maybeToObservable)
 * ).subscribe(a => console.log(a))
 * // immediately completes with no emitted value
 */
export function maybeToObservable(m) {
    return m.isNone() ? EMPTY : of(m.valueOrThrow('isNone returned false for empty IMaybe.')).pipe(take(1));
}
