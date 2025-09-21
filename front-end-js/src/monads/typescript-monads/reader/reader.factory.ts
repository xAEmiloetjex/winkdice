import { Reader } from './reader.js'
import { IReader } from './reader.interface.js'

export function reader<TConfig, TOut>(fn: (config: TConfig) => TOut): IReader<TConfig, TOut> {
  return new Reader<TConfig, TOut>(fn)
}
