import { Scheduler } from '../Scheduler.js';
import type { Action } from './Action.js';
import type { AsyncAction } from './AsyncAction.js';
import type { TimerHandle } from './timerHandle.js';
export declare class AsyncScheduler extends Scheduler {
    actions: Array<AsyncAction<any>>;
    /**
     * A flag to indicate whether the Scheduler is currently executing a batch of
     * queued actions.
     * @internal
     */
    _active: boolean;
    /**
     * An internal ID used to track the latest asynchronous task such as those
     * coming from `setTimeout`, `setInterval`, `requestAnimationFrame`, and
     * others.
     * @internal
     */
    _scheduled: TimerHandle | undefined;
    constructor(SchedulerAction: typeof Action, now?: () => number);
    flush(action: AsyncAction<any>): void;
}
