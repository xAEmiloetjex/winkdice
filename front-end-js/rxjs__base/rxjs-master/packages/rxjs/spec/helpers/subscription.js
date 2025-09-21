export function getRegisteredFinalizers(subscription) {
    if ('_finalizers' in subscription) {
        return subscription._finalizers ?? [];
    }
    else {
        throw new TypeError('Invalid Subscription');
    }
}
