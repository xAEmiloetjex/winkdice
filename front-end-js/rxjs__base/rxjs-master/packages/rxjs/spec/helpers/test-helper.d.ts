import type { Observable, ObservableInput } from 'rxjs';
export declare function lowerCaseO<T>(...args: Array<any>): Observable<T>;
export declare const createObservableInputs: <T>(value: T) => Observable<ObservableInput<T>>;
/**
 * Used to signify no subscriptions took place to `expectSubscriptions` assertions.
 */
export declare const NO_SUBS: string[];
