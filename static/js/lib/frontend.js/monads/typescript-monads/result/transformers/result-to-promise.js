export function resultToPromise(result) {
    return result.isOk()
        ? Promise.resolve(result.unwrap())
        : Promise.reject(result.unwrapFail());
}
