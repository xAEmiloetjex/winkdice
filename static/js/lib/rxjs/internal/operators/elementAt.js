import { ArgumentOutOfRangeError } from '../util/ArgumentOutOfRangeError.js';
import { Observable, operate } from '../Observable.js';
export function elementAt(index, defaultValue) {
    if (index < 0) {
        throw new ArgumentOutOfRangeError();
    }
    const hasDefaultValue = arguments.length >= 2;
    return (source) => new Observable((destination) => {
        let i = 0;
        const operatorSubscriber = operate({
            destination,
            next: (value) => {
                if (i++ === index) {
                    operatorSubscriber.unsubscribe();
                    destination.next(value);
                    destination.complete();
                }
            },
            complete: () => {
                if (!hasDefaultValue) {
                    destination.error(new ArgumentOutOfRangeError());
                }
                else {
                    destination.next(defaultValue);
                    destination.complete();
                }
            },
        });
        source.subscribe(operatorSubscriber);
    });
}
//# sourceMappingURL=elementAt.js.map