import type { SchedulerLike, ReadableStreamLike } from '../types.js';
import type { Observable } from '@rxjs/observable';
export declare function scheduleReadableStreamLike<T>(input: ReadableStreamLike<T>, scheduler: SchedulerLike): Observable<T>;
