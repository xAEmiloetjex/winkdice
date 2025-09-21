import { of, throwError } from '/js/lib/rxjs/index.js';
export function resultToObservable(result) {
    if (result.isOk()) {
        return of(result.unwrap());
    }
    else {
        return throwError(function () { return result.unwrapFail(); });
    }
}
//# sourceMappingURL=result-to-observable.js.map