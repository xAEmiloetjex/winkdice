import { Subject } from './Subject.js';
import type { Subscriber, Subscription } from '@rxjs/observable';
/**
 * A variant of Subject that requires an initial value and emits its current
 * value whenever it is subscribed to.
 */
export declare class BehaviorSubject<T> extends Subject<T> {
    private _value;
    constructor(_value: T);
    get value(): T;
    /** @internal */
    protected _subscribe(subscriber: Subscriber<T>): Subscription;
    getValue(): T;
    next(value: T): void;
}
