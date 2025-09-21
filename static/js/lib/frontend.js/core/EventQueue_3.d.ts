import { Logger } from "../logger.js";
import { type RestrictiveAny } from "../types.js";
import { EventEmitter3 } from "../Events.js";
export declare enum HandlerStatus {
    Ok = 0,
    Error = 1,
    Global = 2,
    Children = 3,
    Unknown = 4
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
export interface T_glob_ {
    alt_evQueue: {
        constants: {
            EMIT_REMOVE_TIMEOUT: number;
            GLOBAL_QUEUE_SYNC_TIMEOUT: number;
            INTERNAL_GLOB_SYNC_OFFSET: number;
        };
        queue: Map<string, QueueItem[]>;
        queue_: QueueItem[];
    };
    globExecState: Map<string, RestrictiveAny[]>;
    stores: {
        [key: string]: RestrictiveAny;
    };
    openStores: {
        [key: string]: RestrictiveAny;
    };
}
export type TChildrenEmitters = EventEmitter3;
export type TEvHandler = (...data: RestrictiveAny[]) => RestrictiveAny;
export interface EmitState {
    accessibleChildrenExecutorStates?: RestrictiveAny;
    HandlerState: HandlerState;
    obj: QueueItem;
    states?: Map<string, {
        meta: {
            [x: string]: any;
        };
        state: EmitState;
    }>;
}
export interface HandlerState {
    timestamp?: number;
    instance: string;
    status: HandlerStatus;
    err?: Error;
    results?: RestrictiveAny;
}
/**
 * The `index` property is just an estimate
 */
export interface HandlerItem {
    name: string;
    handler: TEvHandler;
    ListenerId: string;
    index?: number;
}
export interface QueueItem {
    emitId: string;
    name: string;
    data?: RestrictiveAny | RestrictiveAny[];
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
 * The back-end of the EventEmitter3 class,
 * Usually it's not recommended to interact with this directly
 * since the EventEmitter3 class is there to provide a fixed layout to this class that may change majorly over time
 */
export declare abstract class EventQueue {
    readonly instanceId: string;
    readonly queue: QueueItem[];
    parents: TChildrenEmitters[];
    children: TChildrenEmitters[];
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
    addParent(parent: TChildrenEmitters): void;
    setChildren(children: TChildrenEmitters[], parent: TChildrenEmitters): EventEmitter3[];
    addChild(child: TChildrenEmitters, parent: TChildrenEmitters): number;
    constructor();
    private pushStore;
    private getStore;
    private removeStore;
    openStore: {
        push(name: string, data: RestrictiveAny | RestrictiveAny[]): any;
        get(name: string, data: RestrictiveAny | RestrictiveAny[]): any;
        remove(name: string, data: RestrictiveAny | RestrictiveAny[]): any;
    };
    logGlob(): void;
    /**
     * The `index` property is just an estimate
     */
    addSingleUseListener(name: string, handler: TEvHandler): HandlerItem;
    /**
   * The `index` property is just an estimate
   */
    addListener(name: string, handler: TEvHandler): HandlerItem;
    removeListener(name: string, listeners: string | TEvHandler | string[] | TEvHandler[], opts?: IRemLOpts): void;
    removeAllListeners(name: string): void;
    emit(name: string, ..._data: RestrictiveAny[]): Promise<EmitState>;
    private Handle;
}
