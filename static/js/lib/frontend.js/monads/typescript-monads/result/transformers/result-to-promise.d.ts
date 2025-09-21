import { IResult } from '../result.interface.js';
export declare function resultToPromise<TOk, TFail>(result: IResult<TOk, TFail>): Promise<TOk>;
