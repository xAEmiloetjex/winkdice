import { Subject } from '../Subject.js';
import { Subscription } from '../../../observable/index.js';
import { observeNotification } from '../Notification.js';
import { logSubscribedFrame, logUnsubscribedFrame } from './subscription-logging.js';
export class HotObservable extends Subject {
    messages;
    scheduler;
    subscriptions = [];
    logSubscribedFrame = logSubscribedFrame;
    logUnsubscribedFrame = logUnsubscribedFrame;
    constructor(messages, scheduler) {
        super();
        this.messages = messages;
        this.scheduler = scheduler;
    }
    /** @internal */
    _subscribe(subscriber) {
        const index = this.logSubscribedFrame();
        const subscription = new Subscription();
        subscription.add(new Subscription(() => {
            this.logUnsubscribedFrame(index);
        }));
        subscription.add(super._subscribe(subscriber));
        return subscription;
    }
    setup() {
        for (const { notification, frame } of this.messages) {
            this.scheduler.schedule(() => {
                observeNotification(notification, this);
            }, frame);
        }
    }
}
