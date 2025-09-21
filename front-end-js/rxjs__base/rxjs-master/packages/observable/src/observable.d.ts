import type { TeardownLogic, UnaryFunction, Subscribable, Observer, OperatorFunction, SubscriptionLike, ObservableNotification, ObservableInput, ObservedValueOf, ReadableStreamLike, CompleteNotification, ErrorNotification, NextNotification } from './types.js';
/**
 * An error thrown when one or more errors have occurred during the
 * `unsubscribe` of a {@link Subscription}.
 */
export declare class UnsubscriptionError extends Error {
    errors: any[];
    /**
     * @deprecated Internal implementation detail. Do not construct error instances.
     * Cannot be tagged as internal: https://github.com/ReactiveX/rxjs/issues/6269
     */
    constructor(errors: any[]);
}
/**
 * Represents a disposable resource, such as the execution of an Observable. A
 * Subscription has one important method, `unsubscribe`, that takes no argument
 * and just disposes the resource held by the subscription.
 *
 * Additionally, subscriptions may be grouped together through the `add()`
 * method, which will attach a child Subscription to the current Subscription.
 * When a Subscription is unsubscribed, all its children (and its grandchildren)
 * will be unsubscribed as well.
 */
export declare class Subscription implements SubscriptionLike {
    private initialTeardown?;
    static EMPTY: Subscription;
    /**
     * A flag to indicate whether this Subscription has already been unsubscribed.
     */
    closed: boolean;
    /**
     * The list of registered finalizers to execute upon unsubscription. Adding and removing from this
     * list occurs in the {@link #add} and {@link #remove} methods.
     */
    private _finalizers;
    /**
     * @param initialTeardown A function executed first as part of the finalization
     * process that is kicked off when {@link #unsubscribe} is called.
     */
    constructor(initialTeardown?: () => void);
    /**
     * Disposes the resources held by the subscription. May, for instance, cancel
     * an ongoing Observable execution or cancel any other type of work that
     * started when the Subscription was created.
     */
    unsubscribe(): void;
    /**
     * Adds a finalizer to this subscription, so that finalization will be unsubscribed/called
     * when this subscription is unsubscribed. If this subscription is already {@link #closed},
     * because it has already been unsubscribed, then whatever finalizer is passed to it
     * will automatically be executed (unless the finalizer itself is also a closed subscription).
     *
     * Closed Subscriptions cannot be added as finalizers to any subscription. Adding a closed
     * subscription to a any subscription will result in no operation. (A noop).
     *
     * Adding a subscription to itself, or adding `null` or `undefined` will not perform any
     * operation at all. (A noop).
     *
     * `Subscription` instances that are added to this instance will automatically remove themselves
     * if they are unsubscribed. Functions and {@link Unsubscribable} objects that you wish to remove
     * will need to be removed manually with {@link #remove}
     *
     * @param teardown The finalization logic to add to this subscription.
     */
    add(teardown: TeardownLogic): void;
    /**
     * Removes a finalizer from this subscription that was previously added with the {@link #add} method.
     *
     * Note that `Subscription` instances, when unsubscribed, will automatically remove themselves
     * from every other `Subscription` they have been added to. This means that using the `remove` method
     * is not a common thing and should be used thoughtfully.
     *
     * If you add the same finalizer instance of a function or an unsubscribable object to a `Subscription` instance
     * more than once, you will need to call `remove` the same number of times to remove all instances.
     *
     * All finalizer instances are removed to free up memory upon unsubscription.
     *
     * TIP: In instances you're adding and removing _Subscriptions from other Subscriptions_, you should
     * be sure to unsubscribe or otherwise get rid of the child subscription reference as soon as you remove it.
     * The child subscription has a reference to the parent it was added to via closure. In most cases, this
     * a non-issue, as child subscriptions are rarely long-lived.
     *
     * @param teardown The finalizer to remove from this subscription
     */
    remove(teardown: Exclude<TeardownLogic, void>): void;
}
export interface Subscription {
    [Symbol.dispose](): void;
}
export interface SubscriberOverrides<T> {
    /**
     * If provided, this function will be called whenever the {@link Subscriber}'s
     * `next` method is called, with the value that was passed to that call. If
     * an error is thrown within this function, it will be handled and passed to
     * the destination's `error` method.
     * @param value The value that is being observed from the source.
     */
    next?: (value: T) => void;
    /**
     * If provided, this function will be called whenever the {@link Subscriber}'s
     * `error` method is called, with the error that was passed to that call. If
     * an error is thrown within this function, it will be handled and passed to
     * the destination's `error` method.
     * @param err An error that has been thrown by the source observable.
     */
    error?: (err: any) => void;
    /**
     * If provided, this function will be called whenever the {@link Subscriber}'s
     * `complete` method is called. If an error is thrown within this function, it
     * will be handled and passed to the destination's `error` method.
     */
    complete?: () => void;
    /**
     * If provided, this function will be called after all teardown has occurred
     * for this {@link Subscriber}. This is generally used for cleanup purposes
     * during operator development.
     */
    finalize?: () => void;
}
/**
 * Implements the {@link Observer} interface and extends the
 * {@link Subscription} class. While the {@link Observer} is the public API for
 * consuming the values of an {@link Observable}, all Observers get converted to
 * a Subscriber, in order to provide Subscription-like capabilities such as
 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
 * implementing operators, but it is rarely used as a public API.
 */
