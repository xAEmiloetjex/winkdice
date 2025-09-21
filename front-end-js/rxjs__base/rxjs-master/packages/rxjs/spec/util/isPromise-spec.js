import { of } from 'rxjs';
import { expect } from 'chai';
import { isPromise } from '@rxjs/observable';
describe('isPromise', () => {
    it('should return true for new Promise', () => {
        const o = new Promise(() => null);
        expect(isPromise(o)).to.be.true;
    });
    it('should NOT return true for any Observable', () => {
        const o = of(null);
        expect(isPromise(o)).to.be.false;
    });
    it('should return false for null', () => {
        expect(isPromise(null)).to.be.false;
    });
    it('should return false for undefined', () => {
        expect(isPromise(undefined)).to.be.false;
    });
    it('should return false for a number', () => {
        expect(isPromise(1)).to.be.false;
    });
    it('should return false for a string', () => {
        expect(isPromise('1')).to.be.false;
    });
});
