import { fromFetch } from 'rxjs/fetch';
import { expect } from 'chai';
const root = (typeof globalThis !== 'undefined' && globalThis)
    || (typeof self !== 'undefined' && self)
    || global;
const OK_RESPONSE = {
    ok: true,
};
function mockFetchImpl(input, init) {
    mockFetchImpl.calls.push({ input, init });
    return new Promise((resolve, reject) => {
        if (init) {
            if (init.signal) {
                if (init.signal.aborted) {
                    reject(new MockDOMException());
                    return;
                }
                init.signal.addEventListener('abort', () => {
                    reject(new MockDOMException());
                });
            }
        }
        Promise.resolve(null).then(() => {
            resolve(mockFetchImpl.respondWith);
        });
    });
}
mockFetchImpl.reset = function () {
    this.calls = [];
    this.respondWith = OK_RESPONSE;
};
mockFetchImpl.reset();
const mockFetch = mockFetchImpl;
class MockDOMException {
}
class MockAbortController {
    signal = new MockAbortSignal();
    abort() {
        this.signal._signal();
    }
    constructor() {
        MockAbortController.created++;
    }
    static created = 0;
    static reset() {
        MockAbortController.created = 0;
    }
}
class MockAbortSignal {
    _listeners = [];
    aborted = false;
    addEventListener(name, handler) {
        this._listeners.push(handler);
    }
    removeEventListener(name, handler) {
        const index = this._listeners.indexOf(handler);
        if (index >= 0) {
            this._listeners.splice(index, 1);
        }
    }
    _signal() {
        this.aborted = true;
        while (this._listeners.length > 0) {
            this._listeners.shift()();
        }
    }
}
describe('fromFetch', () => {
    let _fetch;
    let _AbortController;
    beforeEach(() => {
        mockFetch.reset();
        if (root.fetch) {
            _fetch = root.fetch;
        }
        root.fetch = mockFetch;
        MockAbortController.reset();
        if (root.AbortController) {
            _AbortController = root.AbortController;
        }
        root.AbortController = MockAbortController;
    });
    afterEach(() => {
        root.fetch = _fetch;
        root.AbortController = _AbortController;
    });
    it('should exist', () => {
        expect(fromFetch).to.be.a('function');
    });
    it('should fetch', (done) => {
        const fetch$ = fromFetch('/foo');
        expect(mockFetch.calls.length).to.equal(0);
        expect(MockAbortController.created).to.equal(0);
        fetch$.subscribe({
            next: response => {
                expect(response).to.equal(OK_RESPONSE);
            },
            error: done,
            complete: () => {
                // Wait until the complete and the subsequent unsubscribe are finished
                // before testing these expectations:
                setTimeout(() => {
                    expect(MockAbortController.created).to.equal(1);
                    expect(mockFetch.calls.length).to.equal(1);
                    expect(mockFetch.calls[0].input).to.equal('/foo');
                    expect(mockFetch.calls[0].init.signal).not.to.be.undefined;
                    expect(mockFetch.calls[0].init.signal.aborted).to.be.false;
                    done();
                }, 0);
            }
        });
    });
    it('should handle Response that is not `ok`', (done) => {
        mockFetch.respondWith = {
            ok: false,
            status: 400,
            body: 'Bad stuff here'
        };
        const fetch$ = fromFetch('/foo');
        expect(mockFetch.calls.length).to.equal(0);
        expect(MockAbortController.created).to.equal(0);
        fetch$.subscribe({
            next: response => {
                expect(response).to.equal(mockFetch.respondWith);
            },
            complete: done,
            error: done
        });
        expect(MockAbortController.created).to.equal(1);
        expect(mockFetch.calls.length).to.equal(1);
        expect(mockFetch.calls[0].input).to.equal('/foo');
        expect(mockFetch.calls[0].init.signal).not.to.be.undefined;
        expect(mockFetch.calls[0].init.signal.aborted).to.be.false;
    });
    it('should abort when unsubscribed', () => {
        const fetch$ = fromFetch('/foo');
        expect(mockFetch.calls.length).to.equal(0);
        expect(MockAbortController.created).to.equal(0);
        const subscription = fetch$.subscribe();
        expect(MockAbortController.created).to.equal(1);
        expect(mockFetch.calls.length).to.equal(1);
        expect(mockFetch.calls[0].input).to.equal('/foo');
        expect(mockFetch.calls[0].init.signal).not.to.be.undefined;
        expect(mockFetch.calls[0].init.signal.aborted).to.be.false;
        subscription.unsubscribe();
        expect(mockFetch.calls[0].init.signal.aborted).to.be.true;
    });
    it('should not immediately abort repeat subscribers', () => {
        const fetch$ = fromFetch('/foo');
        expect(mockFetch.calls.length).to.equal(0);
        expect(MockAbortController.created).to.equal(0);
        let subscription = fetch$.subscribe();
        expect(MockAbortController.created).to.equal(1);
        expect(mockFetch.calls[0].init.signal.aborted).to.be.false;
        subscription.unsubscribe();
        expect(mockFetch.calls[0].init.signal.aborted).to.be.true;
        subscription = fetch$.subscribe();
        expect(MockAbortController.created).to.equal(2);
        expect(mockFetch.calls[1].init.signal.aborted).to.be.false;
        subscription.unsubscribe();
        expect(mockFetch.calls[1].init.signal.aborted).to.be.true;
    });
    it('should allow passing of init object', (done) => {
        const fetch$ = fromFetch('/foo', { method: 'HEAD' });
        fetch$.subscribe({
            error: done,
            complete: done,
        });
        expect(mockFetch.calls[0].init.method).to.equal('HEAD');
    });
    it('should add a signal to internal init object without mutating the passed init object', (done) => {
        const myInit = { method: 'DELETE' };
        const fetch$ = fromFetch('/bar', myInit);
        fetch$.subscribe({
            error: done,
            complete: done,
        });
        expect(mockFetch.calls[0].init.method).to.equal(myInit.method);
        expect(mockFetch.calls[0].init).not.to.equal(myInit);
        expect(mockFetch.calls[0].init.signal).not.to.be.undefined;
    });
    it('should treat passed signals as a cancellation token which triggers an error', (done) => {
        const controller = new MockAbortController();
        const signal = controller.signal;
        const fetch$ = fromFetch('/foo', { signal });
        const subscription = fetch$.subscribe({
            error: err => {
                expect(err).to.be.instanceof(MockDOMException);
                done();
            }
        });
        controller.abort();
        expect(mockFetch.calls[0].init.signal.aborted).to.be.true;
        // The subscription will not be closed until the error fires when the promise resolves.
        expect(subscription.closed).to.be.false;
    });
    it('should treat passed already aborted signals as a cancellation token which triggers an error', (done) => {
        const controller = new MockAbortController();
        controller.abort();
        const signal = controller.signal;
        const fetch$ = fromFetch('/foo', { signal });
        const subscription = fetch$.subscribe({
            error: err => {
                expect(err).to.be.instanceof(MockDOMException);
                done();
            }
        });
        expect(mockFetch.calls[0].init.signal.aborted).to.be.true;
        // The subscription will not be closed until the error fires when the promise resolves.
        expect(subscription.closed).to.be.false;
    });
    it('should not leak listeners added to the passed in signal', (done) => {
        const controller = new MockAbortController();
        const signal = controller.signal;
        const fetch$ = fromFetch('/foo', { signal });
        const subscription = fetch$.subscribe();
        subscription.add(() => {
            try {
                expect(signal._listeners).to.be.empty;
                done();
            }
            catch (error) {
                done(error);
            }
        });
    });
    it('should support a selector', (done) => {
        mockFetch.respondWith = {
            ...OK_RESPONSE,
            text: () => Promise.resolve('bar')
        };
        const fetch$ = fromFetch('/foo', {
            selector: response => response.text()
        });
        expect(mockFetch.calls.length).to.equal(0);
        expect(MockAbortController.created).to.equal(0);
        fetch$.subscribe({
            next: text => {
                expect(text).to.equal('bar');
            },
            error: done,
            complete: () => {
                // Wait until the complete and the subsequent unsubscribe are finished
                // before testing these expectations:
                setTimeout(() => {
                    expect(MockAbortController.created).to.equal(1);
                    expect(mockFetch.calls.length).to.equal(1);
                    expect(mockFetch.calls[0].input).to.equal('/foo');
                    expect(mockFetch.calls[0].init.signal).not.to.be.undefined;
                    expect(mockFetch.calls[0].init.signal.aborted).to.be.false;
                    done();
                }, 0);
            }
        });
    });
    it('should abort when unsubscribed and a selector is specified', () => {
        mockFetch.respondWith = {
            ...OK_RESPONSE,
            text: () => Promise.resolve('bar')
        };
        const fetch$ = fromFetch('/foo', {
            selector: response => response.text()
        });
        expect(mockFetch.calls.length).to.equal(0);
        expect(MockAbortController.created).to.equal(0);
        const subscription = fetch$.subscribe();
        expect(MockAbortController.created).to.equal(1);
        expect(mockFetch.calls.length).to.equal(1);
        expect(mockFetch.calls[0].input).to.equal('/foo');
        expect(mockFetch.calls[0].init.signal).not.to.be.undefined;
        expect(mockFetch.calls[0].init.signal.aborted).to.be.false;
        subscription.unsubscribe();
        expect(mockFetch.calls[0].init.signal.aborted).to.be.true;
    });
});