export declare class Subscriber<T> extends Subscription implements Observer<T> {
    /** @internal */
    protected isStopped: boolean;
    /** @internal */
    protected destination: Observer<T>;
    /** @internal */
    protected readonly _nextOverride: ((value: T) => void) | null;
    /** @internal */
    protected readonly _errorOverride: ((err: any) => void) | null;
    /** @internal */
    protected readonly _completeOverride: (() => void) | null;
    /** @internal */
    protected readonly _onFinalize: (() => void) | null;
    /**
     * @deprecated Do not create instances of `Subscriber` directly. Use {@link operate} instead.
     */
    constructor(destination?: Subscriber<T> | Partial<Observer<T>> | ((value: T) => void) | null);
    /**
     * @internal
     */
    constructor(destination: Subscriber<any> | Partial<Observer<any>> | ((value: any) => void) | null, overrides: SubscriberOverrides<T>);
    /**
     * The {@link Observer} callback to receive notifications of type `next` from
     * the Observable, with a value. The Observable may call this method 0 or more
     * times.
     * @param value The `next` value.
     */
    next(value: T): void;
    /**
     * The {@link Observer} callback to receive notifications of type `error` from
     * the Observable, with an attached `Error`. Notifies the Observer that
     * the Observable has experienced an error condition.
     * @param err The `error` exception.
     */
    error(err?: any): void;
    /**
     * The {@link Observer} callback to receive a valueless notification of type
     * `complete` from the Observable. Notifies the Observer that the Observable
     * has finished sending push-based notifications.
     */
    complete(): void;
    unsubscribe(): void;
    protected _next(value: T): void;
    protected _error(err: any): void;
    protected _complete(): void;
}
/**
 * The {@link GlobalConfig} object for RxJS. It is used to configure things
 * like how to react on unhandled errors.
 */
export declare const config: GlobalConfig;
/**
 * The global configuration object for RxJS, used to configure things
 * like how to react on unhandled errors. Accessible via {@link config}
 * object.
 */
