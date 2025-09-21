import { Observable } from '../../../observable/index.js';
import type { ObservableInput, OperatorFunction } from '../types.js';
/**
 * Branch out the source Observable values as a nested Observable using a
 * factory function of closing Observables to determine when to start a new
 * window.
 *
 * <span class="informal">It's like {@link bufferWhen}, but emits a nested
 * Observable instead of an array.</span>
 *
 * ![](windowWhen.svg)
 *
 * Returns an Observable that emits Observable windows of items it collects from
 * the source Observable. The output Observable emits connected, non-overlapping
 * windows. It emits the current window immediately when subscribing to the source
 * Observable and opens a new one whenever the Observable produced by the specified
 * `closingSelector` function emits `next`. When an Observable returned by the
 * `closingSelector` emits `next`, the previous window completes and a new window
 * is emitted to the output subscriber.
 *
 * ## Example
 *
 * Emit only the first two clicks events in every window of [1-5] random seconds
 *
 * ```ts
 * import { fromEvent, windowWhen, interval, map, take, mergeAll } from 'rxjs';
 *
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(
 *   windowWhen(() => interval(1000 + Math.random() * 4000)),
 *   map(win => win.pipe(take(2))), // take at most 2 emissions from each window
 *   mergeAll()                     // flatten the Observable-of-Observables
 * );
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link window}
 * @see {@link windowCount}
 * @see {@link windowTime}
 * @see {@link windowToggle}
 * @see {@link bufferWhen}
 *
 * @param closingSelector A function that takes no arguments and returns an
 * {@link ObservableInput} (that gets converted to Observable) that signals
 * when to close the previous window and start a new one. Note that a value (any value) must be
 * observed to signal window closure.
 * @return A function that returns an Observable of windows, which in turn are
 * Observables.
 */
export declare function windowWhen<T>(closingSelector: () => ObservableInput<any>): OperatorFunction<T, Observable<T>>;
