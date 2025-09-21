import { just } from "../maybe/index.js";
import { IntermidiateOperation } from "./intermediate-operation.js";
import type { Maybe } from "../maybe/index.js";

export class MapOperation<A, B> extends IntermidiateOperation<A, B> {
  constructor(fn: (v: A, terminate: () => void) => B);
  constructor(fn: (v: A, terminate: () => void) => Iterable<B>, isFlat: true);
  constructor(private readonly fn: (v: A, terminate: () => void) => B, isFlat = false) {
    super(isFlat);
  }

  execute(value: A): Maybe<B> {
    return just(this.fn(value, () => this.terminate()));
  }
}