export interface GlobalConfig {
    /**
     * A registration point for unhandled errors from RxJS. These are errors that
     * cannot were not handled by consuming code in the usual subscription path. For
     * example, if you have this configured, and you subscribe to an observable without
     * providing an error handler, errors from that subscription will end up here. This
     * will _always_ be called asynchronously on another job in the runtime. This is because
     * we do not want errors thrown in this user-configured handler to interfere with the
     * behavior of the library.
     */
    onUnhandledError: ((err: any) => void) | null;
    /**
     * A registration point for notifications that cannot be sent to subscribers because they
     * have completed, errored or have been explicitly unsubscribed. By default, next, complete
     * and error notifications sent to stopped subscribers are noops. However, sometimes callers
     * might want a different behavior. For example, with sources that attempt to report errors
     * to stopped subscribers, a caller can configure RxJS to throw an unhandled error instead.
     * This will _always_ be called asynchronously on another job in the runtime. This is because
     * we do not want errors thrown in this user-configured handler to interfere with the
     * behavior of the library.
     */
    onStoppedNotification: ((notification: ObservableNotification<any>, subscriber: Subscriber<any>) => void) | null;
}
export interface OperateConfig<In, Out> extends SubscriberOverrides<In> {
    /**
     * The destination subscriber to forward notifications to. This is also the
     * subscriber that will receive unhandled errors if your `next`, `error`, or `complete`
     * overrides throw.
     */
    destination: Subscriber<Out>;
}
/**
 * Creates a new {@link Subscriber} instance that passes notifications on to the
 * supplied `destination`. The overrides provided in the `config` argument for
 * `next`, `error`, and `complete` will be called in such a way that any
 * errors are caught and forwarded to the destination's `error` handler. The returned
 * `Subscriber` will be "chained" to the `destination` such that when `unsubscribe` is
 * called on the `destination`, the returned `Subscriber` will also be unsubscribed.
 *
 * Advanced: This ensures that subscriptions are properly wired up prior to starting the
 * subscription logic. This prevents "synchronous firehose" scenarios where an
 * inner observable from a flattening operation cannot be stopped by a downstream
 * terminal operator like `take`.
 *
 * This is a utility designed to be used to create new operators for observables.
 *
 * For examples, please see our code base.
 *
 * @param config The configuration for creating a new subscriber for an operator.
 * @returns A new subscriber that is chained to the destination.
 */
export declare function operate<In, Out>({ destination, ...subscriberOverrides }: OperateConfig<In, Out>): Subscriber<In>;
declare global {
    interface SymbolConstructor {
        readonly dispose: unique symbol;
    }
}
/**
 * A representation of any set of values over any amount of time. This is the most basic building block
 * of RxJS.
 */
