import type { Observable } from '../../../observable/index';
import type { ObservableInputTuple, SchedulerLike } from '../types.js';
export declare function merge<A extends readonly unknown[]>(...sources: [...ObservableInputTuple<A>]): Observable<A[number]>;
export declare function merge<A extends readonly unknown[]>(...sourcesAndConcurrency: [...ObservableInputTuple<A>, number?]): Observable<A[number]>;
/** @deprecated The `scheduler` parameter will be removed in v8. Use `scheduled` and `mergeAll`. Details: https://rxjs.dev/deprecations/scheduler-argument */
export declare function merge<A extends readonly unknown[]>(...sourcesAndScheduler: [...ObservableInputTuple<A>, SchedulerLike?]): Observable<A[number]>;
/** @deprecated The `scheduler` parameter will be removed in v8. Use `scheduled` and `mergeAll`. Details: https://rxjs.dev/deprecations/scheduler-argument */
export declare function merge<A extends readonly unknown[]>(...sourcesAndConcurrencyAndScheduler: [...ObservableInputTuple<A>, number?, SchedulerLike?]): Observable<A[number]>;
