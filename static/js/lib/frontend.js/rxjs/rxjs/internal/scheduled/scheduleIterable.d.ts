import { Observable } from '../../../observable/index.js';
import type { SchedulerLike } from '../types.js';
/**
 * Used in {@link scheduled} to create an observable from an Iterable.
 * @param input The iterable to create an observable from
 * @param scheduler The scheduler to use
 */
export declare function scheduleIterable<T>(input: Iterable<T>, scheduler: SchedulerLike): Observable<T>;
