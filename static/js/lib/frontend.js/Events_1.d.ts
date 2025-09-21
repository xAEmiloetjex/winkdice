import { EventClass, TEvHandler } from "./core/EventQueue_1.js";
/**
 * The EventEmitter Class
 */
export declare class EventEmitter extends EventClass {
    private prefix;
    constructor(prefix?: string);
    /**
     * Add an event listener
     */
    addListener(id: string, handler: TEvHandler): void;
    /**
     * Remove an event listener
     */
    removeListener(id: string, handler: TEvHandler): void;
    /**
     * Add a single use event listener
     * (the listener gets internally removed from the stack after it has been executed)
     */
    addSingleUseListener(id: string, handler: TEvHandler): void;
    /**
     * Add a single use event listener
     * (the listener gets internally removed from the stack after it has been executed)
     */
    once(id: string, handler: TEvHandler): void;
    /**
     * Add an event listener
     */
    on(id: string, handler: TEvHandler): void;
    /**
     * Remove an event listener
     */
    off(id: string, handler: TEvHandler): void;
    /**
     * Remove all event listeners belogning to the specified event
     */
    removeAllListeners(name: string): void;
    /**
     * Emit an event
     */
    emit(id: string, ..._data: any | any[]): import("./core/EventQueue_1.js").QueueItem;
}
