import { Observable } from '@rxjs/observable';
import type { MonoTypeOperatorFunction, OperatorFunction, TruthyTypesOf } from '../types.js';
export declare function single<T>(predicate: BooleanConstructor): OperatorFunction<T, TruthyTypesOf<T>>;
export declare function single<T>(predicate?: (value: T, index: number, source: Observable<T>) => boolean): MonoTypeOperatorFunction<T>;
