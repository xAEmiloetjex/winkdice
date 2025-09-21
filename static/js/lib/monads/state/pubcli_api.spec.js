import { State } from './public_api';
describe('state api', function () {
    it('should export', function () {
        expect(new State(function (a) { return [a, '']; })).toBeInstanceOf(State);
    });
});
//# sourceMappingURL=pubcli_api.spec.js.map