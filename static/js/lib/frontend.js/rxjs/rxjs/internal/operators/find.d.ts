import type { Subscriber } from '../../../observable/index.js';
import { Observable } from '../../../observable/index.js';
import type { OperatorFunction, TruthyTypesOf } from '../types.js';
export declare function find<T>(predicate: BooleanConstructor): OperatorFunction<T, TruthyTypesOf<T>>;
export declare function find<T, S extends T>(predicate: (value: T, index: number, source: Observable<T>) => value is S): OperatorFunction<T, S | undefined>;
export declare function find<T>(predicate: (value: T, index: number, source: Observable<T>) => boolean): OperatorFunction<T, T | undefined>;
export declare function createFind<T>(predicate: (value: T, index: number, source: Observable<T>) => boolean, emit: 'value' | 'index', source: Observable<T>, destination: Subscriber<any>): void;