export declare class Observable<T> implements Subscribable<T> {
    /**
     * @param subscribe The function that is called when the Observable is
     * initially subscribed to. This function is given a Subscriber, to which new values
     * can be `next`ed, or an `error` method can be called to raise an error, or
     * `complete` can be called to notify of a successful completion.
     */
    constructor(subscribe?: (this: Observable<T>, subscriber: Subscriber<T>) => TeardownLogic);
    /**
     * Invokes an execution of an Observable and registers Observer handlers for notifications it will emit.
     *
     * <span class="informal">Use it when you have all these Observables, but still nothing is happening.</span>
     *
     * `subscribe` is not a regular operator, but a method that calls Observable's internal `subscribe` function. It
     * might be for example a function that you passed to Observable's constructor, but most of the time it is
     * a library implementation, which defines what will be emitted by an Observable, and when it be will emitted. This means
     * that calling `subscribe` is actually the moment when Observable starts its work, not when it is created, as it is often
     * the thought.
     *
     * Apart from starting the execution of an Observable, this method allows you to listen for values
     * that an Observable emits, as well as for when it completes or errors. You can achieve this in two
     * of the following ways.
     *
     * The first way is creating an object that implements {@link Observer} interface. It should have methods
     * defined by that interface, but note that it should be just a regular JavaScript object, which you can create
     * yourself in any way you want (ES6 class, classic function constructor, object literal etc.). In particular, do
     * not attempt to use any RxJS implementation details to create Observers - you don't need them. Remember also
     * that your object does not have to implement all methods. If you find yourself creating a method that doesn't
     * do anything, you can simply omit it. Note however, if the `error` method is not provided and an error happens,
     * it will be thrown asynchronously. Errors thrown asynchronously cannot be caught using `try`/`catch`. Instead,
     * use the {@link onUnhandledError} configuration option or use a runtime handler (like `window.onerror` or
     * `process.on('error)`) to be notified of unhandled errors. Because of this, it's recommended that you provide
     * an `error` method to avoid missing thrown errors.
     *
     * The second way is to give up on Observer object altogether and simply provide callback functions in place of its methods.
     * This means you can provide three functions as arguments to `subscribe`, where the first function is equivalent
     * of a `next` method, the second of an `error` method and the third of a `complete` method. Just as in case of an Observer,
     * if you do not need to listen for something, you can omit a function by passing `undefined` or `null`,
     * since `subscribe` recognizes these functions by where they were placed in function call. When it comes
     * to the `error` function, as with an Observer, if not provided, errors emitted by an Observable will be thrown asynchronously.
     *
     * You can, however, subscribe with no parameters at all. This may be the case where you're not interested in terminal events
     * and you also handled emissions internally by using operators (e.g. using `tap`).
     *
     * Whichever style of calling `subscribe` you use, in both cases it returns a Subscription object.
     * This object allows you to call `unsubscribe` on it, which in turn will stop the work that an Observable does and will clean
     * up all resources that an Observable used. Note that cancelling a subscription will not call `complete` callback
     * provided to `subscribe` function, which is reserved for a regular completion signal that comes from an Observable.
     *
     * Remember that callbacks provided to `subscribe` are not guaranteed to be called asynchronously.
     * It is an Observable itself that decides when these functions will be called. For example {@link of}
     * by default emits all its values synchronously. Always check documentation for how given Observable
     * will behave when subscribed and if its default behavior can be modified with a `scheduler`.
     *
     * #### Examples
     *
     * Subscribe with an {@link guide/observer Observer}
     *
     * ```ts
     * import { of } from 'rxjs';
     *
     * const sumObserver = {
     *   sum: 0,
     *   next(value) {
     *     console.log('Adding: ' + value);
     *     this.sum = this.sum + value;
     *   },
     *   error() {
     *     // We actually could just remove this method,
     *     // since we do not really care about errors right now.
     *   },
     *   complete() {
     *     console.log('Sum equals: ' + this.sum);
     *   }
     * };
     *
     * of(1, 2, 3) // Synchronously emits 1, 2, 3 and then completes.
     *   .subscribe(sumObserver);
     *
     * // Logs:
     * // 'Adding: 1'
     * // 'Adding: 2'
     * // 'Adding: 3'
     * // 'Sum equals: 6'
     * ```
     *
     * Subscribe with functions ({@link deprecations/subscribe-arguments deprecated})
     *
     * ```ts
     * import { of } from 'rxjs'
     *
     * let sum = 0;
     *
     * of(1, 2, 3).subscribe(
     *   value => {
     *     console.log('Adding: ' + value);
     *     sum = sum + value;
     *   },
     *   undefined,
     *   () => console.log('Sum equals: ' + sum)
     * );
     *
     * // Logs:
     * // 'Adding: 1'
     * // 'Adding: 2'
     * // 'Adding: 3'
     * // 'Sum equals: 6'
     * ```
     *
     * Cancel a subscription
     *
     * ```ts
     * import { interval } from 'rxjs';
     *
     * const subscription = interval(1000).subscribe({
     *   next(num) {
     *     console.log(num)
     *   },
     *   complete() {
     *     // Will not be called, even when cancelling subscription.
     *     console.log('completed!');
     *   }
     * });
     *
     * setTimeout(() => {
     *   subscription.unsubscribe();
     *   console.log('unsubscribed!');
     * }, 2500);
     *
     * // Logs:
     * // 0 after 1s
     * // 1 after 2s
     * // 'unsubscribed!' after 2.5s
     * ```
     *
     * @param observerOrNext Either an {@link Observer} with some or all callback methods,
     * or the `next` handler that is called for each value emitted from the subscribed Observable.
     * @return A subscription reference to the registered handlers.
     */
    subscribe(observerOrNext?: Partial<Observer<T>> | ((value: T) => void) | null): Subscription;
    /** @internal */
    protected _trySubscribe(sink: Subscriber<T>): TeardownLogic;
    /**
     * Used as a NON-CANCELLABLE means of subscribing to an observable, for use with
     * APIs that expect promises, like `async/await`. You cannot unsubscribe from this.
     *
     * **WARNING**: Only use this with observables you *know* will complete. If the source
     * observable does not complete, you will end up with a promise that is hung up, and
     * potentially all of the state of an async function hanging out in memory. To avoid
     * this situation, look into adding something like {@link timeout}, {@link take},
     * {@link takeWhile}, or {@link takeUntil} amongst others.
     *
     * #### Example
     *
     * ```ts
     * import { interval, take } from 'rxjs';
     *
     * const source$ = interval(1000).pipe(take(4));
     *
     * async function getTotal() {
     *   let total = 0;
     *
     *   await source$.forEach(value => {
     *     total += value;
     *     console.log('observable -> ' + value);
     *   });
     *
     *   return total;
     * }
     *
     * getTotal().then(
     *   total => console.log('Total: ' + total)
     * );
     *
     * // Expected:
     * // 'observable -> 0'
     * // 'observable -> 1'
     * // 'observable -> 2'
     * // 'observable -> 3'
     * // 'Total: 6'
     * ```
     *
     * @param next A handler for each value emitted by the observable.
     * @return A promise that either resolves on observable completion or
     * rejects with the handled error.
     */
    forEach(next: (value: T) => void): Promise<void>;
    /** @internal */
    protected _subscribe(_subscriber: Subscriber<any>): TeardownLogic;
    pipe(): Observable<T>;
    pipe<A>(op1: UnaryFunction<Observable<T>, A>): A;
    pipe<A, B>(op1: UnaryFunction<Observable<T>, A>, op2: UnaryFunction<A, B>): B;
    pipe<A, B, C>(op1: UnaryFunction<Observable<T>, A>, op2: UnaryFunction<A, B>, op3: UnaryFunction<B, C>): C;
    pipe<A, B, C, D>(op1: UnaryFunction<Observable<T>, A>, op2: UnaryFunction<A, B>, op3: UnaryFunction<B, C>, op4: UnaryFunction<C, D>): D;
    pipe<A, B, C, D, E>(op1: UnaryFunction<Observable<T>, A>, op2: UnaryFunction<A, B>, op3: UnaryFunction<B, C>, op4: UnaryFunction<C, D>, op5: UnaryFunction<D, E>): E;
    pipe<A, B, C, D, E, F>(op1: UnaryFunction<Observable<T>, A>, op2: UnaryFunction<A, B>, op3: UnaryFunction<B, C>, op4: UnaryFunction<C, D>, op5: UnaryFunction<D, E>, op6: UnaryFunction<E, F>): F;
    pipe<A, B, C, D, E, F, G>(op1: UnaryFunction<Observable<T>, A>, op2: UnaryFunction<A, B>, op3: UnaryFunction<B, C>, op4: UnaryFunction<C, D>, op5: UnaryFunction<D, E>, op6: UnaryFunction<E, F>, op7: UnaryFunction<F, G>): G;
    pipe<A, B, C, D, E, F, G, H>(op1: UnaryFunction<Observable<T>, A>, op2: UnaryFunction<A, B>, op3: UnaryFunction<B, C>, op4: UnaryFunction<C, D>, op5: UnaryFunction<D, E>, op6: UnaryFunction<E, F>, op7: UnaryFunction<F, G>, op8: UnaryFunction<G, H>): H;
    pipe<A, B, C, D, E, F, G, H, I>(op1: UnaryFunction<Observable<T>, A>, op2: UnaryFunction<A, B>, op3: UnaryFunction<B, C>, op4: UnaryFunction<C, D>, op5: UnaryFunction<D, E>, op6: UnaryFunction<E, F>, op7: UnaryFunction<F, G>, op8: UnaryFunction<G, H>, op9: UnaryFunction<H, I>): I;
    pipe<A, B, C, D, E, F, G, H, I>(op1: UnaryFunction<Observable<T>, A>, op2: UnaryFunction<A, B>, op3: UnaryFunction<B, C>, op4: UnaryFunction<C, D>, op5: UnaryFunction<D, E>, op6: UnaryFunction<E, F>, op7: UnaryFunction<F, G>, op8: UnaryFunction<G, H>, op9: UnaryFunction<H, I>, ...operations: OperatorFunction<any, any>[]): Observable<unknown>;
    pipe<A, B, C, D, E, F, G, H, I>(op1: UnaryFunction<Observable<T>, A>, op2: UnaryFunction<A, B>, op3: UnaryFunction<B, C>, op4: UnaryFunction<C, D>, op5: UnaryFunction<D, E>, op6: UnaryFunction<E, F>, op7: UnaryFunction<F, G>, op8: UnaryFunction<G, H>, op9: UnaryFunction<H, I>, ...operations: UnaryFunction<any, any>[]): unknown;
    /**
     * Observable is async iterable, so it can be used in `for await` loop. This method
     * of subscription is cancellable by breaking the for await loop. Although it's not
     * recommended to use Observable's AsyncIterable contract outside of `for await`, if
     * you're consuming the Observable as an AsyncIterable, and you're _not_ using `for await`,
     * you can use the `throw` or `return` methods on the `AsyncGenerator` we return to
     * cancel the subscription. Note that the subscription to the observable does not start
     * until the first value is requested from the AsyncIterable.
     *
     * Functionally, this is equivalent to using a {@link concatMap} with an `async` function.
     * That means that while the body of the `for await` loop is executing, any values that arrive
     * from the observable source will be queued up, so they can be processed by the `for await`
     * loop in order. So, like {@link concatMap} it's important to understand the speed your
     * source emits at, and the speed of the body of your `for await` loop.
     *
     * ## Example
     *
     * ```ts
     * import { interval } from 'rxjs';
     *
     * async function main() {
     *  // Subscribe to the observable using for await.
     *  for await (const value of interval(1000)) {
     *    console.log(value);
     *
     *    if (value > 5) {
     *      // Unsubscribe from the interval if we get a value greater than 5
     *      break;
     *    }
     *  }
     * }
     *
     * main();
     * ```
     */
    [Symbol.asyncIterator](): AsyncGenerator<T, void, void>;
}
/**
 * Handles an error on another job either with the user-configured {@link onUnhandledError},
 * or by throwing it on that new job so it can be picked up by `window.onerror`, `process.on('error')`, etc.
 *
 * This should be called whenever there is an error that is out-of-band with the subscription
 * or when an error hits a terminal boundary of the subscription and no error handler was provided.
 *
 * @param err the error to report
 */
