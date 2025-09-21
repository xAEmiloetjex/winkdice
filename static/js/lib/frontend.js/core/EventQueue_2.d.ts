import { Logger } from "../logger.js";
export declare enum HandlerStatus {
    Ok = 0,
    Error = 1,
    Global = 2,
    Unknown = 3
}
export declare enum LogLevels {
    Silent = 0,
    Normal = 1,
    Verbose = 2
}
export declare enum ResponseLevels {
    Normal = 0,
    Verbose = 1
}
export type TEvHandler = (...data: any | any[]) => any;
export interface EmitState {
    accesableChildrenExecutorStates?: any;
    HandlerState: HandlerState;
    obj: QueueItem;
}
export interface HandlerState {
    timestamp?: number;
    instance: string;
    status: HandlerStatus;
    err?: Error;
}
export interface HandlerItem {
    name: string;
    handler: TEvHandler;
    ListenerId: string;
}
export interface QueueItem {
    emitId?: string;
    name: string;
    data?: any | any[];
}
export interface IEvHandlerFunc {
    ListenerId: string;
    handler: TEvHandler;
}
export interface IOpts {
    byId: boolean;
}
export interface IRemLOpts extends IOpts {
}
/**
 * The back-end of the EventEmitter2 class,
 * Usually it's not recommended to interact with this directly
 * since the EventEmitter2 class is there to provide a fixed layout to this class that may change majorly over time
 */
export declare class EventQueueAlt {
    readonly instanceId: string;
    readonly queue: QueueItem[];
    private globQueue;
    private executedGlobals;
    private handlers;
    private oneTimeHandlers;
    private _logger_;
    logLevel: LogLevels;
    respLevel: ResponseLevels;
    setLogLevel(logLevel: LogLevels): void;
    setResponseLevel(respLevel: ResponseLevels): void;
    appendNewLogger(loggerClass: Logger): Logger;
    constructor();
    private pushStore;
    private getStore;
    private removeStore;
    logGlob(): void;
    addSingleUseListener(name: string, handler: TEvHandler): HandlerItem;
    addListener(name: string, handler: TEvHandler): HandlerItem;
    removeListener(name: string, listeners: string | TEvHandler | string[] | TEvHandler[], opts?: IRemLOpts): void;
    removeAllListeners(name: string): void;
    emit(name: string, ..._data: any | any[]): Promise<EmitState>;
    private Handle;
}
