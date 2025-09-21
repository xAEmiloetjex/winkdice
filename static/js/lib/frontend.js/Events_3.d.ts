import { EventQueue, TEvHandler, IRemLOpts, HandlerItem } from "./core/EventQueue_3.js";
/**
 * The EventEmitter Class
 */
export declare class EventEmitter extends EventQueue {
    private prefix;
    constructor(prefix?: string);
    /**
     * Add a single use event listener
     * (the listener gets internally removed from the stack after it has been executed)
     *
     * ! Warning.. If you use a single-use event listener on a global event
     *
     * ! then it bugs out the whole global queue!
     *
     * ! Instead maybe use a normal `<EventEmitter>.on()` method with an if statement
     *
     * ! To block multiple uses
     */
    addSingleUseListener(id: string, handler: TEvHandler): HandlerItem;
    /**
     * Add an event listener
     */
    addListener(id: string, handler: TEvHandler): HandlerItem;
    /**
     * Remove an event listener
     *
     * ! NOTE: This isn't implemented for the global events yet
     */
    removeListener(id: string, listeners: string | TEvHandler | string[] | TEvHandler[], opts?: IRemLOpts): void;
    /**
     * Add a single use event listener
     * (the listener gets internally removed from the stack after it has been executed)
     *
     * ! Warning.. If you use a single-use event listener on a global event
     *
     * ! then it bugs out the whole global queue!
     *
     * ! Instead maybe use a normal `<EventEmitter>.on()` method with an if statement
     *
     * ! To block multiple uses
     */
    once(id: string, handler: TEvHandler): HandlerItem;
    /**
     * Add an event listener
     */
    on(id: string, handler: TEvHandler): HandlerItem;
    /**
     * Remove an event listener
     *
     * ! NOTE: This isn't implemented for the global events yet
     */
    off(id: string, listeners: string | TEvHandler | string[] | TEvHandler[], opts?: IRemLOpts): void;
    /**
     * Remove all event listeners belogning to the specified event
     *
     * ! NOTE: This isn't implemented for the global events yet
     */
    removeAllListeners(name: string): void;
    /**
     * Emit an event
     */
    emit(id: string, ..._data: any | any[]): Promise<import("./core/EventQueue_3.js").EmitState>;
}
export declare const EventEmitter3: typeof EventEmitter;
