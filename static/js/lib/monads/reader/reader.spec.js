import { reader } from './reader.factory';
describe('reader', function () {
    it('should of', function () {
        var greet = reader(function (ctx) { return ctx + '_HelloA'; });
        var greet2 = greet.of(function (ctx) { return ctx + '_HelloB'; });
        expect(greet.run('Test')).toEqual('Test_HelloA');
        expect(greet2.run('Test')).toEqual('Test_HelloB');
    });
    it('should map', function () {
        var greet = reader(function (ctx) { return ctx + '_HelloA'; });
        var greet2 = greet.map(function (s) { return s + '_Mapped123'; });
        expect(greet.run('Test')).toEqual('Test_HelloA');
        expect(greet2.run('Test')).toEqual('Test_HelloA_Mapped123');
    });
    it('should flatMap', function () {
        var greet = function (name) { return reader(function (ctx) { return ctx + ', ' + name; }); };
        var end = function (str) { return reader(function (a) { return a === 'Hello'; })
            .flatMap(function (isH) { return isH ? reader(function () { return str + '!!!'; }) : reader(function () { return str + '.'; }); }); };
        expect(greet('Tom').flatMap(end).run('Hello')).toEqual('Hello, Tom!!!');
        expect(greet('Jerry').flatMap(end).run('Hi')).toEqual('Hi, Jerry.');
    });
});
//# sourceMappingURL=reader.spec.js.map