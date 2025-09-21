/** @prettier */
import { expect } from 'chai';
import * as sinon from 'sinon';
import { bindCallback } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { observableMatcher } from '../helpers/observableMatcher';
/** @test {bindCallback} */
describe('bindCallback', () => {
    describe('when not scheduled', () => {
        it('should emit undefined from a callback without arguments', () => {
            function callback(cb) {
                cb();
            }
            const boundCallback = bindCallback(callback);
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
        it('should support a resultSelector', () => {
            function callback(datum, cb) {
                cb(datum);
            }
            const boundCallback = bindCallback(callback, (datum) => datum + 1);
            const results = [];
            boundCallback(42).subscribe({
                next(value) {
                    results.push(value);
                },
                complete() {
                    results.push('done');
                },
            });
            expect(results).to.deep.equal([43, 'done']);
        });
        it('should support a resultSelector if its void', () => {
            function callback(datum, cb) {
                cb(datum);
            }
            const boundCallback = bindCallback(callback, void 0);
            const results = [];
            boundCallback(42).subscribe({
                next(value) {
                    results.push(value);
                },
                complete() {
                    results.push('done');
                },
            });
            expect(results).to.deep.equal([42, 'done']);
        });
        it('should emit one value from a callback', () => {
            function callback(datum, cb) {
                cb(datum);
            }
            const boundCallback = bindCallback(callback);
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
        it('should set callback function context to context of returned function', () => {
            function callback(cb) {
                cb(this.datum);
            }
            const boundCallback = bindCallback(callback);
            const results = [];
            boundCallback.apply({ datum: 5 }).subscribe({ next: (x) => results.push(x), complete: () => results.push('done') });
            expect(results).to.deep.equal([5, 'done']);
        });
        it('should not emit, throw or complete if immediately unsubscribed', (done) => {
            const nextSpy = sinon.spy();
            const throwSpy = sinon.spy();
            const completeSpy = sinon.spy();
            let timeout;
            function callback(datum, cb) {
                // Need to cb async in order for the unsub to trigger
                timeout = setTimeout(() => {
                    cb(datum);
                }, 0);
            }
            const subscription = bindCallback(callback)(42).subscribe({ next: nextSpy, error: throwSpy, complete: completeSpy });
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
                cb(datum);
            }
            const boundCallback = bindCallback(callback);
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
        let rxTestScheduler;
        beforeEach(() => {
            rxTestScheduler = new TestScheduler(observableMatcher);
        });
        it('should emit undefined from a callback without arguments', () => {
            function callback(cb) {
                cb();
            }
            const boundCallback = bindCallback(callback, rxTestScheduler);
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
                cb(datum);
            }
            const boundCallback = bindCallback(callback, rxTestScheduler);
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
        it('should set callback function context to context of returned function', () => {
            function callback(cb) {
                cb(this.datum);
            }
            const boundCallback = bindCallback(callback, rxTestScheduler);
            const results = [];
            boundCallback.apply({ datum: 5 }).subscribe({ next: (x) => results.push(x), complete: () => results.push('done') });
            rxTestScheduler.flush();
            expect(results).to.deep.equal([5, 'done']);
        });
        it('should error if callback throws', () => {
            const expected = new Error('haha no callback for you');
            function callback(datum, cb) {
                throw expected;
            }
            const boundCallback = bindCallback(callback, rxTestScheduler);
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
        it('should pass multiple inner arguments as an array', () => {
            function callback(datum, cb) {
                cb(datum, 1, 2, 3);
            }
            const boundCallback = bindCallback(callback, rxTestScheduler);
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
                cb(datum);
            }
            const boundCallback = bindCallback(callback, rxTestScheduler);
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
        it('should not even call the callbackFn if scheduled and immediately unsubscribed', () => {
            let calls = 0;
            function callback(datum, cb) {
                calls++;
                cb(datum);
            }
            const boundCallback = bindCallback(callback, rxTestScheduler);
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
    it('should emit post-callback errors', () => {
        function badFunction(callback) {
            callback(42);
            throw 'kaboom';
        }
        let receivedError;
        bindCallback(badFunction)().subscribe({
            error: (err) => (receivedError = err),
        });
        expect(receivedError).to.equal('kaboom');
    });
});
