import type { Observable } from '@rxjs/observable';
import type { MonoTypeOperatorFunction, ObservableInput } from '../types.js';
/** @deprecated The `subscriptionDelay` parameter will be removed in v8. */
export declare function delayWhen<T>(delayDurationSelector: (value: T, index: number) => ObservableInput<any>, subscriptionDelay: Observable<any>): MonoTypeOperatorFunction<T>;
export declare function delayWhen<T>(delayDurationSelector: (value: T, index: number) => ObservableInput<any>): MonoTypeOperatorFunction<T>;