export declare function reportUnhandledError(err: any): void;
/**
 * Creates an Observable from an Array, an array-like object, a Promise, an iterable object, or an Observable-like object.
 *
 * <span class="informal">Converts almost anything to an Observable.</span>
 *
 * ![](from.png)
 *
 * `from` converts various other objects and data types into Observables. It also converts a Promise, an array-like, or an
 * <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable" target="_blank">iterable</a>
 * object into an Observable that emits the items in that promise, array, or iterable. A String, in this context, is treated
 * as an array of characters. Observable-like objects (contains a function named with the ES2015 Symbol for Observable) can also be
 * converted through this operator.
 *
 * ## Examples
 *
 * Converts an array to an Observable
 *
 * ```ts
 * import { from } from 'rxjs';
 *
 * const array = [10, 20, 30];
 * const result = from(array);
 *
 * result.subscribe(x => console.log(x));
 *
 * // Logs:
 * // 10
 * // 20
 * // 30
 * ```
 *
 * Convert an infinite iterable (from a generator) to an Observable
 *
 * ```ts
 * import { from, take } from 'rxjs';
 *
 * function* generateDoubles(seed) {
 *    let i = seed;
 *    while (true) {
 *      yield i;
 *      i = 2 * i; // double it
 *    }
 * }
 *
 * const iterator = generateDoubles(3);
 * const result = from(iterator).pipe(take(10));
 *
 * result.subscribe(x => console.log(x));
 *
 * // Logs:
 * // 3
 * // 6
 * // 12
 * // 24
 * // 48
 * // 96
 * // 192
 * // 384
 * // 768
 * // 1536
 * ```
 *
 * @see {@link fromEvent}
 * @see {@link fromEventPattern}
 * @see {@link scheduled}
 *
 * @param input A subscription object, a Promise, an Observable-like,
 * an Array, an iterable, async iterable, or an array-like object to be converted.
 */
