export declare function watcher(callbacks: {
    get?: (this_context: any, context?: any) => void;
    set?: (this_context: any, value: any, context?: any) => void;
}): <T, V>(accessor: {
    get: (this: T) => V;
    set: (this: T, v: V) => void;
}, context: ClassAccessorDecoratorContext<T, V>) => {
    get: (this: T) => any;
    set: (this: T, value: V) => any;
};
