import type { AsyncAction } from './AsyncAction.js';
import { AsyncScheduler } from './AsyncScheduler.js';
export declare class AsapScheduler extends AsyncScheduler {
    flush(action?: AsyncAction<any>): void;
}
