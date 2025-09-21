import { Subscriber } from 'rxjs';
/**
 * Returns an observable that will be deemed by this package's implementation
 * to be an observable that requires interop. The returned observable will fail
 * the `instanceof Observable` test and will deem any `Subscriber` passed to
 * its `subscribe` method to be untrusted.
 */
export function asInteropObservable(observable) {
    return new Proxy(observable, {
        get(target, key) {
            if (key === 'subscribe') {
                const { subscribe } = target;
                return interopSubscribe(subscribe);
            }
            return Reflect.get(target, key);
        },
        getPrototypeOf(target) {
            const { lift, subscribe, ...rest } = Object.getPrototypeOf(target);
            return {
                ...rest,
                subscribe: interopSubscribe(subscribe)
            };
        }
    });
}
/**
 * Returns a subject that will be deemed by this package's implementation to
 * be untrusted. The returned subject will not include the symbol that
 * identifies trusted subjects.
 */
export function asInteropSubject(subject) {
    return asInteropSubscriber(subject);
}
/**
 * Returns a subscriber that will be deemed by this package's implementation to
 * be untrusted. The returned subscriber will fail the `instanceof Subscriber`
 * test and will not include the symbol that identifies trusted subscribers.
 */
export function asInteropSubscriber(subscriber) {
    return new Proxy(subscriber, {
        get(target, key) {
            return Reflect.get(target, key);
        },
        getPrototypeOf(target) {
            const { ...rest } = Object.getPrototypeOf(target);
            return rest;
        }
    });
}
function interopSubscribe(subscribe) {
    return function (...args) {
        const [arg] = args;
        if (arg instanceof Subscriber) {
            return subscribe.call(this, asInteropSubscriber(arg));
        }
        return subscribe.apply(this, args);
    };
}
