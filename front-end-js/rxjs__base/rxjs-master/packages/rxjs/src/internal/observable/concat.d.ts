import type { Observable } from '@rxjs/observable';
import type { ObservableInputTuple, SchedulerLike } from '../types.js';
export declare function concat<T extends readonly unknown[]>(...inputs: [...ObservableInputTuple<T>]): Observable<T[number]>;
export declare function concat<T extends readonly unknown[]>(...inputsAndScheduler: [...ObservableInputTuple<T>, SchedulerLike]): Observable<T[number]>;
