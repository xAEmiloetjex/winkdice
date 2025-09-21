/** @prettier */
import { expect } from 'chai';
import { fromEvent, NEVER, timer } from 'rxjs';
import { mapTo, take, concatWith } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { observableMatcher } from '../helpers/observableMatcher';
/** @test {fromEvent} */
describe('fromEvent', () => {
    let rxTestScheduler;
    beforeEach(() => {
        rxTestScheduler = new TestScheduler(observableMatcher);
    });
    it('should create an observable of click on the element', () => {
        rxTestScheduler.run(({ expectObservable, time }) => {
            const delay1 = time('-----|     ');
            const delay2 = time('     --|   ');
            const expected = '   -----x-x---';
            const target = {
                addEventListener: (eventType, listener) => {
                    // Here we're just simulating some event target that emits to events after delay1 and delay2.
                    timer(delay1, delay2).pipe(mapTo('ev'), take(2), concatWith(NEVER)).subscribe(listener);
                },
                removeEventListener: () => void 0,
                dispatchEvent: () => void 0,
            };
            const e1 = fromEvent(target, 'click');
            expectObservable(e1).toBe(expected, { x: 'ev' });
        });
    });
    it('should setup an event observable on objects with "on" and "off" ', () => {
        let onEventName;
        let onHandler;
        let offEventName;
        let offHandler;
        const obj = {
            on: (a, b) => {
                onEventName = a;
                onHandler = b;
            },
            off: (a, b) => {
                offEventName = a;
                offHandler = b;
            },
        };
        const subscription = fromEvent(obj, 'click').subscribe(() => {
            //noop
        });
        subscription.unsubscribe();
        expect(onEventName).to.equal('click');
        expect(typeof onHandler).to.equal('function');
        expect(offEventName).to.equal(onEventName);
        expect(offHandler).to.equal(onHandler);
    });
    it('should setup an event observable on objects with "addEventListener" and "removeEventListener" ', () => {
        let onEventName;
        let onHandler;
        let offEventName;
        let offHandler;
        const obj = {
            addEventListener: (a, b, useCapture) => {
                onEventName = a;
                onHandler = b;
            },
            removeEventListener: (a, b, useCapture) => {
                offEventName = a;
                offHandler = b;
            },
        };
        const subscription = fromEvent(obj, 'click').subscribe(() => {
            //noop
        });
        subscription.unsubscribe();
        expect(onEventName).to.equal('click');
        expect(typeof onHandler).to.equal('function');
        expect(offEventName).to.equal(onEventName);
        expect(offHandler).to.equal(onHandler);
    });
    it('should setup an event observable on objects with "addListener" and "removeListener" returning event emitter', () => {
        let onEventName;
        let onHandler;
        let offEventName;
        let offHandler;
        const obj = {
            addListener(a, b) {
                onEventName = a;
                onHandler = b;
                return this;
            },
            removeListener(a, b) {
                offEventName = a;
                offHandler = b;
                return this;
            },
        };
        const subscription = fromEvent(obj, 'click').subscribe(() => {
            //noop
        });
        subscription.unsubscribe();
        expect(onEventName).to.equal('click');
        expect(typeof onHandler).to.equal('function');
        expect(offEventName).to.equal(onEventName);
        expect(offHandler).to.equal(onHandler);
    });
    it('should pass symbol to "addListener" and "removeListener"', () => {
        let onEventName;
        let onHandler;
        let offEventName;
        let offHandler;
        const SYMBOL_EVENT = Symbol();
        const obj = {
            addListener(a, b) {
                onEventName = a;
                onHandler = b;
                return this;
            },
            removeListener(a, b) {
                offEventName = a;
                offHandler = b;
                return this;
            },
        };
        const subscription = fromEvent(obj, SYMBOL_EVENT).subscribe(() => {
            //noop
        });
        subscription.unsubscribe();
        expect(onEventName).to.equal(SYMBOL_EVENT);
        expect(typeof onHandler).to.equal('function');
        expect(offEventName).to.equal(onEventName);
        expect(offHandler).to.equal(onHandler);
    });
    it('should setup an event observable on objects with "addListener" and "removeListener" returning nothing', () => {
        let onEventName;
        let onHandler;
        let offEventName;
        let offHandler;
        const obj = {
            addListener(a, b, context) {
                onEventName = a;
                onHandler = b;
                return { context: '' };
            },
            removeListener(a, b) {
                offEventName = a;
                offHandler = b;
            },
        };
        const subscription = fromEvent(obj, 'click').subscribe(() => {
            //noop
        });
        subscription.unsubscribe();
        expect(onEventName).to.equal('click');
        expect(typeof onHandler).to.equal('function');
        expect(offEventName).to.equal(onEventName);
        expect(offHandler).to.equal(onHandler);
    });
    it('should setup an event observable on objects with "addListener" and "removeListener" and "length" ', () => {
        let onEventName;
        let onHandler;
        let offEventName;
        let offHandler;
        const obj = {
            addListener: (a, b) => {
                onEventName = a;
                onHandler = b;
            },
            removeListener: (a, b) => {
                offEventName = a;
                offHandler = b;
            },
            length: 1,
        };
        const subscription = fromEvent(obj, 'click').subscribe(() => {
            //noop
        });
        subscription.unsubscribe();
        expect(onEventName).to.equal('click');
        expect(typeof onHandler).to.equal('function');
        expect(offEventName).to.equal(onEventName);
        expect(offHandler).to.equal(onHandler);
    });
    it('should throw if passed an invalid event target', () => {
        const obj = {
            addListener: () => {
                //noop
            },
        };
        expect(() => {
            fromEvent(obj, 'click');
        }).to.throw(/Invalid event target/);
    });
    it('should pass through options to addEventListener and removeEventListener', () => {
        let onOptions;
        let offOptions;
        const expectedOptions = { capture: true, passive: true };
        const obj = {
            addEventListener: (a, b, c) => {
                onOptions = c;
            },
            removeEventListener: (a, b, c) => {
                offOptions = c;
            },
        };
        const subscription = fromEvent(obj, 'click', expectedOptions).subscribe(() => {
            //noop
        });
        subscription.unsubscribe();
        expect(onOptions).to.equal(expectedOptions);
        expect(offOptions).to.equal(expectedOptions);
    });
    it('should pass through events that occur', (done) => {
        let send;
        const obj = {
            on: (name, handler) => {
                send = handler;
            },
            off: () => {
                //noop
            },
        };
        fromEvent(obj, 'click')
            .pipe(take(1))
            .subscribe({
            next: (e) => {
                expect(e).to.equal('test');
            },
            error: (err) => {
                done(new Error('should not be called'));
            },
            complete: () => {
                done();
            },
        });
        send('test');
    });
    it('should pass through events that occur and use the selector if provided', (done) => {
        let send;
        const obj = {
            on: (name, handler) => {
                send = handler;
            },
            off: () => {
                //noop
            },
        };
        function selector(x) {
            return x + '!';
        }
        fromEvent(obj, 'click', selector)
            .pipe(take(1))
            .subscribe({
            next: (e) => {
                expect(e).to.equal('test!');
            },
            error: (err) => {
                done(new Error('should not be called'));
            },
            complete: () => {
                done();
            },
        });
        send('test');
    });
    it('should not fail if no event arguments are passed and the selector does not return', (done) => {
        let send;
        const obj = {
            on: (name, handler) => {
                send = handler;
            },
            off: () => {
                //noop
            },
        };
        function selector() {
            //noop
        }
        fromEvent(obj, 'click', selector)
            .pipe(take(1))
            .subscribe({
            next: (e) => {
                expect(e).not.exist;
            },
            error: (err) => {
                done(new Error('should not be called'));
            },
            complete: () => {
                done();
            },
        });
        send();
    });
    it('should return a value from the selector if no event arguments are passed', (done) => {
        let send;
        const obj = {
            on: (name, handler) => {
                send = handler;
            },
            off: () => {
                //noop
            },
        };
        function selector() {
            return 'no arguments';
        }
        fromEvent(obj, 'click', selector)
            .pipe(take(1))
            .subscribe({
            next: (e) => {
                expect(e).to.equal('no arguments');
            },
            error: (err) => {
                done(new Error('should not be called'));
            },
            complete: () => {
                done();
            },
        });
        send();
    });
    it('should pass multiple arguments to selector from event emitter', (done) => {
        let send;
        const obj = {
            on: (name, handler) => {
                send = handler;
            },
            off: () => {
                //noop
            },
        };
        function selector(x, y, z) {
            // eslint-disable-next-line prefer-rest-params
            return [].slice.call(arguments);
        }
        fromEvent(obj, 'click', selector)
            .pipe(take(1))
            .subscribe({
            next: (e) => {
                expect(e).to.deep.equal([1, 2, 3]);
            },
            error: (err) => {
                done(new Error('should not be called'));
            },
            complete: () => {
                done();
            },
        });
        send(1, 2, 3);
    });
    it('should emit multiple arguments from event as an array', (done) => {
        let send;
        const obj = {
            on: (name, handler) => {
                send = handler;
            },
            off: () => {
                //noop
            },
        };
        fromEvent(obj, 'click')
            .pipe(take(1))
            .subscribe({
            next: (e) => {
                expect(e).to.deep.equal([1, 2, 3]);
            },
            error: (err) => {
                done(new Error('should not be called'));
            },
            complete: () => {
                done();
            },
        });
        send(1, 2, 3);
    });
    it('should not throw an exception calling toString on obj with a null prototype', (done) => {
        // NOTE: Can not test with Object.create(null) or `class Foo extends null`
        // due to TypeScript bug. https://github.com/Microsoft/TypeScript/issues/1108
        class NullProtoEventTarget {
            on() {
                /*noop*/
            }
            off() {
                /*noop*/
            }
        }
        NullProtoEventTarget.prototype.toString = null;
        const obj = new NullProtoEventTarget();
        expect(() => {
            fromEvent(obj, 'foo').subscribe();
            done();
        }).to.not.throw(TypeError);
    });
    it('should throw on subscription if one of the items in an ArrayLike is not a valid event target', (done) => {
        const nodeList = {
            [0]: {
                addEventListener() {
                    /* noop */
                },
                removeEventListener() {
                    /* noop */
                },
            },
            [1]: {
                addEventListener() {
                    /* noop */
                },
                removeEventListener() {
                    /* noop */
                },
            },
            [2]: {
                notAnEventTargetLOL: true,
            },
            [3]: {
                addEventListener() {
                    /* noop */
                },
                removeEventListener() {
                    /* noop */
                },
            },
            length: 4,
        };
        // @ts-expect-error We're testing this for the rebels that don't type check properly.
        const source = fromEvent(nodeList, 'cool-event-name-bro');
        source.subscribe({
            error: (err) => {
                expect(err).to.be.an.instanceOf(TypeError);
                expect(err.message).to.equal('Invalid event target');
                done();
            },
        });
    });
    it('should handle adding events to an arraylike of targets', () => {
        const nodeList = {
            [0]: {
                addEventListener(...args) {
                    this._addEventListenerArgs = args;
                },
                removeEventListener(...args) {
                    this._removeEventListenerArgs = args;
                },
                _addEventListenerArgs: null,
                _removeEventListenerArgs: null,
            },
            [1]: {
                addEventListener(...args) {
                    this._addEventListenerArgs = args;
                },
                removeEventListener(...args) {
                    this._removeEventListenerArgs = args;
                },
                _addEventListenerArgs: null,
                _removeEventListenerArgs: null,
            },
            length: 2,
        };
        const options = {};
        const subscription = fromEvent(nodeList, 'click', options).subscribe();
        expect(nodeList[0]._addEventListenerArgs[0]).to.equal('click');
        expect(nodeList[0]._addEventListenerArgs[1]).to.be.a('function');
        expect(nodeList[0]._addEventListenerArgs[2]).to.equal(options);
        expect(nodeList[1]._addEventListenerArgs[0]).to.equal('click');
        expect(nodeList[1]._addEventListenerArgs[1]).to.be.a('function');
        expect(nodeList[1]._addEventListenerArgs[2]).to.equal(options);
        expect(nodeList[0]._removeEventListenerArgs).to.be.null;
        expect(nodeList[1]._removeEventListenerArgs).to.be.null;
        subscription.unsubscribe();
        expect(nodeList[0]._removeEventListenerArgs).to.deep.equal(nodeList[0]._addEventListenerArgs);
        expect(nodeList[1]._removeEventListenerArgs).to.deep.equal(nodeList[1]._addEventListenerArgs);
    });
});
