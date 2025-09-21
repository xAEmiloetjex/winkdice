import { Observable } from '../Observable.js';
import { EMPTY } from './empty.js';
import { executeSchedule } from '../util/executeSchedule.js';
export function range(start, count, scheduler) {
    if (count == null) {
        count = start;
        start = 0;
    }
    if (count <= 0) {
        return EMPTY;
    }
    const end = count + start;
    return new Observable(scheduler
        ?
            (subscriber) => {
                let n = start;
                const emit = () => {
                    if (n < end) {
                        subscriber.next(n++);
                        if (!subscriber.closed) {
                            executeSchedule(subscriber, scheduler, emit);
                        }
                    }
                    else {
                        subscriber.complete();
                    }
                };
                executeSchedule(subscriber, scheduler, emit);
            }
        :
            (subscriber) => {
                let n = start;
                while (n < end && !subscriber.closed) {
                    subscriber.next(n++);
                }
                subscriber.complete();
            });
}
//# sourceMappingURL=range.js.map