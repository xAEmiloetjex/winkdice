import { List } from './list.js'

export function listOf<T>(...args: T[]): List<T> {
  return List.of<T>(...args)
}

export function listFrom<T>(value?: Iterable<T>): List<T> {
  return List.from<T>(value)
}
