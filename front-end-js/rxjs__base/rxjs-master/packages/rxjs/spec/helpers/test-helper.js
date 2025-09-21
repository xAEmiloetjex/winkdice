import { of, asyncScheduler, scheduled } from 'rxjs';
import { iterator } from 'rxjs/internal/symbol/iterator';
if (process && process.on) {
    /**
     * With async/await functions in Node, mocha seems to allow
     * tests to pass, even they shouldn't there's something about how
     * it handles the rejected promise where it does not notice
     * that the test failed.
     */
    process.on('unhandledRejection', (err) => {
        console.error(err);
        process.exit(1);
    });
}
export function lowerCaseO(...args) {
    const o = {
        subscribe(observer) {
            args.forEach((v) => observer.next(v));
            observer.complete();
            return {
                unsubscribe() {
                    /* do nothing */
                },
            };
        },
    };
    o[Symbol.observable ?? '@@observable'] = function () {
        return this;
    };
    return o;
}
export const createObservableInputs = (value) => of(of(value), scheduled([value], asyncScheduler), [value], Promise.resolve(value), {
    [iterator]: () => {
        const iteratorResults = [{ value, done: false }, { done: true }];
        return {
            next: () => {
                return iteratorResults.shift();
            },
        };
    },
}, {
    [Symbol.observable ?? '@@observable']: () => of(value),
});
/**
 * Used to signify no subscriptions took place to `expectSubscriptions` assertions.
 */
export const NO_SUBS = [];
