import type { SchedulerLike } from '../types.js';
export declare function schedulePromise<T>(input: PromiseLike<T>, scheduler: SchedulerLike): import("../../../observable/observable.js").Observable<T>;
