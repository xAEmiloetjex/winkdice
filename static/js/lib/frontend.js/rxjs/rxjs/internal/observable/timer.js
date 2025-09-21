import { Observable } from '../../../observable/index.js';
import { asyncScheduler } from '../scheduler/async.js';
import { isScheduler } from '../util/isScheduler.js';
import { isValidDate } from '../util/isDate.js';
import { executeSchedule } from '../util/executeSchedule.js';
export function timer(dueTime = 0, intervalOrScheduler, scheduler = asyncScheduler) {
    // Since negative intervalDuration is treated as though no
    // interval was specified at all, we start with a negative number.
    let intervalDuration = -1;
    if (intervalOrScheduler != null) {
        // If we have a second argument, and it's a scheduler,
        // override the scheduler we had defaulted. Otherwise,
        // it must be an interval.
        if (isScheduler(intervalOrScheduler)) {
            scheduler = intervalOrScheduler;
        }
        else {
            // Note that this *could* be negative, in which case
            // it's like not passing an intervalDuration at all.
            intervalDuration = intervalOrScheduler;
        }
    }
    return new Observable((subscriber) => {
        // If a valid date is passed, calculate how long to wait before
        // executing the first value... otherwise, if it's a number just schedule
        // that many milliseconds (or scheduler-specified unit size) in the future.
        let due = isValidDate(dueTime) ? +dueTime - scheduler.now() : dueTime;
        if (due < 0) {
            // Ensure we don't schedule in the future.
            due = 0;
        }
        // The incrementing value we emit.
        let n = 0;
        // Start the timer.
        return executeSchedule(subscriber, scheduler, () => {
            // Emit the first value and schedule the next.
            subscriber.next(n++);
            if (0 <= intervalDuration) {
                // If we have a interval after the initial timer,
                // reschedule with the period.
                executeSchedule(subscriber, scheduler, () => {
                    // Emit the interval values.
                    subscriber.next(n++);
                }, intervalDuration, true);
            }
            else {
                // We didn't have an interval. So just complete.
                subscriber.complete();
            }
        }, due);
    });
}
