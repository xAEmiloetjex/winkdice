import { Either } from './either.js'
import { IEither } from './either.interface.js'

export function either<L, R>(left?: L, right?: R): IEither<L, R> {
  return new Either(left, right)
}
