import type { Subscriber } from '../../../observable/index.js';
import { Observable } from '../../../observable/index.js';
import type { TestMessage } from './TestMessage.js';
import type { SchedulerLike, TeardownLogic } from '../types.js';
import type { SubscriptionLog } from './subscription-logging.js';
import { logSubscribedFrame, logUnsubscribedFrame } from './subscription-logging.js';
export declare class ColdObservable<T> extends Observable<T> {
    messages: TestMessage[];
    scheduler: SchedulerLike;
    subscriptions: SubscriptionLog[];
    logSubscribedFrame: typeof logSubscribedFrame;
    logUnsubscribedFrame: typeof logUnsubscribedFrame;
    protected _subscribe(subscriber: Subscriber<any>): TeardownLogic;
    constructor(messages: TestMessage[], scheduler: SchedulerLike);
    scheduleMessages(subscriber: Subscriber<any>): void;
}
