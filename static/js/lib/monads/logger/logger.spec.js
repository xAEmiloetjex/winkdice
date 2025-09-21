import { Logger } from './logger';
describe(Logger.name, function () {
    it('should construct', function () {
        var sut = new Logger([], '');
        expect(sut).toBeInstanceOf(Logger);
    });
    it('should flatMap', function () {
        var sut = new Logger(['starting with 100'], 100)
            .flatMap(function (b) { return new Logger(['adding 3'], b + 3); });
        expect(sut).toBeInstanceOf(Logger);
    });
    it('should tell', function () {
        Logger
            .tell('starting Logger')
            .flatMap(function (b) { return new Logger(["adding 3 to ".concat(b)], b + 3); })
            .flatMap(function (b) { return new Logger(["adding 3 to ".concat(b)], b + 3); })
            .runUsing(function (a) {
            expect(a.logs).toEqual([
                'starting Logger',
                'adding 3 to 0',
                'adding 3 to 3'
            ]);
            expect(a.value).toEqual(6);
        });
    });
    it('should tell', function () {
        Logger
            .tell('starting Logger')
            .of('ofed')
            .runUsing(function (a) {
            expect(a.logs).toEqual([]);
            expect(a.value).toEqual('ofed');
        });
    });
    it('should construt static', function () {
        var sut = Logger.logger(['starting with 100'], 100)
            .flatMap(function (b) { return new Logger(['adding 3'], b + 3); });
        expect(sut).toBeInstanceOf(Logger);
    });
    it('should todo...', function () {
        Logger
            .startWith('Starting calculation with value: 100', 100)
            .flatMap(function (b) { return new Logger(["adding 3 to ".concat(b)], b + 3); })
            .runUsing(function (a) {
            expect(a.logs).toEqual([
                'Starting calculation with value: 100',
                'adding 3 to 100'
            ]);
            expect(a.value).toEqual(103);
        });
    });
    it('should todo...', function () {
        Logger
            .startWith('Starting calculation with value: 100', 100)
            .flatMapPair(function (b) { return ["adding 3 to ".concat(b), b + 3]; })
            .runUsing(function (a) {
            expect(a.logs).toEqual([
                'Starting calculation with value: 100',
                'adding 3 to 100'
            ]);
            expect(a.value).toEqual(103);
        });
    });
});
//# sourceMappingURL=logger.spec.js.map