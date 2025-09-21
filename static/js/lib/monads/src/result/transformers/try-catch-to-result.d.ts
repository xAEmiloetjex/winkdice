import { IResult } from '../result.interface';
/**
 * Ingest a try-catch throwable function so that it doesn't halt the program but instead
 * returns an IResult
 * @param fn a throwable function
 * @returns an IResult object which wraps the execution as either fail or success
 */
export declare function catchResult<TValue, TError>(fn: () => TValue, errFn?: (err: unknown) => TError): IResult<TValue, TError>;
