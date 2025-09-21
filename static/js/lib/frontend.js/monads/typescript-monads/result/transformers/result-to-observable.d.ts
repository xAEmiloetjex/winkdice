import { Observable } from '../../../../rxjs/rxjs/index.js';
import { IResult } from '../result.interface.js';
export declare function resultToObservable<TOk, TFail>(result: IResult<TOk, TFail>): Observable<TOk>;
