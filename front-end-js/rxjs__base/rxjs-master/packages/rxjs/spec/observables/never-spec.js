/** @prettier */
import { NEVER } from 'rxjs';
import { expect } from 'chai';
import { TestScheduler } from 'rxjs/testing';
import { observableMatcher } from '../helpers/observableMatcher';
/** @test {NEVER} */
describe('NEVER', () => {
    let rxTestScheduler;
    beforeEach(() => {
        rxTestScheduler = new TestScheduler(observableMatcher);
    });
    it('should create a cold observable that never emits', () => {
        rxTestScheduler.run(({ expectObservable }) => {
            const expected = '-';
            const e1 = NEVER;
            expectObservable(e1).toBe(expected);
        });
    });
    it('should return the same instance every time', () => {
        expect(NEVER).to.equal(NEVER);
    });
});
