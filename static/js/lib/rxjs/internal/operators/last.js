import { Observable, operate } from '../Observable.js';
import { EmptyError } from '../util/EmptyError.js';
export function last(predicate, defaultValue) {
    const hasDefaultValue = arguments.length >= 2;
    return (source) => new Observable((destination) => {
        let index = 0;
        let found = false;
        let lastValue;
        source.subscribe(operate({
            destination,
            next(value) {
                if (!predicate || predicate(value, index++, source)) {
                    found = true;
                    lastValue = value;
                }
            },
            complete() {
                if (found) {
                    destination.next(lastValue);
                    destination.complete();
                }
                else if (hasDefaultValue) {
                    destination.next(defaultValue);
                    destination.complete();
                }
                else {
                    destination.error(new EmptyError());
                }
            },
        }));
    });
}
//# sourceMappingURL=last.js.map