import { Subject } from '../Subject.js';
import type { Subscriber } from '@rxjs/observable';
import { Subscription } from '@rxjs/observable';
import type { Scheduler } from '../Scheduler.js';
import type { TestMessage } from './TestMessage.js';
import type { SubscriptionLog } from './subscription-logging.js';
import { logSubscribedFrame, logUnsubscribedFrame } from './subscription-logging.js';
export declare class HotObservable<T> extends Subject<T> {
    messages: TestMessage[];
    scheduler: Scheduler;
    subscriptions: SubscriptionLog[];
    logSubscribedFrame: typeof logSubscribedFrame;
    logUnsubscribedFrame: typeof logUnsubscribedFrame;
    constructor(messages: TestMessage[], scheduler: Scheduler);
    /** @internal */
    protected _subscribe(subscriber: Subscriber<any>): Subscription;
    setup(): void;
}
