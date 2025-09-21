import { isScheduler } from '../util/isScheduler.js';
import { Observable } from '../Observable.js';
import { mapOneOrManyArgs } from '../util/mapOneOrManyArgs.js';
import { AsyncSubject } from '../AsyncSubject.js';
import { scheduled } from '../scheduled/scheduled.js';
export function bindCallbackInternals(isNodeStyle, callbackFunc, resultSelector, scheduler) {
    if (resultSelector) {
        if (isScheduler(resultSelector)) {
            scheduler = resultSelector;
        }
        else {
            return function (...args) {
                return mapOneOrManyArgs(resultSelector)(bindCallbackInternals(isNodeStyle, callbackFunc, scheduler).apply(this, args));
            };
        }
    }
    if (scheduler) {
        return function (...args) {
            return scheduled(bindCallbackInternals(isNodeStyle, callbackFunc).apply(this, args), scheduler);
        };
    }
    return function (...args) {
        const subject = new AsyncSubject();
        let uninitialized = true;
        return new Observable((subscriber) => {
            const subs = subject.subscribe(subscriber);
            if (uninitialized) {
                uninitialized = false;
                let isAsync = false;
                let isComplete = false;
                callbackFunc.apply(this, [
                    ...args,
                    (...results) => {
                        if (isNodeStyle) {
                            const err = results.shift();
                            if (err != null) {
                                subject.error(err);
                                return;
                            }
                        }
                        subject.next(1 < results.length ? results : results[0]);
                        isComplete = true;
                        if (isAsync) {
                            subject.complete();
                        }
                    },
                ]);
                if (isComplete) {
                    subject.complete();
                }
                isAsync = true;
            }
            return subs;
        });
    };
}
//# sourceMappingURL=bindCallbackInternals.js.map