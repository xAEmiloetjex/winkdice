import type { Subscription } from '@rxjs/observable';
import type { SchedulerLike } from '../types.js';
export declare function executeSchedule(parentSubscription: Subscription, scheduler: SchedulerLike, work: () => void, delay?: number, repeat?: boolean): Subscription | void;
