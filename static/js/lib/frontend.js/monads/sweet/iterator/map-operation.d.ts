import { IntermidiateOperation } from "./intermediate-operation.js";
import type { Maybe } from "../maybe/index.js";
export declare class MapOperation<A, B> extends IntermidiateOperation<A, B> {
    private readonly fn;
    constructor(fn: (v: A, terminate: () => void) => B);
    constructor(fn: (v: A, terminate: () => void) => Iterable<B>, isFlat: true);
    execute(value: A): Maybe<B>;
}
