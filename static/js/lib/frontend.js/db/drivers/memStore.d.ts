import { TTruemapItem } from '../../Map.js';
import { fMap } from '../../index.js';
import { type Database } from '../types';
export declare class InMemoryDatabase implements Database {
    data: {
        manager: {
            clear: () => never[];
            insert: (map: TTruemapItem<string, any>[]) => TTruemapItem<string, any>[];
            replace: (map: TTruemapItem<string, any>[]) => TTruemapItem<string, any>[];
            toHumanMap: () => fMap.IMapItem<string, any>[];
        };
        size: number;
        delete: (key: string) => TTruemapItem<string, any>[];
        all: () => [string, any][];
        getAll: () => [string, any][];
        set: (key: string, value: any) => number;
        get: (key: string) => any;
        has: (key: string) => boolean;
        del: (key: string) => TTruemapItem<string, any>[];
        entries: () => [string, any][];
        keys: () => string[];
        values: () => any[];
        length: () => number;
    };
    private parseKey;
    private getSubMap;
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<void>;
    delete(table: string, id: string): Promise<void>;
    getAll(table?: string): any[];
    getAllAsync(table?: string): Promise<any[]>;
    insert(table: string, record: any): any;
    update(table: string, id: string, value: any): Promise<void>;
    createTable(tableName: string, columns: Array<{
        name: string;
        type: string;
    }>): Promise<any>;
    has(key: string): Promise<boolean>;
}
