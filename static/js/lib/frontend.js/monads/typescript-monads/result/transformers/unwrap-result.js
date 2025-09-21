import { map } from '../../../../rxjs/rxjs/index.js';
export function unwrapResultAsObservable() {
    return function unwrapResultAsObservable1(source) {
        return source.pipe(map(result => {
            if (result.isOk())
                return result.unwrap();
            throw result.unwrapFail();
        }));
    };
}
