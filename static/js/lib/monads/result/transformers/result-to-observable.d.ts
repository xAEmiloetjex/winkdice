import { Observable } from '/js/lib/rxjs/index.js';
import { IResult } from '../result.interface';
export declare function resultToObservable<TOk, TFail>(result: IResult<TOk, TFail>): Observable<TOk>;
