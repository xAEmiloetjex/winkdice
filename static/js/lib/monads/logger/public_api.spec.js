import { Logger } from './public_api';
describe('logger api', function () {
    it('should export', function () {
        expect(new Logger([], 'valie')).toBeInstanceOf(Logger);
    });
});
//# sourceMappingURL=public_api.spec.js.map