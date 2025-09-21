import { map, Observable } from '../../../../rxjs/rxjs/index.js'
import { IResult } from '../result.interface.js'

export function unwrapResultAsObservable<T, E>() {
  return function unwrapResultAsObservable1(
    source: Observable<IResult<T, E>>
  ): Observable<T> {
    return source.pipe(
      map(result => {
        if (result.isOk()) return result.unwrap()
        throw result.unwrapFail()
      })
    ) as Observable<T>
  }
}
