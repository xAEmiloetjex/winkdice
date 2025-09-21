import type { SchedulerLike, ReadableStreamLike } from '../types.js';
import type { Observable } from '../../../observable/index.js';
export declare function scheduleReadableStreamLike<T>(input: ReadableStreamLike<T>, scheduler: SchedulerLike): Observable<T>;
