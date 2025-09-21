import type { Observable } from 'rxjs';
import type { SubscriptionLog } from '../../src/internal/testing/subscription-logging';
import type { ColdObservable } from '../../src/internal/testing/ColdObservable';
import type { HotObservable } from '../../src/internal/testing/HotObservable';
import type { observableToBeFn, subscriptionLogsToBeFn } from '../../src/internal/testing/TestScheduler';
export declare function hot(marbles: string, values?: void, error?: any): HotObservable<string>;
export declare function hot<V>(marbles: string, values?: {
    [index: string]: V;
}, error?: any): HotObservable<V>;
export declare function cold(marbles: string, values?: void, error?: any): ColdObservable<string>;
export declare function cold<V>(marbles: string, values?: {
    [index: string]: V;
}, error?: any): ColdObservable<V>;
export declare function expectObservable(observable: Observable<any>, unsubscriptionMarbles?: string | null): {
    toBe: observableToBeFn;
};
export declare function expectSubscriptions(actualSubscriptionLogs: SubscriptionLog[]): {
    toBe: subscriptionLogsToBeFn;
};
export declare function time(marbles: string): number;
