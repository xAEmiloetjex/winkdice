import { Observable } from '/js/lib/rxjs/index.js';
import { IResult } from '../result.interface';
export declare function unwrapResultAsObservable<T, E>(): (source: Observable<IResult<T, E>>) => Observable<T>;