export declare function from<O extends ObservableInput<any>>(input: O): Observable<ObservedValueOf<O>>;
/**
 * Synchronously emits the values of an array like and completes.
 * This is exported because there are creation functions and operators that need to
 * make direct use of the same logic, and there's no reason to make them run through
 * `from` conditionals because we *know* they're dealing with an array.
 * @param array The array to emit values from
 */
export declare function fromArrayLike<T>(array: ArrayLike<T>): Observable<T>;
export declare function fromPromise<T>(promise: PromiseLike<T>): Observable<T>;
/**
 * Subscribes to an ArrayLike with a subscriber
 * @param array The array or array-like to subscribe to
 * @param subscriber
 */
export declare function subscribeToArray<T>(array: ArrayLike<T>, subscriber: Subscriber<T>): void;
export declare enum ObservableInputType {
    Own = 0,
    InteropObservable = 1,
    ArrayLike = 2,
    Promise = 3,
    AsyncIterable = 4,
    Iterable = 5,
    ReadableStreamLike = 6
}
export declare function getObservableInputType(input: unknown): ObservableInputType;
/**
 * Returns true if the object is a function.
 * @param value The value to check
 */
export declare function isFunction(value: any): value is (...args: any[]) => any;
export declare function readableStreamLikeToAsyncGenerator<T>(readableStream: ReadableStreamLike<T>): AsyncGenerator<T>;
/**
 * Tests to see if the object is "thennable".
 * @param value the object to test
 */
