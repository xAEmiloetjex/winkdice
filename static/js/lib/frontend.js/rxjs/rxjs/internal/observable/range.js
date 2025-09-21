import { Observable } from '../../../observable/index.js';
import { EMPTY } from './empty.js';
import { executeSchedule } from '../util/executeSchedule.js';
/**
 * Creates an Observable that emits a sequence of numbers within a specified
 * range.
 *
 * <span class="informal">Emits a sequence of numbers in a range.</span>
 *
 * ![](range.png)
 *
 * `range` operator emits a range of sequential integers, in order, where you
 * select the `start` of the range and its `length`. By default, uses no
 * {@link SchedulerLike} and just delivers the notifications synchronously, but may use
 * an optional {@link SchedulerLike} to regulate those deliveries.
 *
 * ## Example
 *
 * Produce a range of numbers
 *
 * ```ts
 * import { range } from 'rxjs';
 *
 * const numbers = range(1, 3);
 *
 * numbers.subscribe({
 *   next: value => console.log(value),
 *   complete: () => console.log('Complete!')
 * });
 *
 * // Logs:
 * // 1
 * // 2
 * // 3
 * // 'Complete!'
 * ```
 *
 * @see {@link timer}
 * @see {@link interval}
 *
 * @param start The value of the first integer in the sequence.
 * @param count The number of sequential integers to generate.
 * @param scheduler A {@link SchedulerLike} to use for scheduling the emissions
 * of the notifications.
 * @return An Observable of numbers that emits a finite range of sequential integers.
 */
export function range(start, count, scheduler) {
    if (count == null) {
        // If one argument was passed, it's the count, not the start.
        count = start;
        start = 0;
    }
    if (count <= 0) {
        // No count? We're going nowhere. Return EMPTY.
        return EMPTY;
    }
    // Where the range should stop.
    const end = count + start;
    return new Observable(scheduler
        ? // The deprecated scheduled path.
            (subscriber) => {
                let n = start;
                const emit = () => {
                    if (n < end) {
                        subscriber.next(n++);
                        if (!subscriber.closed) {
                            executeSchedule(subscriber, scheduler, emit);
                        }
                    }
                    else {
                        subscriber.complete();
                    }
                };
                executeSchedule(subscriber, scheduler, emit);
            }
        : // Standard synchronous range.
            (subscriber) => {
                let n = start;
                while (n < end && !subscriber.closed) {
                    subscriber.next(n++);
                }
                subscriber.complete();
            });
}
