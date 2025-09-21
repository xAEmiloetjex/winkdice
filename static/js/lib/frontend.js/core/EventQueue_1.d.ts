/**
 * The back-end of the EventEmitter class,
 * Usually it's not recommended to interact with this directly
 * since the EventEmitter class is there to provide a fixed layout to this class that may change majorly over time
 */
export declare class EventClass {
    private queue;
    private handlers;
    private oneTimeHandlers;
    constructor();
    emit(name: string, ..._data: any | any[]): QueueItem;
    addSingleUseListener(name: string, handler: TEvHandler): void;
    addListener(name: string, handler: TEvHandler): void;
    removeListener(name: string, handler: TEvHandler): void;
    removeAllListeners(name: string): void;
    private Handle;
}
export interface QueueItem {
    name: string;
    data?: any | any[];
}
export type TEvHandler = (data?: any | any[]) => any;
