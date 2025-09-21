import { IntermidiateOperation } from "./intermediate-operation.js";
import type { Maybe } from "../maybe/index.js";
export declare class FilterOperation<A, B extends A = A> extends IntermidiateOperation<A, B> {
    private readonly predicate;
    constructor(predicate: (v: A, terminate: () => void) => v is B);
    execute(value: A): Maybe<B>;
}
