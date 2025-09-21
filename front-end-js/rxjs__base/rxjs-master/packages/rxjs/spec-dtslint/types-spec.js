describe('ObservedValueOf', () => {
    it('should infer from an observable', () => {
        let explicit;
        const inferred = explicit; // $ExpectType A
    });
    it('should infer from an array', () => {
        let explicit;
        const inferred = explicit; // $ExpectType A
    });
    it('should infer from a promise', () => {
        let explicit;
        const inferred = explicit; // $ExpectType A
    });
});
describe('ObservedUnionFromArray', () => {
    it('should infer from an array of observables', () => {
        let explicit;
        const inferred = explicit; // $ExpectType A | B
    });
    it('should infer from an array of arrays', () => {
        let explicit;
        const inferred = explicit; // $ExpectType A | B
    });
    it('should infer from an array of promises', () => {
        let explicit;
        const inferred = explicit; // $ExpectType A | B
    });
});
describe('ObservedTupleFromArray', () => {
    it('should infer from an array of observables', () => {
        let explicit;
        const inferred = explicit; // $ExpectType [A, B]
    });
    it('should infer from an array of arrays', () => {
        let explicit;
        const inferred = explicit; // $ExpectType [A, B]
    });
    it('should infer from an array of promises', () => {
        let explicit;
        const inferred = explicit; // $ExpectType [A, B]
    });
});
describe('Cons', () => {
    it('should construct a tuple with the specified type at the head', () => {
        let explicit;
        const inferred = explicit; // $ExpectType [A, B, C]
    });
    it('should support rest tuples', () => {
        let explicit;
        const inferred = explicit; // $ExpectType [arg: A, ...rest: B[]]
    });
});
describe('Head', () => {
    it('should return the head of a tuple', () => {
        let explicit;
        const inferred = explicit; // $ExpectType A
    });
});
describe('Tail', () => {
    it('should return the tail of a tuple', () => {
        let explicit;
        const inferred = explicit; // $ExpectType [B, C]
    });
});
export {};
