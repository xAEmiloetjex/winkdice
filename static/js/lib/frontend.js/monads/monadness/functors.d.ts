import { Either } from "./either.js";
import { Option } from "./option.js";
export type Monoid<A> = Either<Error, A> | Option<A> | Promise<A> | Set<A> | Array<A> | ArrayLike<A> | Map<any, A> | {
    [key: string]: A;
} | Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
export declare const Identity: (a: any) => any;
export type Functor<A, B> = (f: (a: A) => B) => (m: Monoid<A>) => Monoid<B>;
export declare function fmap<A, B>(getter: (g: Monoid<A>) => A, setter: (s: B) => Monoid<B>, err: (e: Error) => Monoid<B>): Functor<A, B>;
export declare function compose<A, B>(f: (a: A) => B): any;
