import { of, throwError } from '../../../../rxjs/rxjs/index.js';
export function resultToObservable(result) {
    if (result.isOk()) {
        return of(result.unwrap());
    }
    else {
        return throwError(() => result.unwrapFail());
    }
}
