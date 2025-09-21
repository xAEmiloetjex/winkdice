import type { OperatorFunction, ValueFromArray } from '../types.js';
export declare function startWith<T>(value: null): OperatorFunction<T, T | null>;
export declare function startWith<T>(value: undefined): OperatorFunction<T, T | undefined>;
export declare function startWith<T, A extends readonly unknown[] = T[]>(...values: A): OperatorFunction<T, T | ValueFromArray<A>>;
