import { IReader } from './reader.interface.js';
export declare function reader<TConfig, TOut>(fn: (config: TConfig) => TOut): IReader<TConfig, TOut>;
