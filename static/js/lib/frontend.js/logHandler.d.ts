import { HandlerItem } from "./core/EventQueue_2.js";
import { EventEmitter2 } from "./Events.js";
import { Logger } from "./logger.js";
export interface IExtraFuncs {
    error?: (input: any) => {};
    info?: (input: any) => {};
    warn?: (input: any) => {};
    debug?: (input: any) => {};
}
interface IListeners {
    [name: string]: HandlerItem;
}
export declare class LogHandler extends EventEmitter2 {
    readonly instanceId: string;
    private __logger__;
    private _listeners;
    listeners: IListeners;
    /**
     * Resets the overides applied to the listeners
     */
    resetListenersOveride(): {
        [name: string]: HandlerItem;
    };
    /**
     * Appends a different logger than the default
     */
    appendNewLogger(loggerClass: Logger): Logger;
    constructor(extraFuncs?: IExtraFuncs);
    /** * Helper method */
    __error(input: any): Promise<import("./core/EventQueue_2_1.js").EmitState>;
    /** * Helper method */
    __warn(input: any): Promise<import("./core/EventQueue_2_1.js").EmitState>;
    /** * Helper method */
    __info(input: any): Promise<import("./core/EventQueue_2_1.js").EmitState>;
    /** * Helper method */
    __debug(input: any): Promise<import("./core/EventQueue_2_1.js").EmitState>;
}
export {};
