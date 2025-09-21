import { Scheduler } from '../Scheduler.js';
export class AsyncScheduler extends Scheduler {
    actions = [];
    /**
     * A flag to indicate whether the Scheduler is currently executing a batch of
     * queued actions.
     * @internal
     */
    _active = false;
    /**
     * An internal ID used to track the latest asynchronous task such as those
     * coming from `setTimeout`, `setInterval`, `requestAnimationFrame`, and
     * others.
     * @internal
     */
    _scheduled;
    constructor(SchedulerAction, now = Scheduler.now) {
        super(SchedulerAction, now);
    }
    flush(action) {
        const { actions } = this;
        if (this._active) {
            actions.push(action);
            return;
        }
        let error;
        this._active = true;
        do {
            if ((error = action.execute(action.state, action.delay))) {
                break;
            }
        } while ((action = actions.shift())); // exhaust the scheduler queue
        this._active = false;
        if (error) {
            while ((action = actions.shift())) {
                action.unsubscribe();
            }
            throw error;
        }
    }
}
