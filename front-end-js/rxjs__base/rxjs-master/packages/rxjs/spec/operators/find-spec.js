import { expect } from 'chai';
import { find, mergeMap, delay } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { observableMatcher } from '../helpers/observableMatcher';
import { of, Observable, from } from 'rxjs';
/** @test {find} */
describe('find', () => {
    let testScheduler;
    beforeEach(() => {
        testScheduler = new TestScheduler(observableMatcher);
    });
    function truePredicate(x) {
        return true;
    }
    it('should return matching element from source emits single element', () => {
        testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
            const values = { a: 3, b: 9, c: 15, d: 20 };
            const e1 = hot('  ---a--b--c--d---|', values);
            const e1subs = '  ^--------!       ';
            const expected = '---------(c|)    ';
            const predicate = function (x) {
                return x % 5 === 0;
            };
            expectObservable(e1.pipe(find(predicate))).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should not emit if source does not emit', () => {
        testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
            const e1 = hot('  -');
            const e1subs = '  ^';
            const expected = '-';
            expectObservable(e1.pipe(find(truePredicate))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should return undefined if source is empty to match predicate', () => {
        testScheduler.run(({ cold, expectObservable, expectSubscriptions }) => {
            const e1 = cold(' |   ');
            const e1subs = '  (^!)';
            const expected = '(x|)';
            const result = e1.pipe(find(truePredicate));
            expectObservable(result).toBe(expected, { x: undefined });
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should return matching element from source emits single element', () => {
        testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
            const e1 = hot('  --a--|');
            const e1subs = '  ^-!   ';
            const expected = '--(a|)';
            const predicate = function (value) {
                return value === 'a';
            };
            expectObservable(e1.pipe(find(predicate))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should return matching element from source emits multiple elements', () => {
        testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
            const e1 = hot('  --a--b---c-|');
            const e1subs = '  ^----!      ';
            const expected = '-----(b|)   ';
            const predicate = function (value) {
                return value === 'b';
            };
            expectObservable(e1.pipe(find(predicate))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should return undefined if element does not match with predicate', () => {
        testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
            const e1 = hot('  --a--b--c--|   ');
            const e1subs = '  ^----------!   ';
            const expected = '-----------(x|)';
            const predicate = function (value) {
                return value === 'z';
            };
            expectObservable(e1.pipe(find(predicate))).toBe(expected, { x: undefined });
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should allow unsubscribing early and explicitly', () => {
        testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
            const e1 = hot('  --a--b--c--|');
            const e1subs = '  ^-----!     ';
            const expected = '-------     ';
            const unsub = '   ------!     ';
            const result = e1.pipe(find((value) => value === 'z'));
            expectObservable(result, unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', () => {
        testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
            const e1 = hot('  --a--b--c--|');
            const e1subs = '  ^-----!     ';
            const expected = '-------     ';
            const unsub = '   ------!     ';
            const result = e1.pipe(mergeMap((x) => of(x)), find((value) => value === 'z'), mergeMap((x) => of(x)));
            expectObservable(result, unsub).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should unsubscribe when the predicate is matched', () => {
        testScheduler.run(({ hot, time, expectObservable, expectSubscriptions }) => {
            const e1 = hot('  --a--b---c-|');
            const e1subs = '  ^----!      ';
            const t = time('    --|       ');
            //                     --|
            const expected = '-------(b|) ';
            const result = e1.pipe(find((value) => value === 'b'), delay(t));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should raise if source raise error while element does not match with predicate', () => {
        testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
            const e1 = hot('  --a--b--#');
            const e1subs = '  ^-------!';
            const expected = '--------#';
            const predicate = function (value) {
                return value === 'z';
            };
            expectObservable(e1.pipe(find(predicate))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should raise error if predicate throws error', () => {
        testScheduler.run(({ hot, expectObservable, expectSubscriptions }) => {
            const e1 = hot('  --a--b--c--|');
            const e1subs = '  ^-!         ';
            const expected = '--#         ';
            const predicate = function (value) {
                throw 'error';
            };
            expectObservable(e1.pipe(find(predicate))).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
    });
    it('should support type guards without breaking previous behavior', () => {
        // type guards with interfaces and classes
        {
            class Foo {
                bar;
                baz;
                constructor(bar = 'name', baz = 42) {
                    this.bar = bar;
                    this.baz = baz;
                }
            }
            const isBar = (x) => x && x.bar !== undefined;
            const isBaz = (x) => x && x.baz !== undefined;
            const foo = new Foo();
            of(foo)
                .pipe(find((foo) => foo.baz === 42))
                .subscribe((x) => x.baz); // x is still Foo
            of(foo)
                .pipe(find(isBar))
                .subscribe((x) => x.bar); // x is Bar!
            const foobar = new Foo(); // type is interface, not the class
            of(foobar)
                .pipe(find((foobar) => foobar.bar === 'name'))
                .subscribe((x) => x.bar); // <-- x is still Bar
            of(foobar)
                .pipe(find(isBar))
                .subscribe((x) => x.bar); // <--- x is Bar!
            const barish = { bar: 'quack', baz: 42 }; // type can quack like a Bar
            of(barish)
                .pipe(find((x) => x.bar === 'quack'))
                .subscribe((x) => x.bar); // x is still { bar: string; baz: number; }
            of(barish)
                .pipe(find(isBar))
                .subscribe((bar) => bar.bar); // x is Bar!
        }
        // type guards with primitive types
        {
            const xs = from([1, 'aaa', 3, 'bb']);
            // This type guard will narrow a `string | number` to a string in the examples below
            const isString = (x) => typeof x === 'string';
            xs.pipe(find(isString)).subscribe((s) => s.length); // s is string
            // In contrast, this type of regular boolean predicate still maintains the original type
            xs.pipe(find((x) => typeof x === 'number')).subscribe((x) => x); // x is still string | number
            xs.pipe(find((x, i) => typeof x === 'number' && x > i)).subscribe((x) => x); // x is still string | number
        }
    });
    it('should stop listening to a synchronous observable when unsubscribed', () => {
        const sideEffects = [];
        const synchronousObservable = new Observable((subscriber) => {
            // This will check to see if the subscriber was closed on each loop
            // when the unsubscribe hits, it should be closed
            for (let i = 0; !subscriber.closed && i < 10; i++) {
                sideEffects.push(i);
                subscriber.next(i);
            }
        });
        synchronousObservable.pipe(find((value) => value === 2)).subscribe(() => {
            /* noop */
        });
        expect(sideEffects).to.deep.equal([0, 1, 2]);
    });
});