export declare function isPromise(value: any): value is PromiseLike<any>;
export declare function isArrayLike<T>(x: any): x is ArrayLike<T>;
/**
 * Tests to see if the object is an RxJS {@link Observable}
 * @param obj the object to test
 */
export declare function isObservable(obj: any): obj is Observable<unknown>;
/**
 * A completion object optimized for memory use and created to be the
 * same "shape" as other notifications in v8.
 * @internal
 */
export declare const COMPLETE_NOTIFICATION: CompleteNotification;
/**
 * Internal use only. Creates an optimized error notification that is the same "shape"
 * as other notifications.
 * @internal
 */
export declare function errorNotification(error: any): ErrorNotification;
/**
 * Internal use only. Creates an optimized next notification that is the same "shape"
 * as other notifications.
 * @internal
 */
export declare function nextNotification<T>(value: T): NextNotification<T>;
export declare function createNotification<T>(kind: 'N', value: T, error: undefined): {
    kind: 'N';
    value: T;
    error: undefined;
};
export declare function createNotification<T>(kind: 'E', value: undefined, error: any): {
    kind: 'E';
    value: undefined;
    error: any;
};
export declare function createNotification<T>(kind: 'C', value: undefined, error: undefined): {
    kind: 'C';
    value: undefined;
    error: undefined;
};
export declare function createNotification<T>(kind: 'N' | 'E' | 'C', value: T | undefined, error: any): {
    kind: 'N' | 'E' | 'C';
    value: T | undefined;
    error: any;
};
