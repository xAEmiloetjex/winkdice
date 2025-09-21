export declare const mapStore: Map<string, string>;
export declare const cache: {
    set: (key: string, value: string) => Promise<void>;
    get: (key: string) => string;
    delete: (key: string) => boolean;
};
export declare function Cache(name: string, cachingCb: (...args: any[]) => any | Promise<any>): Promise<{
    isCached: boolean;
    status: string;
    data: any;
}>;
