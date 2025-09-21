import { Observable, operate } from '../Observable.js';
import { EmptyError } from '../util/EmptyError.js';
export function first(predicate, defaultValue) {
    const hasDefaultValue = arguments.length >= 2;
    return (source) => new Observable((destination) => {
        let index = 0;
        const operatorSubscriber = operate({
            destination,
            next: (value) => {
                const passed = predicate ? predicate(value, index++, source) : true;
                if (passed) {
                    operatorSubscriber.unsubscribe();
                    destination.next(value);
                    destination.complete();
                }
            },
            complete: () => {
                if (hasDefaultValue) {
                    destination.next(defaultValue);
                    destination.complete();
                }
                else {
                    destination.error(new EmptyError());
                }
            },
        });
        source.subscribe(operatorSubscriber);
    });
}
//# sourceMappingURL=first.js.map