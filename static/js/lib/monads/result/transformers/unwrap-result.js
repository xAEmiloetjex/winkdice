import { map } from '/js/lib/rxjs/index.js';
export function unwrapResultAsObservable() {
    return function unwrapResultAsObservable1(source) {
        return source.pipe(map(function (result) {
            if (result.isOk())
                return result.unwrap();
            throw result.unwrapFail();
        }));
    };
}
//# sourceMappingURL=unwrap-result.js.map