export class StatePair {
    state;
    value;
    constructor(state, value) {
        this.state = state;
        this.value = value;
    }
}
export class State {
    fn;
    constructor(fn) {
        this.fn = fn;
    }
    of(fn) {
        return new State(fn);
    }
    map(fn) {
        return new State(c => fn(this.run(c)));
    }
    flatMap(fn) {
        return new State(c => {
            const pair = fn(this.run(c)).run(c);
            return [pair.state, pair.value];
        });
    }
    run(config) {
        const tupple = this.fn(config);
        return new StatePair(tupple[0], tupple[1]);
    }
}
