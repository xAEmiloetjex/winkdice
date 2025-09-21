import { Subject } from './Subject.js';
import type { Subscriber } from '@rxjs/observable';
/**
 * A variant of Subject that only emits a value when it completes. It will emit
 * its latest value to all its observers on completion.
 */
export declare class AsyncSubject<T> extends Subject<T> {
    private _value;
    private _hasValue;
    private _isComplete;
    /** @internal */
    protected _checkFinalizedStatuses(subscriber: Subscriber<T>): void;
    next(value: T): void;
    complete(): void;
}
