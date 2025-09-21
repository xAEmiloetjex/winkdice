import { fromEvent } from 'rxjs';
it('should support an event target source', () => {
    const source = eventTargetSource;
    const a = fromEvent(eventTargetSource, "click"); // $ExpectType Observable<Event>
});
it('should support an event target source result selector', () => {
    const a = fromEvent(eventTargetSource, "click", () => "clunk"); // $ExpectType Observable<string>
});
it('should support an event target source with options', () => {
    const a = fromEvent(eventTargetSource, "click", { once: true }); // $ExpectType Observable<Event>
});
it('should support an event target source with options and result selector', () => {
    const a = fromEvent(eventTargetSource, "click", { once: true }, () => "clunk"); // $ExpectType Observable<string>
});
it('should support a document source', () => {
    const source = documentSource;
    const a = fromEvent(documentSource, "click"); // $ExpectType Observable<Event>
});
it('should support a document source result selector', () => {
    const a = fromEvent(documentSource, "click", () => "clunk"); // $ExpectType Observable<string>
});
it('should support a document source with options', () => {
    const a = fromEvent(documentSource, "click", { once: true }); // $ExpectType Observable<Event>
});
it('should support a document source with options and result selector', () => {
    const a = fromEvent(documentSource, "click", { once: true }, () => "clunk"); // $ExpectType Observable<string>
});
it('should support a node-style source', () => {
    const source = nodeStyleSource;
    const a = fromEvent(nodeStyleSource, "exit"); // $ExpectType Observable<unknown>
    const b = fromEvent(nodeStyleSource, "exit"); // $ExpectType Observable<B>
});
it('should support a node-style source and symbol eventName', () => {
    const SYMBOL_EVENT = Symbol();
    const source = nodeStyleSource;
    const a = fromEvent(nodeStyleSource, SYMBOL_EVENT); // $ExpectType Observable<unknown>
    const b = fromEvent(nodeStyleSource, SYMBOL_EVENT); // $ExpectType Observable<B>
});
it('should deprecate explicit type parameters for a node-style source', () => {
    const source = nodeStyleSource;
    const a = fromEvent(nodeStyleSource, "exit"); // $ExpectNoDeprecation
    const b = fromEvent(nodeStyleSource, "exit"); // $ExpectDeprecation
});
it('should support a node-style source result selector', () => {
    const a = fromEvent(nodeStyleSource, "exit", () => "bye"); // $ExpectType Observable<string>
});
const nodeCompatibleSource = {
    addListener(eventName, handler) { },
    removeListener(eventName, handler) { }
};
it('should support a node-compatible source', () => {
    const source = nodeCompatibleSource;
    const a = fromEvent(nodeCompatibleSource, "something"); // $ExpectType Observable<unknown>
    const b = fromEvent(nodeCompatibleSource, "something"); // $ExpectType Observable<B>
});
it('should deprecate explicit type parameters for a node-compatible source', () => {
    const source = nodeCompatibleSource;
    const a = fromEvent(nodeCompatibleSource, "something"); // $ExpectNoDeprecation
    const b = fromEvent(nodeCompatibleSource, "something"); // $ExpectDeprecation
});
it('should support a node-compatible source result selector', () => {
    const a = fromEvent(nodeCompatibleSource, "something", () => "something else"); // $ExpectType Observable<string>
});
const jQueryStyleSource = {
    on(eventName, handler) { },
    off(eventName, handler) { }
};
it('should support a jQuery-style source', () => {
    const source = jQueryStyleSource;
    const a = fromEvent(jQueryStyleSource, "something"); // $ExpectType Observable<B>
    const b = fromEvent(jQueryStyleSource, "something"); // $ExpectType Observable<B>
});
it('should support a jQuery-style source result selector', () => {
    const a = fromEvent(jQueryStyleSource, "something", () => "something else"); // $ExpectType Observable<string>
});
