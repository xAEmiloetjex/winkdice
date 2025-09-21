import { from } from '@rxjs/observable';
/**
 * Converts the first argument to an observable, then passes that observable to the function in the second argument.
 * The result of _that_ function is then passed to the function in the third argument, and so on. This continues until
 * all functions have been called, and the result of the last function is returned.
 *
 * This means it can be used for anything involving unary functions, just so long as the first unary function accepts an observable as its argument,
 * and as long as the first argument to `rx()` is a valid {@link ObservableInput}.
 *
 * This is the same as an ordinary functional {@link pipe}, except it has an implicit `from` as the second argument.
 *
 * The following are equivalent:
 *
 * ```ts
 * // Where `source` is any valid `ObservableInput`.
 * // A (observable, promise, array, async iterable, etc.)
 * rx(source, map(x => x + 1), filter(x => x % 2 === 0));
 * pipe(map(x => x + 1), filter(x => x % 2 === 0))(from(source));
 * pipe(from, map(x => x + 1), filter(x => x % 2 === 0))(source);
 * ```
 *
 * Furthermore, `rx` can be used to create an observable and pipe it in any number of ways. For example:
 *
 * ```ts
 * const subscription = rx(
 *   of(1, 2, 3),
 *   source => source.subscribe(x => console.log(x)),
 * );
 *
 * // or even something like this:
 * const promise = rx(
 *   of(1, 2, 3),
 *   async (source) => {
 *     const result = [];
 *     await source.forEach(x => result.push(x));
 *     return result;
 *   },
 * });
 * ````
 *
 * @param source Any valid observable source.
 * @param fns Any number of unary functions, starting with a unary function that accepts an observable as its only argument.
 * @returns The result of the last function, or an observable if no functions are provided for the second argument and beyond.
 */
export function rx(source, ...fns) {
    return fns.reduce(pipeReducer, from(source));
}
function pipeReducer(prev, fn) {
    return fn(prev);
}
