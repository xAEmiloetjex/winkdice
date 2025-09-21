import { expect } from 'chai';
import { Observable, of, Subscriber } from 'rxjs';
import { asInteropObservable, asInteropSubscriber } from './interop-helper';
describe('interop helper', () => {
    it('should simulate interop observables', () => {
        const observable = asInteropObservable(of(42));
        expect(observable).to.not.be.instanceOf(Observable);
        expect(observable[Symbol.observable ?? '@@observable']).to.be.a('function');
    });
    it('should simulate interop subscribers', () => {
        const subscriber = asInteropSubscriber(new Subscriber());
        expect(subscriber).to.not.be.instanceOf(Subscriber);
    });
});
