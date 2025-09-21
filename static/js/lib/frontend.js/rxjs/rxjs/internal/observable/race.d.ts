import type { Subscriber } from '../../../observable/index';
import { Observable } from '../../../observable/index.js';
import type { ObservableInput, ObservableInputTuple } from '../types.js';
export declare function race<T extends readonly unknown[]>(inputs: [...ObservableInputTuple<T>]): Observable<T[number]>;
export declare function race<T extends readonly unknown[]>(...inputs: [...ObservableInputTuple<T>]): Observable<T[number]>;
/**
 * An observable initializer function for both the static version and the
 * operator version of race.
 * @param sources The sources to race
 */
export declare function raceInit<T>(sources: ObservableInput<T>[]): (destination: Subscriber<T>) => void;
