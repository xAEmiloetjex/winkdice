export declare class TypeCheck {
    private handler;
    constructor(handler?: unknown);
    numSync(inp: number): number | null;
    boolSync(inp: boolean): boolean | null;
    funcSync(inp: void | ((...args: RestrictiveAny[]) => RestrictiveAny)): RestrictiveAny;
    objeSync(inp: object): object | null;
    striSync(inp: string): string | null;
    TypeOfSync(type: string, inp: unknown): unknown;
}
export declare class TypeCheckAsync extends TypeCheck {
    constructor(handler?: unknown);
    num(inp: number): Promise<number>;
    bool(inp: boolean): Promise<boolean>;
    func(inp: void | ((...args: RestrictiveAny[]) => RestrictiveAny)): Promise<RestrictiveAny>;
    obje(inp: object): Promise<object>;
    stri(inp: string): Promise<string>;
    TypeOf(type: string, inp: unknown): Promise<any>;
    custom: {
        gender: (input: boolean | null) => Promise<object | string>;
    };
}
export type RestrictiveAny_WithoutArray = string | boolean | number | object | void | null;
export type RestrictiveAny_noPromise = Array<RestrictiveAny_WithoutArray> | RestrictiveAny_WithoutArray;
export type RestrictiveAny = Promise<RestrictiveAny_noPromise> | RestrictiveAny_noPromise;
export declare class Extra extends TypeCheckAsync {
    constructor(handler?: unknown);
    void(params: RestrictiveAny, silent?: boolean): Promise<RestrictiveAny[]>;
}
declare const jsTypes: typeof Extra;
export default jsTypes;
