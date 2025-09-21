import { Observable } from '../../../../rxjs/rxjs/index.js';
import { IResult } from '../result.interface.js';
export declare function unwrapResultAsObservable<T, E>(): (source: Observable<IResult<T, E>>) => Observable<T>;
