var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { List } from './list';
import { listFrom } from './list.factory';
var Animal = /** @class */ (function () {
    function Animal(name, nickname) {
        this.name = name;
        this.nickname = nickname;
    }
    return Animal;
}());
var Dog = /** @class */ (function (_super) {
    __extends(Dog, _super);
    function Dog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Dog;
}(Animal));
var Cat = /** @class */ (function (_super) {
    __extends(Cat, _super);
    function Cat() {
        var _this = _super.apply(this, __spreadArray([], __read(arguments), false)) || this;
        _this.likesCatnip = true;
        return _this;
    }
    return Cat;
}(Animal));
describe(List.name, function () {
    describe('Integers', function () {
        it('should', function () {
            var sut = List
                .integers()
                .headOrUndefined();
            expect(sut).toEqual(0);
        });
    });
    describe('Range', function () {
        it('should support stepping', function () {
            var sut = List.range(4, 10, 2);
            expect(sut.toArray()).toEqual([4, 6, 8, 10]);
        });
    });
    describe('Empty', function () {
        it('should', function () {
            var sut = List.empty().toArray();
            expect(sut.length).toEqual(0);
        });
    });
    it('should spread to array', function () {
        var sut = List.of(1, 2, 6, 10).toArray();
        expect(sut).toEqual([1, 2, 6, 10]);
    });
    it('should toIterable', function () {
        var sut = List.of(1, 2, 6, 10).toIterable();
        expect(sut).toEqual([1, 2, 6, 10]);
    });
    it('sdasd', function () {
        var sut = List.from([1, 6]).toArray();
        expect(sut).toEqual([1, 6]);
    });
    describe('should get head', function () {
        it('should ...', function () {
            var sut = List.from([1, 6]);
            expect(sut.headOr(0)).toEqual(1);
            expect(sut.headOr(3)).toEqual(1);
        });
        it('should ...', function () {
            var sut = List.from([]).headOr(0);
            expect(sut).toEqual(0);
        });
        it('should ...', function () {
            var sut = List.from([1]).headOr(0);
            expect(sut).toEqual(1);
        });
        it('should headOrUndefined', function () {
            var sut1 = List.from([1]).headOrUndefined();
            var sut2 = List.from([]).headOrUndefined();
            expect(sut1).toEqual(1);
            expect(sut2).toBeUndefined();
        });
        it('should headOrCompute', function () {
            var sut = List.from([]).headOrCompute(function () { return 67; });
            expect(sut).toEqual(67);
        });
        it('should headOrThrow', function () {
            expect(function () {
                List.from([]).headOrThrow('errrr');
            }).toThrowError('errrr');
        });
    });
    it('should range', function () {
        var sut = List.range(2, 5).toArray();
        expect(sut).toEqual([2, 3, 4, 5]);
    });
    describe('should map', function () {
        it('should ...', function () {
            var sut = List.of(1, 2, 5)
                .map(function (x) { return x + 3; })
                .toArray();
            expect(sut).toEqual([4, 5, 8]);
        });
    });
    describe('should scan', function () {
        it('should ...', function () {
            var sut = List.from([1, 2, 3, 4])
                .scan(function (acc, curr) { return curr + acc; }, 0)
                .toArray();
            expect(sut).toEqual([1, 3, 6, 10]);
        });
    });
    describe('should reduce', function () {
        it('should ...', function () {
            var sut = List.of(1, 2, 3, 4).reduce(function (acc, curr) { return acc + curr; }, 0);
            expect(sut).toEqual(10);
        });
    });
    describe('should filter', function () {
        it('should ...', function () {
            var sut = List.of(1, 2, 5)
                .filter(function (x) { return x > 2; })
                .toArray();
            expect(sut).toEqual([5]);
        });
        it('should alias where to filter', function () {
            var sut = List.of(1, 2, 5)
                .where(function (x) { return x > 2; })
                .toArray();
            expect(sut).toEqual([5]);
        });
    });
    it('should join arrays', function () {
        var sut = List.of(1)
            .concat(2)
            .concat(3)
            .concat(4, 5)
            .concat([6, 7])
            .concat([8, 9], [10, 11])
            .toArray();
        expect(sut).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    });
    describe('should all', function () {
        it('should', function () {
            var sut = List.of('test 1', 'test 2', 'test 3');
            expect(sut.all(function (a) { return a.includes('test'); })).toEqual(true);
        });
        it('should', function () {
            var sut = List.of('test 1', 'UGH!', 'test 2', 'test 3');
            expect(sut.all(function (a) { return a.includes('test'); })).toEqual(false);
        });
    });
    describe('should any', function () {
        it('should', function () {
            var sut = List.of('test 1', 'test 2', 'test 3');
            expect(sut.any(function (a) { return a.includes('test'); })).toEqual(true);
            expect(sut.some(function (a) { return a.includes('test'); })).toEqual(true);
        });
        it('should', function () {
            var sut = List.of('test 1', 'UGH!', 'test 2', 'test 3');
            expect(sut.any(function (a) { return a.includes('NOTHERE'); })).toEqual(false);
            expect(sut.some(function (a) { return a.includes('NOTHERE'); })).toEqual(false);
        });
    });
    describe('take', function () {
        it('should ...', function () {
            var sut = List.of(1, 2, 3);
            expect(sut.take(3).toArray()).toEqual([1, 2, 3]);
            expect(sut.take(2).toArray()).toEqual([1, 2]);
            expect(sut.take(1).toArray()).toEqual([1]);
            expect(sut.take(0).toArray()).toEqual([]);
        });
    });
    describe('InstanceOf', function () {
        it('should filter on instance', function () {
            var dog = new Dog('Rex');
            var cat = new Cat('Meow');
            var sut = List.of(dog, cat);
            expect(sut.ofType(Cat).toArray().length).toEqual(1);
            expect(sut.ofType(Cat).toArray()).toEqual([cat]);
            expect(sut.ofType(Dog).toArray().length).toEqual(1);
            expect(sut.ofType(Dog).toArray()).toEqual([dog]);
        });
    });
    describe('Drop', function () {
        it('should', function () {
            var sut = List.of(1, 5, 10, 15, 20).drop(1).drop(1).toArray();
            var sut2 = listFrom(sut).drop(2).toArray();
            var sut3 = listFrom(sut2).tail().toArray();
            expect(sut).toEqual([10, 15, 20]);
            expect(sut2).toEqual([20]);
            expect(sut3).toEqual([]);
        });
    });
    describe('ToDictionary', function () {
        var Rex = new Dog('Rex', 'Rdawg');
        var Meow = new Cat('Meow');
        var sut = List.of(Rex, Meow);
        it('should handle nominal keyed case', function () {
            expect(sut.toDictionary('name')).toEqual({ Rex: Rex, Meow: Meow });
        });
        it('should handle unkeyed', function () {
            expect(sut.toDictionary()).toEqual({ 0: Rex, 1: Meow });
        });
        it('should handle missing keys', function () {
            expect(sut.toDictionary('nickname')).toEqual({ Rdawg: Rex });
        });
    });
    describe('sum', function () {
        it('should sum the list', function () {
            var sut = List.of(3, 20, 10);
            var sut2 = List.of('how sume this?', 'no way');
            expect(sut.sum()).toEqual(33);
            expect(sut2.sum()).toEqual(0);
        });
    });
    // describe('OrderBy', () => {
    //   it('should order by object', () => {
    //     const dog1 = new Dog('Atlas')
    //     const dog2 = new Dog('Zues')
    //     const sut = List.of<Dog>(dog1, dog2)
    //     expect(sut.orderBy('dogtag').toEqual([]))
    //     expect(sut.orderBy('name')).toEqual([])
    //   })
    //   it('should order by number', () => {
    //     const sut = List.of(1, 2, 5, 3, 12)
    //     expect(sut.orderBy().toEqual([]))
    //     expect(sut.orderBy()).toEqual([])
    //   })
    //   it('should order by string', () => {
    //     const sut = List.of('abc', 'efg', 'zel', 'lmao')
    //     expect(sut.orderBy().toEqual([]))
    //     expect(sut.orderBy()).toEqual([])
    //   })
    // })
});
//# sourceMappingURL=list.spec.js.map