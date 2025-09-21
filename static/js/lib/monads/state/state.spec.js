import { State } from './state';
describe(State.name, function () {
    it('should construct', function () {
        var sut = new State(function (state) { return [state, state + '_test']; })
            .run('starting state');
        expect(sut.state).toEqual('starting state');
        expect(sut.value).toEqual('starting state_test');
    });
    it('should of', function () {
        var sut = new State(function (state) { return [state, state + '_test']; })
            .of(function (state) { return [state, 'other']; })
            .run('starting state');
        expect(sut.state).toEqual('starting state');
        expect(sut.value).toEqual('other');
    });
    it('should map', function () {
        var sut = new State(function (state) { return [state, state + '_phase1_']; })
            .map(function (pair) { return [pair.state + '_ran_x1_3', 3]; })
            .run('start_str');
        expect(sut.state).toEqual('start_str_ran_x1_3');
        expect(sut.value).toEqual(3);
    });
    it('should flat map', function () {
        var sut = new State(function (state) { return [state, 'v1']; })
            .flatMap(function (pair) { return new State(function (state) { return [pair.state + state, pair.value]; }); })
            .run('start');
        expect(sut.state).toEqual('startstart');
        expect(sut.value).toEqual('v1');
    });
});
//# sourceMappingURL=state.spec.js.map