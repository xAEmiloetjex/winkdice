import { Result } from './result.js';
export function ok(value) {
    return Result.ok(value);
}
export function fail(value) {
    return Result.fail(value);
}
export function result(predicate, okValue, failValue) {
    return predicate()
        ? ok(okValue)
        : fail(failValue);
}
