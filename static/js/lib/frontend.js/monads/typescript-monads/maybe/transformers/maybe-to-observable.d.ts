import { Observable } from '../../../../rxjs/rxjs/index.js';
import { IMaybe } from '../maybe.interface.js';
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
export declare function maybeToObservable<A>(m: IMaybe<A>): Observable<A>;
