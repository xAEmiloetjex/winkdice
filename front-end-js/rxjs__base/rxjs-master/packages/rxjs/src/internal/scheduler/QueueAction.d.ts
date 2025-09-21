import { AsyncAction } from './AsyncAction.js';
import type { Subscription } from '@rxjs/observable';
import type { QueueScheduler } from './QueueScheduler.js';
import type { SchedulerAction } from '../types.js';
import type { TimerHandle } from './timerHandle.js';
export declare class QueueAction<T> extends AsyncAction<T> {
    protected scheduler: QueueScheduler;
    protected work: (this: SchedulerAction<T>, state?: T) => void;
    constructor(scheduler: QueueScheduler, work: (this: SchedulerAction<T>, state?: T) => void);
    schedule(state?: T, delay?: number): Subscription;
    execute(state: T, delay: number): any;
    protected requestAsyncId(scheduler: QueueScheduler, id?: TimerHandle, delay?: number): TimerHandle;
}
