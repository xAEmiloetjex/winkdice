import type { Falsy, OperatorFunction } from '../types.js';
export declare function every<T>(predicate: BooleanConstructor): OperatorFunction<T, Exclude<T, Falsy> extends never ? false : boolean>;
export declare function every<T>(predicate: (value: T, index: number) => boolean): OperatorFunction<T, boolean>;
