import { Subject } from './Subject.js';
/**
 * A variant of Subject that only emits a value when it completes. It will emit
 * its latest value to all its observers on completion.
 */
export class AsyncSubject extends Subject {
    _value = null;
    _hasValue = false;
    _isComplete = false;
    /** @internal */
    _checkFinalizedStatuses(subscriber) {
        const { hasError, _hasValue, _value, thrownError, _closed, _isComplete } = this;
        if (hasError) {
            subscriber.error(thrownError);
        }
        else if (_closed || _isComplete) {
            _hasValue && subscriber.next(_value);
            subscriber.complete();
        }
    }
    next(value) {
        if (!this._closed) {
            this._value = value;
            this._hasValue = true;
        }
    }
    complete() {
        const { _hasValue, _value, _isComplete } = this;
        if (!_isComplete) {
            this._isComplete = true;
            _hasValue && super.next(_value);
            super.complete();
        }
    }
}
