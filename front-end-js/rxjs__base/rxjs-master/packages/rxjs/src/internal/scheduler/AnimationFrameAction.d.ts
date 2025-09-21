import { AsyncAction } from './AsyncAction.js';
import type { AnimationFrameScheduler } from './AnimationFrameScheduler.js';
import type { SchedulerAction } from '../types.js';
import type { TimerHandle } from './timerHandle.js';
export declare class AnimationFrameAction<T> extends AsyncAction<T> {
    protected scheduler: AnimationFrameScheduler;
    protected work: (this: SchedulerAction<T>, state?: T) => void;
    constructor(scheduler: AnimationFrameScheduler, work: (this: SchedulerAction<T>, state?: T) => void);
    protected requestAsyncId(scheduler: AnimationFrameScheduler, id?: TimerHandle, delay?: number): TimerHandle;
    protected recycleAsyncId(scheduler: AnimationFrameScheduler, id?: TimerHandle, delay?: number): TimerHandle | undefined;
}
