/** @prettier */
import type { TeardownLogic } from 'rxjs';
export declare function getRegisteredFinalizers(subscription: any): Exclude<TeardownLogic, void>[];
