import { isFunction } from '@rxjs/observable';
export function isScheduler(value) {
    return value && isFunction(value.schedule);
}
