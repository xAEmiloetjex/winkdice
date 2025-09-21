import { Observable } from '../../../observable/index.js';
import type { SchedulerLike } from '../types.js';
export declare function scheduleArray<T>(input: ArrayLike<T>, scheduler: SchedulerLike): Observable<T>;
