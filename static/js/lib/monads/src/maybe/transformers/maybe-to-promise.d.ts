import { IMaybe } from '../maybe.interface';
export declare function maybeToPromise<TResolve, TReject>(catchResponse?: TReject): (maybe: IMaybe<TResolve>) => Promise<TResolve>;
