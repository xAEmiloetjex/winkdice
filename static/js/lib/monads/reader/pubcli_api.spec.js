import { reader, Reader } from './public_api';
describe('result api', function () {
    it('should export', function () {
        expect(reader(function () { return 1; })).toBeInstanceOf(Reader);
    });
});
//# sourceMappingURL=pubcli_api.spec.js.map