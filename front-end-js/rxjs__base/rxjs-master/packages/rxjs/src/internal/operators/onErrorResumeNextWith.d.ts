import type { ObservableInputTuple, OperatorFunction } from '../types.js';
export declare function onErrorResumeNextWith<T, A extends readonly unknown[]>(sources: [...ObservableInputTuple<A>]): OperatorFunction<T, T | A[number]>;
export declare function onErrorResumeNextWith<T, A extends readonly unknown[]>(...sources: [...ObservableInputTuple<A>]): OperatorFunction<T, T | A[number]>;
