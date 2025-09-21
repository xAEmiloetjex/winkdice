import { AsyncAction } from './AsyncAction.js';
import type { AsapScheduler } from './AsapScheduler.js';
import type { SchedulerAction } from '../types.js';
import type { TimerHandle } from './timerHandle.js';
export declare class AsapAction<T> extends AsyncAction<T> {
    protected scheduler: AsapScheduler;
    protected work: (this: SchedulerAction<T>, state?: T) => void;
    constructor(scheduler: AsapScheduler, work: (this: SchedulerAction<T>, state?: T) => void);
    protected requestAsyncId(scheduler: AsapScheduler, id?: TimerHandle, delay?: number): TimerHandle;
    protected recycleAsyncId(scheduler: AsapScheduler, id?: TimerHandle, delay?: number): TimerHandle | undefined;
}
