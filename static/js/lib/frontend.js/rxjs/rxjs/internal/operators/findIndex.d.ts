import { Observable } from '../../../observable/index.js';
import type { Falsy, OperatorFunction } from '../types.js';
export declare function findIndex<T>(predicate: BooleanConstructor): OperatorFunction<T, T extends Falsy ? -1 : number>;
export declare function findIndex<T>(predicate: (value: T, index: number, source: Observable<T>) => boolean): OperatorFunction<T, number>;
