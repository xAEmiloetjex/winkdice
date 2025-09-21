export declare function wait(ms: number): Promise<unknown>;
/**
  * @name "makerandstr"
  * @comment "Generates an random string of characters"
  * @author "xA_Emiloetjex"
  */
export declare function makerandstr(length: number): string;
/**
  * @name "mkRandStr2"
  * @comment "Generates an random string with the given characters"
  * @author "xA_Emiloetjex"
 */
export declare function mkRandStr2(length: number, chars: string): string;
export declare let uniqueStore: string[];
export declare function UniqueGen(generator: (length: number) => string, length: number, retries_max?: number, retries_count?: number, extraCheckFn?: (result: string) => boolean): string;
/**
 * @function mkRandStr3
 * @param {number} length
 * @param {string} chars
 * @description
 * This is the same as `mkRandStr2`.
 *
 * But is also implements `UniqueGen`.
 *
 * The implementation literally looks like this:
 * ```ts
 * export function mkRandStr3(length: number, chars: string): string {
 *    return UniqueGen((_length:number) => mkRandStr2(_length, chars), length)
 * }
 * ```
 */
export declare function mkRandStr3(length: number, chars: string, retry_max?: number): string;
export declare function decimalToHexString(number: number): string;
export declare function splitArray(array: any[], size: number): any[][];
export declare function findMap(array: any[], by: string, id: string): number;
export declare function removeFromArray(Arr: any[], Str: any): any[];
export declare function getFromArray(Arr: any[], ID: number): any;
export declare const ArrayManipulation: {
    splitArray: typeof splitArray;
    findMap: typeof findMap;
    removeFromArray: typeof removeFromArray;
    getFromArray: typeof getFromArray;
};
export declare const idxMap: {
    manager: {
        clear: () => never[];
        insert: (map: import("./maps.js").TTruemapItem<string, number>[]) => import("./maps.js").TTruemapItem<string, number>[];
        replace: (map: import("./maps.js").TTruemapItem<string, number>[]) => import("./maps.js").TTruemapItem<string, number>[];
        toHumanMap: () => import("./maps.js").IMapItem<string, number>[];
    };
    size: number;
    delete: (key: string) => import("./maps.js").TTruemapItem<string, number>[];
    all: () => [string, number][];
    getAll: () => [string, number][];
    set: (key: string, value: number) => number;
    get: (key: string) => number;
    has: (key: string) => boolean;
    del: (key: string) => import("./maps.js").TTruemapItem<string, number>[];
    entries: () => [string, number][];
    keys: () => string[];
    values: () => number[];
    length: () => number;
};
export declare function newIndex(namespace: string): number;
