import { EventClass } from "./core/EventQueue_1.js";
declare var $: {
    events: EventClass;
    action: typeof $Action;
    ebol: typeof $Ebol;
};
export declare function $Action(name: string, handler: string | HTMLElement, callback: (...args: any[]) => any): void;
export declare function $Ebol(a: any, b: any): any;
export default $;
