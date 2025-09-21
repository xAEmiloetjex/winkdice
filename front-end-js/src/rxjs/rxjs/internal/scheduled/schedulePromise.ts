import { from } from '../../../observable/index.js';
import { observeOn } from '../operators/observeOn.js';
import { subscribeOn } from '../operators/subscribeOn.js';
import type { SchedulerLike } from '../types.js';

export function schedulePromise<T>(input: PromiseLike<T>, scheduler: SchedulerLike) {
  return from(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
}
