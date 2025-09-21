import { IMaybe } from '../maybe.interface.js';
export declare function maybeToPromise<TResolve, TReject>(catchResponse?: TReject): (maybe: IMaybe<TResolve>) => Promise<TResolve>;
