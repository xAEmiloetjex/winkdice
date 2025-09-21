import type { Subscriber } from '../../../observable/index';
import { Observable } from '../../../observable/index.js';
import type { ObservableInput, ObservedValueOf, ObservableInputTuple } from '../types.js';
import type { AnyCatcher } from '../AnyCatcher.js';
/**
 * You have passed `any` here, we can't figure out if it is
 * an array or an object, so you're getting `unknown`. Use better types.
 * @param arg Something typed as `any`
 */
export declare function combineLatest<T extends AnyCatcher>(arg: T): Observable<unknown>;
export declare function combineLatest(sources: []): Observable<never>;
export declare function combineLatest<A extends readonly unknown[]>(sources: readonly [...ObservableInputTuple<A>]): Observable<A>;
export declare function combineLatest<A extends readonly unknown[], R>(sources: readonly [...ObservableInputTuple<A>], resultSelector: (...values: A) => R): Observable<R>;
export declare function combineLatest(sourcesObject: {
    [K in any]: never;
}): Observable<never>;
export declare function combineLatest<T extends Record<string, ObservableInput<any>>>(sourcesObject: T): Observable<{
    [K in keyof T]: ObservedValueOf<T[K]>;
}>;
export declare function combineLatestInit(observables: ObservableInput<any>[], valueTransform?: (values: any[]) => any): (destination: Subscriber<any>) => void;
