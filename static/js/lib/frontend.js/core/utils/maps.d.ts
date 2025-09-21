export type IMapItem<K, V> = {
    key: K;
    value: V;
};
export declare function _map<K, V>(): {
    manager: {
        clear: () => never[];
        insert: (map: IMapItem<K, V>[]) => IMapItem<K, V>[];
        replace: (map: IMapItem<K, V>[]) => IMapItem<K, V>[];
        toTrueMap: () => TTruemapItem<K, V>[];
    };
    delete: (key: K) => IMapItem<K, V>[];
    all: () => IMapItem<K, V>[];
    set: (key: K, value: V) => number;
    get: (key: K) => V | Error;
    getAll: () => IMapItem<K, V>[];
    has: (key: K) => boolean;
    del: (key: K) => IMapItem<K, V>[];
    entries: () => [K, V][];
    keys: () => K[];
    values: () => V[];
    length: () => number;
};
export type TTruemapItem<K, V> = [K, V];
export declare function trueMap<K = any, V = any>(): {
    manager: {
        clear: () => never[];
        insert: (map: TTruemapItem<K, V>[]) => TTruemapItem<K, V>[];
        replace: (map: TTruemapItem<K, V>[]) => TTruemapItem<K, V>[];
        toHumanMap: () => IMapItem<K, V>[];
    };
    size: number;
    delete: (key: K) => TTruemapItem<K, V>[];
    all: () => [K, V][];
    getAll: () => [K, V][];
    set: (key: K, value: V) => number;
    get: (key: K) => V | undefined;
    has: (key: K) => boolean;
    del: (key: K) => TTruemapItem<K, V>[];
    entries: () => [K, V][];
    keys: () => K[];
    values: () => V[];
    length: () => number;
};
