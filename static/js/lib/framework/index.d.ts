export declare function html(location: string): IReturns;
export interface IReturns {
    set: (code: string) => string;
    on: <K extends keyof HTMLElementEventMap>(event: K, cb: Function) => any;
    get: () => HTMLElement | null;
    add: (code: string) => string;
    attr: (name: string) => {
        set: (value: string) => void;
        get: () => string;
        remove: () => void;
    };
    env: (cb: Function) => any;
}
