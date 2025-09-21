/** @prettier */
import { expect } from 'chai';
import * as sinon from 'sinon';
import { bindNodeCallback } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { observableMatcher } from '../helpers/observableMatcher';
/** @test {bindNodeCallback} */
describe('bindNodeCallback', () => {
    let rxTestScheduler;
    beforeEach(() => {
        rxTestScheduler = new TestScheduler(observableMatcher);
    });
    describe('when not scheduled', () => {
        it('should emit undefined when callback is called without success arguments', () => {
            function callback(cb) {
                cb(null);
            }
            const boundCallback = bindNodeCallback(callback);
            const results = [];
            boundCallback().subscribe({
                next: (x) => {
                    results.push(typeof x);
                },
                complete: () => {
                    results.push('done');
                },
            });
            expect(results).to.deep.equal(['undefined', 'done']);
        });
        it('should a resultSelector', () => {
            function callback(cb) {
                cb(null, 42);
            }
            const boundCallback = bindNodeCallback(callback, (x) => x + 1);
            const results = [];
            boundCallback().subscribe({
                next: (x) => {
                    results.push(x);
                },
                complete: () => {
                    results.push('done');
                },
            });
            expect(results).to.deep.equal([43, 'done']);
        });
        it('should emit one value from a callback', () => {
            function callback(datum, cb) {
                cb(null, datum);
            }
            const boundCallback = bindNodeCallback(callback);
            const results = [];
            boundCallback(42).subscribe({
                next: (x) => {
                    results.push(x);
                },
                complete: () => {
                    results.push('done');
                },
            });
            expect(results).to.deep.equal([42, 'done']);
        });
        it('should set context of callback to context of boundCallback', () => {
            function callback(cb) {
                cb(null, this.datum);
            }
            const boundCallback = bindNodeCallback(callback);
            const results = [];
            boundCallback.call({ datum: 42 }).subscribe({ next: (x) => results.push(x), complete: () => results.push('done') });
            expect(results).to.deep.equal([42, 'done']);
        });
        it('should raise error from callback', () => {
            const error = new Error();
            function callback(cb) {
                cb(error);
            }
            const boundCallback = bindNodeCallback(callback);
            const results = [];
            boundCallback().subscribe({
                next: () => {
                    throw new Error('should not next');
                },
                error: (err) => {
                    results.push(err);
                },
                complete: () => {
                    throw new Error('should not complete');
                },
            });
            expect(results).to.deep.equal([error]);
        });
        it('should not emit, throw or complete if immediately unsubscribed', (done) => {
            const nextSpy = sinon.spy();
            const throwSpy = sinon.spy();
            const completeSpy = sinon.spy();
            let timeout;
            function callback(datum, cb) {
                // Need to cb async in order for the unsub to trigger
                timeout = setTimeout(() => {
                    cb(null, datum);
                }, 0);
            }
            const subscription = bindNodeCallback(callback)(42).subscribe({ next: nextSpy, error: throwSpy, complete: completeSpy });
            subscription.unsubscribe();
            setTimeout(() => {
                expect(nextSpy).not.have.been.called;
                expect(throwSpy).not.have.been.called;
                expect(completeSpy).not.have.been.called;
                clearTimeout(timeout);
                done();
            });
        });
        it('should create a separate internal subject for each call', () => {
            function callback(datum, cb) {
                cb(null, datum);
            }
            const boundCallback = bindNodeCallback(callback);
            const results = [];
            boundCallback(42).subscribe({
                next: (x) => {
                    results.push(x);
                },
                complete: () => {
                    results.push('done');
                },
            });
            boundCallback(54).subscribe({
                next: (x) => {
                    results.push(x);
                },
                complete: () => {
                    results.push('done');
                },
            });
            expect(results).to.deep.equal([42, 'done', 54, 'done']);
        });
    });
    describe('when scheduled', () => {
        it('should emit undefined when callback is called without success arguments', () => {
            function callback(cb) {
                cb(null);
            }
            const boundCallback = bindNodeCallback(callback, rxTestScheduler);
            const results = [];
            boundCallback().subscribe({
                next: (x) => {
                    results.push(typeof x);
                },
                complete: () => {
                    results.push('done');
                },
            });
            rxTestScheduler.flush();
            expect(results).to.deep.equal(['undefined', 'done']);
        });
        it('should emit one value from a callback', () => {
            function callback(datum, cb) {
                cb(null, datum);
            }
            const boundCallback = bindNodeCallback(callback, rxTestScheduler);
            const results = [];
            boundCallback(42).subscribe({
                next: (x) => {
                    results.push(x);
                },
                complete: () => {
                    results.push('done');
                },
            });
            rxTestScheduler.flush();
            expect(results).to.deep.equal([42, 'done']);
        });
        it('should set context of callback to context of boundCallback', () => {
            function callback(cb) {
                cb(null, this.datum);
            }
            const boundCallback = bindNodeCallback(callback, rxTestScheduler);
            const results = [];
            boundCallback.call({ datum: 42 }).subscribe({ next: (x) => results.push(x), complete: () => results.push('done') });
            rxTestScheduler.flush();
            expect(results).to.deep.equal([42, 'done']);
        });
        it('should error if callback throws', () => {
            const expected = new Error('haha no callback for you');
            function callback(datum, cb) {
                throw expected;
            }
            const boundCallback = bindNodeCallback(callback, rxTestScheduler);
            boundCallback(42).subscribe({
                next: (x) => {
                    throw new Error('should not next');
                },
                error: (err) => {
                    expect(err).to.equal(expected);
                },
                complete: () => {
                    throw new Error('should not complete');
                },
            });
            rxTestScheduler.flush();
        });
        it('should raise error from callback', () => {
            const error = new Error();
            function callback(cb) {
                cb(error);
            }
            const boundCallback = bindNodeCallback(callback, rxTestScheduler);
            const results = [];
            boundCallback().subscribe({
                next: () => {
                    throw new Error('should not next');
                },
                error: (err) => {
                    results.push(err);
                },
                complete: () => {
                    throw new Error('should not complete');
                },
            });
            rxTestScheduler.flush();
            expect(results).to.deep.equal([error]);
        });
    });
    it('should pass multiple inner arguments as an array', () => {
        function callback(datum, cb) {
            cb(null, datum, 1, 2, 3);
        }
        const boundCallback = bindNodeCallback(callback, rxTestScheduler);
        const results = [];
        boundCallback(42).subscribe({
            next: (x) => {
                results.push(x);
            },
            complete: () => {
                results.push('done');
            },
        });
        rxTestScheduler.flush();
        expect(results).to.deep.equal([[42, 1, 2, 3], 'done']);
    });
    it('should cache value for next subscription and not call callbackFunc again', () => {
        let calls = 0;
        function callback(datum, cb) {
            calls++;
            cb(null, datum);
        }
        const boundCallback = bindNodeCallback(callback, rxTestScheduler);
        const results1 = [];
        const results2 = [];
        const source = boundCallback(42);
        source.subscribe({
            next: (x) => {
                results1.push(x);
            },
            complete: () => {
                results1.push('done');
            },
        });
        source.subscribe({
            next: (x) => {
                results2.push(x);
            },
            complete: () => {
                results2.push('done');
            },
        });
        rxTestScheduler.flush();
        expect(calls).to.equal(1);
        expect(results1).to.deep.equal([42, 'done']);
        expect(results2).to.deep.equal([42, 'done']);
    });
    it('should emit post callback errors', () => {
        function badFunction(callback) {
            callback(null, 42);
            throw 'kaboom';
        }
        let receivedError;
        bindNodeCallback(badFunction)().subscribe({
            error: (err) => (receivedError = err),
        });
        expect(receivedError).to.equal('kaboom');
    });
    it('should not call the function if subscribed twice in a row before it resolves', () => {
        let executeCallback;
        let calls = 0;
        function myFunc(callback) {
            calls++;
            if (calls > 1) {
                throw new Error('too many calls to myFunc');
            }
            executeCallback = callback;
        }
        const source$ = bindNodeCallback(myFunc)();
        let result1;
        let result2;
        source$.subscribe((value) => (result1 = value));
        source$.subscribe((value) => (result2 = value));
        expect(calls).to.equal(1);
        executeCallback(null, 'test');
        expect(result1).to.equal('test');
        expect(result2).to.equal('test');
        expect(calls).to.equal(1);
    });
    it('should not even call the callbackFn if scheduled and immediately unsubscribed', () => {
        let calls = 0;
        function callback(datum, cb) {
            calls++;
            cb(null, datum);
        }
        const boundCallback = bindNodeCallback(callback, rxTestScheduler);
        const results1 = [];
        const source = boundCallback(42);
        const subscription = source.subscribe({
            next: (x) => {
                results1.push(x);
            },
            complete: () => {
                results1.push('done');
            },
        });
        subscription.unsubscribe();
        rxTestScheduler.flush();
        expect(calls).to.equal(0);
    });
});
