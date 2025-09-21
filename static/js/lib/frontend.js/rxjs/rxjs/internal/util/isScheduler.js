import { isFunction } from '../../../observable/index.js';
export function isScheduler(value) {
    return value && isFunction(value.schedule);
}
