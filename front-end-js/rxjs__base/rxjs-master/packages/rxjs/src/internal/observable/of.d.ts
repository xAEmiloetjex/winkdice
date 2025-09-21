import type { ValueFromArray } from '../types.js';
import type { Observable } from '@rxjs/observable';
export declare function of(value: null): Observable<null>;
export declare function of(value: undefined): Observable<undefined>;
export declare function of(): Observable<never>;
export declare function of<T>(value: T): Observable<T>;
export declare function of<A extends readonly unknown[]>(...values: A): Observable<ValueFromArray<A>>;
