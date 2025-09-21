import type { SchedulerLike } from '../types.js';
import { isFunction } from '../../../observable/index.js';

export function isScheduler(value: any): value is SchedulerLike {
  return value && isFunction(value.schedule);
}
