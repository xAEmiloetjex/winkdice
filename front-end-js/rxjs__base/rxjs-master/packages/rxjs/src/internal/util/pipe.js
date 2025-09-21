/**
 * pipe() can be called on one or more functions, each of which can take one argument ("UnaryFunction")
 * and uses it to return a value.
 * It returns a function that takes one argument, passes it to the first UnaryFunction, and then
 * passes the result to the next one, passes that result to the next one, and so on.
 */
export function pipe(...fns) {
    return fns.length === 1 ? fns[0] : (input) => fns.reduce(pipeReducer, input);
}
function pipeReducer(prev, fn) {
    return fn(prev);
}
