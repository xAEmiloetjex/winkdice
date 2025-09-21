import { either } from './either.factory';
describe(either.name, function () {
    it('when calling should throw if both sides are defined', function () {
        expect(function () {
            var leftInput = 'The String';
            var rightInput = 'The String';
            either(leftInput, rightInput);
        }).toThrowError(TypeError('Either cannot have both a left and a right'));
    });
    it('when calling should throw if no sides are defined', function () {
        expect(function () {
            var leftInput = undefined;
            var rightInput = undefined;
            either(leftInput, rightInput);
        }).toThrowError(TypeError('Either requires a left or a right'));
    });
    it('should be left', function () {
        var leftInput = 'tester';
        var rightInput = undefined;
        var eitherThing = either(leftInput, rightInput);
        expect(eitherThing.isLeft()).toBeTruthy();
        expect(eitherThing.isRight()).toBeFalsy();
    });
    it('should be right', function () {
        var leftInput = undefined;
        var rightInput = 'tester';
        var eitherThing = either(leftInput, rightInput);
        expect(eitherThing.isRight()).toBeTruthy();
        expect(eitherThing.isLeft()).toBeFalsy();
    });
    it('should map to match right side', function () {
        var leftInput = undefined;
        var rightInput = 'tester';
        var eitherThing = either(leftInput, rightInput);
        var mapped = eitherThing.match({
            left: function () { return '123'; },
            right: function (str) { return "".concat(str, "_right"); }
        });
        expect(mapped).toEqual('tester_right');
    });
    it('should map to match left side', function () {
        var leftInput = 123;
        var rightInput = undefined;
        var eitherThing = either(leftInput, rightInput);
        var mapped = eitherThing.match({
            left: function (num) { return "".concat(num, "_left"); },
            right: function (str) { return "".concat(str, "_right"); }
        });
        expect(mapped).toEqual('123_left');
    });
    it('should map right biased', function () {
        var input1 = 123;
        var input2 = undefined;
        var eitherThing = either(input2, input1);
        var eitherThing2 = either(input1, input2);
        var mapped = eitherThing
            .map(function (rightNum) { return rightNum + 12; })
            .match({
            left: function () { return 3; },
            right: function (num) { return num; }
        });
        expect(mapped).toEqual(135);
        var mapped2 = eitherThing2
            .map(function (rightNum) { return rightNum + 12; })
            .match({
            left: function () { return 3; },
            right: function (num) { return num; }
        });
        expect(mapped2).toEqual(3);
    });
    it('should flatMap', function () {
        var input1 = 123;
        var input2 = undefined;
        var eitherThing = either(input2, input1);
        var mapped = eitherThing
            .flatMap(function (rightNum) { return either(rightNum, input2); })
            .match({
            left: function () { return 3; },
            right: function (num) { return num; }
        });
        expect(mapped).toEqual(3);
    });
    it('should flatMap left', function () {
        var input1 = 123;
        var input2 = undefined;
        var eitherThing = either(input1, input2);
        var mapped = eitherThing
            .flatMap(function (rightNum) { return either(rightNum, input2); })
            .match({
            left: function () { return 3; },
            right: function (num) { return num; }
        });
        expect(mapped).toEqual(3);
    });
    it('should tap left', function () {
        expect.assertions(6);
        var input1 = 123;
        var input2 = undefined;
        var eitherThing = either(input1, input2);
        var mapped1 = eitherThing
            .tap({
            right: function () { return fail(); },
            left: function (leftSideEffect) {
                expect(leftSideEffect).toEqual(123);
            }
        });
        var mapped2 = eitherThing
            .tap({
            left: function (leftSideEffect) { return expect(leftSideEffect).toEqual(123); }
        });
        var mapped3 = eitherThing
            .tap({
            right: function () { return fail(); }
        });
        var mapped4 = eitherThing.tap({});
        expect(mapped1).toEqual(undefined);
        expect(mapped2).toEqual(undefined);
        expect(mapped3).toEqual(undefined);
        expect(mapped4).toEqual(undefined);
    });
    it('should tap right', function () {
        expect.assertions(6);
        var input1 = undefined;
        var input2 = 123;
        var eitherThing = either(input1, input2);
        var mapped1 = eitherThing
            .tap({
            left: function () { return fail(); },
            right: function (rightSideEffect) { return expect(rightSideEffect).toEqual(123); }
        });
        var mapped2 = eitherThing
            .tap({
            left: function () { return fail(); }
        });
        var mapped3 = eitherThing
            .tap({
            right: function (rightSideEffect) { return expect(rightSideEffect).toEqual(123); }
        });
        var mapped4 = eitherThing.tap({});
        expect(mapped1).toEqual(undefined);
        expect(mapped2).toEqual(undefined);
        expect(mapped3).toEqual(undefined);
        expect(mapped4).toEqual(undefined);
    });
});
//# sourceMappingURL=either.spec.js.map