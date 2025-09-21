import type { SchedulerLike } from '../types.js';
import { Observable } from '../../../observable/index.js';
export declare function scheduleAsyncIterable<T>(input: AsyncIterable<T>, scheduler: SchedulerLike): Observable<T>;
