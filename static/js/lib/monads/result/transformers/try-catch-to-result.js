import { fail, ok } from '../result.factory';
/**
 * Ingest a try-catch throwable function so that it doesn't halt the program but instead
 * returns an IResult
 * @param fn a throwable function
 * @returns an IResult object which wraps the execution as either fail or success
 */
export function catchResult(fn, errFn) {
    try {
        return ok(fn());
    }
    catch (err) {
        return fail(errFn ? errFn(err) : err);
    }
}
//# sourceMappingURL=try-catch-to-result.js.map