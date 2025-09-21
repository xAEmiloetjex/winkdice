import type { AsyncMonad, Container } from "../interfaces/index";
export default class Identity<T> implements AsyncMonad<T>, Container<T> {
    readonly value: T;
    static chain<A, B>(f: (v: A) => Promise<Identity<B>>): (m: Identity<A>) => Promise<Identity<B>>;
    static from<T>(v: T): Identity<T>;
    private constructor();
    join<V>(this: Identity<Identity<V>>): Identity<V>;
    map<V>(f: (r: T) => V): Identity<V>;
    asyncMap<V>(f: (r: T) => Promise<V>): Promise<Identity<V>>;
    apply<A, B>(this: Identity<(a: A) => B>, arg: Identity<A>): Identity<B>;
    apply<A, B>(this: Identity<A>, fn: Identity<(a: A) => B>): Identity<B>;
    asyncApply<A, B>(this: Identity<(a: A) => Promise<B>>, arg: Identity<Promise<A> | A>): Promise<Identity<B>>;
    asyncApply<A, B>(this: Identity<Promise<A> | A>, fn: Identity<(a: A) => Promise<B>>): Promise<Identity<B>>;
    chain<V>(f: (r: T) => Identity<V>): Identity<V>;
    asyncChain<V>(f: (r: T) => Promise<Identity<V>>): Promise<Identity<V>>;
    unwrap(): T;
    get [Symbol.toStringTag](): string;
}
export declare const from: typeof Identity.from, chain: typeof Identity.chain;
export declare const isIdentity: <T>(value: unknown | Identity<T>) => value is Identity<T>;
