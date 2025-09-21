import type { SchedulerLike } from '../types.js';
import { Observable } from '../../../observable/index.js';
export declare function bindCallbackInternals(isNodeStyle: boolean, callbackFunc: any, resultSelector?: any, scheduler?: SchedulerLike): (...args: any[]) => Observable<unknown>;
