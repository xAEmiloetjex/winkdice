interface SubscriptionLoggingProps {
    subscriptions: SubscriptionLog[];
    scheduler: {
        now(): number;
    };
}
export declare class SubscriptionLog {
    subscribedFrame: number;
    unsubscribedFrame: number;
    constructor(subscribedFrame: number, unsubscribedFrame?: number);
}
export declare function logUnsubscribedFrame(this: SubscriptionLoggingProps, index: number): void;
export declare function logSubscribedFrame(this: SubscriptionLoggingProps): number;
export {};
