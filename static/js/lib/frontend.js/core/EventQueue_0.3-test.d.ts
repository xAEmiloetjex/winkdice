export declare class EventQueue {
    events: {
        [key: string]: any[];
    };
    on(event: string, listener: (..._: any[]) => any): number;
    removeListener(event: string, listener: (..._: any[]) => any): any[];
    once(event: string, listener: (..._: any[]) => any): number;
    emit(event: string): void;
}
