import { fMap } from '../index.js';
import { type Database } from './types.js';
export declare class InMemoryDatabase implements Database {
    data: {
        manager: {
            clear: () => never[];
            insert: (map: fMap.TTruemapItem<string, any>[]) => fMap.TTruemapItem<string, any>[];
            replace: (map: fMap.TTruemapItem<string, any>[]) => fMap.TTruemapItem<string, any>[];
            toHumanMap: () => fMap.IMapItem<string, any>[];
        };
        size: number;
        delete: (key: string) => fMap.TTruemapItem<string, any>[];
        all: () => [string, any][];
        getAll: () => [string, any][];
        set: (key: string, value: any) => number;
        get: (key: string) => any;
        has: (key: string) => boolean;
        del: (key: string) => fMap.TTruemapItem<string, any>[];
        entries: () => [string, any][];
        keys: () => string[];
        values: () => any[];
        length: () => number;
    };
    private parseKey;
    has(key: string): boolean;
    get(key: string): any;
    set(key: string, value: any): void;
    delete(key: string): void;
}
