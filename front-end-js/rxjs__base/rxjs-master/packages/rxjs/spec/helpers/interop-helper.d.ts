import type { Observable, Subject } from 'rxjs';
import { Subscriber } from 'rxjs';
/**
 * Returns an observable that will be deemed by this package's implementation
 * to be an observable that requires interop. The returned observable will fail
 * the `instanceof Observable` test and will deem any `Subscriber` passed to
 * its `subscribe` method to be untrusted.
 */
export declare function asInteropObservable<T>(observable: Observable<T>): Observable<T>;
/**
 * Returns a subject that will be deemed by this package's implementation to
 * be untrusted. The returned subject will not include the symbol that
 * identifies trusted subjects.
 */
export declare function asInteropSubject<T>(subject: Subject<T>): Subject<T>;
/**
 * Returns a subscriber that will be deemed by this package's implementation to
 * be untrusted. The returned subscriber will fail the `instanceof Subscriber`
 * test and will not include the symbol that identifies trusted subscribers.
 */
export declare function asInteropSubscriber<T>(subscriber: Subscriber<T>): Subscriber<T>;
