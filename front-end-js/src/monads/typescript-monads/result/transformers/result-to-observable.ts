import { Observable, of, throwError } from '../../../../rxjs/rxjs/index.js'
import { IResult } from '../result.interface.js'

export function resultToObservable<TOk, TFail>(result: IResult<TOk, TFail>): Observable<TOk> {
  if (result.isOk()) {
    return of(result.unwrap())
  } else {
    return throwError(() => result.unwrapFail())
  }
}
