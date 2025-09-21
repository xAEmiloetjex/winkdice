export class Reader {
    fn;
    constructor(fn) {
        this.fn = fn;
    }
    of(fn) {
        return new Reader(fn);
    }
    flatMap(fn) {
        return new Reader(c => fn(this.run(c)).run(c));
    }
    map(fn) {
        return new Reader(c => fn(this.run(c)));
    }
    run(config) {
        return this.fn(config);
    }
}
