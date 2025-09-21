export function hot(marbles, values, error) {
    if (!global.rxTestScheduler) {
        throw 'tried to use hot() in async test';
    }
    return global.rxTestScheduler.createHotObservable.call(global.rxTestScheduler, marbles, values, error);
}
export function cold(marbles, values, error) {
    if (!global.rxTestScheduler) {
        throw 'tried to use cold() in async test';
    }
    return global.rxTestScheduler.createColdObservable.call(global.rxTestScheduler, marbles, values, error);
}
export function expectObservable(observable, unsubscriptionMarbles = null) {
    if (!global.rxTestScheduler) {
        throw 'tried to use expectObservable() in async test';
    }
    return global.rxTestScheduler.expectObservable.call(global.rxTestScheduler, observable, unsubscriptionMarbles);
}
export function expectSubscriptions(actualSubscriptionLogs) {
    if (!global.rxTestScheduler) {
        throw 'tried to use expectSubscriptions() in async test';
    }
    return global.rxTestScheduler.expectSubscriptions.call(global.rxTestScheduler, actualSubscriptionLogs);
}
export function time(marbles) {
    if (!global.rxTestScheduler) {
        throw 'tried to use time() in async test';
    }
    return global.rxTestScheduler.createTime.call(global.rxTestScheduler, marbles);
}
