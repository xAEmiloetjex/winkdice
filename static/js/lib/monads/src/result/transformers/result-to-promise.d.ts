import { IResult } from '../result.interface';
export declare function resultToPromise<TOk, TFail>(result: IResult<TOk, TFail>): Promise<TOk>;
