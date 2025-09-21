export declare function fSet<T>(): {
    all: () => T[];
    delete: (key: T) => T[];
    getidx: (idx: number) => T;
    _getidx: (idx: number) => {
        value: T;
        index: number;
    };
    collection: () => T[];
    set: (key: T) => void;
    get: (key: T) => T;
    has: (key: T) => boolean;
    del: (key: T) => T[];
    getIndex: (idx: number) => T;
    _get: (key: T) => {
        value: T;
        index: number;
    };
    _getIndex: (idx: number) => {
        value: T;
        index: number;
    };
};
