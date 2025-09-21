export function maybeToPromise(catchResponse) {
    return function maybeToPromise(maybe) {
        return maybe.isSome()
            ? Promise.resolve(maybe.valueOrThrow())
            : Promise.reject(catchResponse);
    };
}
