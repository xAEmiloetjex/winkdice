export declare function html(location: string): IReturns;
type Function = (...returns: any[]) => any;
export interface IReturns {
    set: (code: string) => {
        el: string;
        _: IReturns;
    };
    add: (code: string) => {
        el: string;
        _: IReturns;
    };
    on: <K extends keyof HTMLElementEventMap>(event: K, cb: Function) => any;
    get: () => HTMLElement | null;
    attr: (name: string) => {
        set: (value: string) => void;
        get: () => string;
        remove: () => void;
    };
    env: (cb: Function) => any;
}
export {};
