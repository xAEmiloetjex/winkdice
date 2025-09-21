import { Observable, Subscription } from '../../observable/index.js';
/**
 * A Subject is a special type of Observable that allows values to be
 * multicasted to many Observers. Subjects are like EventEmitters.
 *
 * Every Subject is an Observable and an Observer. You can subscribe to a
 * Subject, and you can call next to feed values as well as error and complete.
 */
export class Subject extends Observable {
    /** @internal */
    _closed = false;
    /**
     * Will return true if this subject has been closed and is no longer accepting new values.
     */
    get closed() {
        return this._closed;
    }
    _observerCounter = 0;
    currentObservers = new Map();
    /**
     * This is used to track a known array of observers, so we don't have to
     * clone them while iterating to prevent reentrant behaviors.
     * (for example, what if the subject is subscribed to when nexting to an observer)
     */
    observerSnapshot;
    /** @internal */
    get observers() {
        return (this.observerSnapshot ??= Array.from(this.currentObservers.values()));
    }
    /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
    hasError = false;
    /** @deprecated Internal implementation detail, do not use directly. Will be made internal in v8. */
    thrownError = null;
    constructor() {
        // NOTE: This must be here to obscure Observable's constructor.
        super();
    }
    _clearObservers() {
        this.currentObservers.clear();
        this.observerSnapshot = undefined;
    }
    next(value) {
        if (!this._closed) {
            const { observers } = this;
            const len = observers.length;
            for (let i = 0; i < len; i++) {
                observers[i].next(value);
            }
        }
    }
    error(err) {
        if (!this._closed) {
            this.hasError = this._closed = true;
            this.thrownError = err;
            const { observers } = this;
            const len = observers.length;
            for (let i = 0; i < len; i++) {
                observers[i].error(err);
            }
            this._clearObservers();
        }
    }
    complete() {
        if (!this._closed) {
            this._closed = true;
            const { observers } = this;
            const len = observers.length;
            for (let i = 0; i < len; i++) {
                observers[i].complete();
            }
            this._clearObservers();
        }
    }
    unsubscribe() {
        this._closed = true;
        this._clearObservers();
    }
    get observed() {
        return this.currentObservers.size > 0;
    }
    /** @internal */
    _subscribe(subscriber) {
        this._checkFinalizedStatuses(subscriber);
        return this._innerSubscribe(subscriber);
    }
    /** @internal */
    _innerSubscribe(subscriber) {
        if (this.hasError || this._closed) {
            return Subscription.EMPTY;
        }
        const { currentObservers } = this;
        const observerId = this._observerCounter++;
        currentObservers.set(observerId, subscriber);
        this.observerSnapshot = undefined;
        subscriber.add(() => {
            currentObservers.delete(observerId);
            this.observerSnapshot = undefined;
        });
        return subscriber;
    }
    /** @internal */
    _checkFinalizedStatuses(subscriber) {
        const { hasError, thrownError, _closed } = this;
        if (hasError) {
            subscriber.error(thrownError);
        }
        else if (_closed) {
            subscriber.complete();
        }
    }
    /**
     * Creates a new Observable with this Subject as the source. You can do this
     * to create custom Observer-side logic of the Subject and conceal it from
     * code that uses the Observable.
     * @return Observable that this Subject casts to.
     */
    asObservable() {
        return new Observable((subscriber) => this.subscribe(subscriber));
    }
}
