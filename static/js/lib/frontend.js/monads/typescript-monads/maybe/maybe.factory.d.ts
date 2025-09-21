import { Maybe } from './maybe.js';
import { IMaybe } from './maybe.interface.js';
export declare function maybe<T>(value?: T | null): Maybe<T>;
export declare function none<T>(): IMaybe<T>;
export declare function some<T>(value: T): IMaybe<T>;
