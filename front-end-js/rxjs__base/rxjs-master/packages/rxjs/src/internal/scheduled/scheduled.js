import { scheduleObservable } from './scheduleObservable.js';
import { schedulePromise } from './schedulePromise.js';
import { scheduleArray } from './scheduleArray.js';
import { scheduleIterable } from './scheduleIterable.js';
import { scheduleAsyncIterable } from './scheduleAsyncIterable.js';
import { ObservableInputType, getObservableInputType } from '@rxjs/observable';
import { scheduleReadableStreamLike } from './scheduleReadableStreamLike.js';
/**
 * Converts from a common {@link ObservableInput} type to an observable where subscription and emissions
 * are scheduled on the provided scheduler.
 *
 * @see {@link from}
 * @see {@link of}
 *
 * @param input The observable, array, promise, iterable, etc you would like to schedule
 * @param scheduler The scheduler to use to schedule the subscription and emissions from
 * the returned observable.
 */
export function scheduled(input, scheduler) {
    const type = getObservableInputType(input);
    switch (type) {
        case ObservableInputType.Own:
        case ObservableInputType.InteropObservable:
            return scheduleObservable(input, scheduler);
        case ObservableInputType.Promise:
            return schedulePromise(input, scheduler);
        case ObservableInputType.ArrayLike:
            return scheduleArray(input, scheduler);
        case ObservableInputType.Iterable:
            return scheduleIterable(input, scheduler);
        case ObservableInputType.AsyncIterable:
            return scheduleAsyncIterable(input, scheduler);
        case ObservableInputType.ReadableStreamLike:
            return scheduleReadableStreamLike(input, scheduler);
    }
}
