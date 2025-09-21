import type { ObservableInput, ObservedValueOf, OperatorFunction } from '../types.js';
export declare function expand<T, O extends ObservableInput<unknown>>(project: (value: T, index: number) => O, concurrent?: number): OperatorFunction<T, ObservedValueOf<O>>;
