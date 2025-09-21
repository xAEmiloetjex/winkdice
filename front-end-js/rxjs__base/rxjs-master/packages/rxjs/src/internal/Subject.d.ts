import type { Subscriber } from '@rxjs/observable';
import { Observable, Subscription } from '@rxjs/observable';
import type { Observer, SubscriptionLike } from './types.js';
/**
 * A Subject is a special type of Observable that allows values to be
 * multicasted to many Observers. Subjects are like EventEmitters.
 *
 * Every Subject is an Observable and an Observer. You can subscribe to a
 * Subject, and you can call next to feed values as well as error and complete.
 */
export declare class Subject<T> extends Observable<T> implements SubscriptionLike {
    /** @internal */
    _closed: boolean;
    /**
     * Will return true if this subject has been closed and is no longer accepting new values.
     */
    get closed(): boolean;
    private _observerCounter;
    private currentObservers;
    /**
     * This is used to track a known array of observers, so we don't have to
     * clone them while iterating to prevent reentrant behaviors.
     * (for example, what if the subject is subscribed to when nexting to an observer)
     */
    private observerSnapshot;
    /** @internal */
    get observers(): Observer<T>[];
    /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
    hasError: boolean;
    /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
    thrownError: any;
    constructor();
    protected _clearObservers(): void;
    next(value: T): void;
    error(err: any): void;
    complete(): void;
    unsubscribe(): void;
    get observed(): boolean;
    /** @internal */
    protected _subscribe(subscriber: Subscriber<T>): Subscription;
    /** @internal */
    protected _innerSubscribe(subscriber: Subscriber<any>): any;
    /** @internal */
    protected _checkFinalizedStatuses(subscriber: Subscriber<any>): void;
    /**
     * Creates a new Observable with this Subject as the source. You can do this
     * to create custom Observer-side logic of the Subject and conceal it from
     * code that uses the Observable.
     * @return Observable that this Subject casts to.
     */
    asObservable(): Observable<T>;
}
