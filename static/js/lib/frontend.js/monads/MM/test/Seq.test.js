/**
 * Author: Bruno Grieder
 */
require('source-map-support').install();
import { seq } from '../Seq';
import { none, option, some } from '../Option';
const deepEqual = chai.assert.deepEqual;
const iter = {
    [Symbol.iterator]: () => {
        let count = -1;
        //noinspection JSUnusedGlobalSymbols
        return {
            next: () => {
                count = count + 1;
                return {
                    done: count == 10,
                    value: count
                };
            }
        };
    }
};
const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
describe('Seq', function () {
    before((done) => {
        done();
    });
    after((done) => {
        done();
    });
    // beforeEach( TestsSetup._beforeEach )
    // afterEach( TestsSetup._afterEach )
    it('collect', (done) => {
        const a1 = seq([1, 2, 3, 4, 5, 6]);
        deepEqual(a1.collect(v => v % 2 === 0)(v => v * 2).toArray, [4, 8, 12], "collect failed");
        deepEqual(seq(iter).collect(v => v % 2 === 0)(v => v * 2).toArray, [0, 4, 8, 12, 16], "collect failed");
        done();
    });
    it('collectFirst', (done) => {
        deepEqual(seq(arr).collectFirst(x => x === 3)(x => x * 2).equals(some(6)), true, "collectFirst failed");
        deepEqual(seq(arr).collectFirst(x => x === 13)(x => x * 2).equals(none()), true, "collectFirst failed");
        deepEqual(seq(iter).collectFirst(x => x === 3)(x => x * 2).equals(some(6)), true, "collectFirst failed");
        deepEqual(seq(iter).collectFirst(x => x === 13)(x => x * 2).equals(none()), true, "collectFirst failed");
        done();
    });
    it('concat', (done) => {
        const a1 = seq([1, 2, 3]);
        const a2 = seq([4, 5, 6]);
        const a3 = a1.concat(a2);
        deepEqual(a3.toArray, [1, 2, 3, 4, 5, 6], "concat failed");
        deepEqual(seq(iter).concat(seq(iter)).toArray, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "concat failed");
        done();
    });
    it('contains', (done) => {
        deepEqual(seq(arr).contains(2), true, "contains failed");
        deepEqual(seq(arr).contains(10), false, "contains failed");
        deepEqual(seq(iter).contains(2), true, "contains failed");
        deepEqual(seq(iter).contains(10), false, "contains failed");
        done();
    });
    it('count', (done) => {
        deepEqual(seq(arr).count(v => v % 2 === 0), 5, "count failed");
        deepEqual(seq(iter).count(v => v % 2 === 0), 5, "count failed");
        done();
    });
    it('drop', (done) => {
        deepEqual(seq(arr).drop(3).head, 3, "drop failed");
        deepEqual(seq(arr).drop(3).size, 7, "drop failed");
        deepEqual(seq(arr).drop(50).size, 0, "drop failed");
        deepEqual(seq(iter).drop(3).head, 3, "drop failed");
        deepEqual(seq(iter).drop(3).size, 7, "drop failed");
        deepEqual(seq(iter).drop(50).size, 0, "drop failed");
        done();
    });
    it('dropWhile', (done) => {
        deepEqual(seq(arr).dropWhile(w => w < 3).head, 3, "dropWhile failed");
        deepEqual(seq(arr).dropWhile(w => w < 3).size, 7, "dropWhile failed");
        deepEqual(seq(arr).dropWhile(w => w < 50).size, 0, "dropWhile failed");
        deepEqual(seq(iter).dropWhile(w => w < 3).head, 3, "dropWhile failed");
        deepEqual(seq(iter).dropWhile(w => w < 3).size, 7, "dropWhile failed");
        deepEqual(seq(iter).dropWhile(w => w < 50).size, 0, "dropWhile failed");
        done();
    });
    it('equals', (done) => {
        const a1 = seq([1, 2, 3]);
        deepEqual(a1.equals(seq([1, 2, 3])), true, "equals failed");
        deepEqual(a1.equals(seq([1, 2])), false, "equals failed");
        deepEqual(a1.equals(seq([1, '2', 3])), false, "equals failed");
        deepEqual(seq(iter).equals(seq([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])), true, "equals failed");
        done();
    });
    it('exists', (done) => {
        deepEqual(seq(arr).exists(v => v === 3), true, "exists failed");
        deepEqual(seq(arr).exists(v => v === 10), false, "exists failed");
        deepEqual(seq(iter).exists(v => v === 3), true, "exists failed");
        deepEqual(seq(iter).exists(v => v === 10), false, "exists failed");
        done();
    });
    it('filter', (done) => {
        deepEqual(seq(arr).filter(v => v % 2 === 0).toArray, [0, 2, 4, 6, 8], "filter failed");
        deepEqual(seq(iter).filter(v => v % 2 === 0).toArray, [0, 2, 4, 6, 8], "filter failed");
        done();
    });
    it('filterNot', (done) => {
        deepEqual(seq(arr).filterNot(v => v % 2 === 0).toArray, [1, 3, 5, 7, 9], "filterNot failed");
        deepEqual(seq(iter).filterNot(v => v % 2 === 0).toArray, [1, 3, 5, 7, 9], "filterNot failed");
        done();
    });
    it('flatten', (done) => {
        const a1 = option([option([0, 1]), option([2, 3]), 4, option([5, 6])]);
        deepEqual(a1.flatten().toArray, [0, 1, 2, 3, 4, 5, 6], "flatten failed");
        deepEqual(seq([seq(iter), seq(iter)]).flatten().toArray, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], "flatten failed");
        done();
    });
    it('flatMap', (done) => {
        const a1 = seq([1, 2, 3]);
        deepEqual(a1.flatMap((v) => seq([v * 2])).toArray, [2, 4, 6], "flatMap failed");
        deepEqual(seq(iter).flatMap(v => seq([v * 2])).toArray, [0, 2, 4, 6, 8, 10, 12, 14, 16, 18], "flatMap failed");
        done();
    });
    it('find', (done) => {
        deepEqual(seq(arr).find(x => x === 3).equals(some(3)), true, "find failed");
        deepEqual(seq(arr).find(x => x === 13).equals(none()), true, "find failed");
        deepEqual(seq(iter).find(x => x === 3).equals(some(3)), true, "find failed");
        deepEqual(seq(iter).find(x => x === 13).equals(none()), true, "find failed");
        done();
    });
    it('foldLeft', (done) => {
        deepEqual(seq(arr).foldLeft(1)((acc, v) => acc + v), 46, "foldLeft failed");
        deepEqual(seq(iter).foldLeft(1)((acc, v) => acc + v), 46, "foldLeft failed");
        done();
    });
    it('foldRight', (done) => {
        deepEqual(seq(arr).foldRight(1)((acc, v) => acc + v), 46, "foldRight failed");
        deepEqual(seq(iter).foldRight(1)((acc, v) => acc + v), 46, "foldRight failed");
        done();
    });
    it('forall', (done) => {
        deepEqual(seq(arr).forall(v => v < 50), true, "forall failed");
        deepEqual(seq(arr).forall(v => v < 3), false, "forall failed");
        deepEqual(seq(iter).forall(v => v < 50), true, "forall failed");
        deepEqual(seq(iter).forall(v => v < 3), false, "forall failed");
        done();
    });
    it('foreach', (done) => {
        let count = 0;
        const f = (value) => {
            count = count + value;
        };
        count = 0;
        seq(arr).foreach(f);
        deepEqual(count, 45, "foreach failed");
        count = 0;
        seq(iter).foreach(f);
        deepEqual(count, 45, "foreach failed");
        done();
    });
    it('hasDefiniteSize', (done) => {
        deepEqual(seq(arr).hasDefiniteSize, true, "hasDefiniteSize failed");
        deepEqual(seq(iter).hasDefiniteSize, false, "hasDefiniteSize failed");
        done();
    });
    it('head', (done) => {
        deepEqual(seq(arr).head, 0, "head failed");
        deepEqual(seq(iter).head, 0, "head failed");
        done();
    });
    it('headOption', (done) => {
        deepEqual(seq(arr).headOption.equals(some(0)), true, "headOption failed");
        deepEqual(seq(iter).headOption.equals(some(0)), true, "headOption failed");
        deepEqual(seq([]).headOption.equals(none()), true, "headOption failed");
        done();
    });
    it('indexOf', (done) => {
        deepEqual(seq(arr).indexOf(2), 2, "indexOf failed");
        deepEqual(seq(arr).indexOf(2, 3), -1, "indexOf failed");
        deepEqual(seq(iter).indexOf(2), 2, "indexOf failed");
        deepEqual(seq(iter).indexOf(2, 3), -1, "indexOf failed");
        done();
    });
    it('isEmpty', (done) => {
        deepEqual(seq(arr).isEmpty, false, "isEmpty failed");
        deepEqual(seq([]).isEmpty, true, "isEmpty failed");
        deepEqual(seq(iter).isEmpty, false, "isEmpty failed");
        done();
    });
    it('isIndexed', (done) => {
        deepEqual(seq(arr).isIndexed, true, "isIndexed failed");
        deepEqual(seq(iter).isIndexed, false, "isIndexed failed");
        deepEqual(seq("abcdef").isIndexed, true, "isIndexed failed");
        done();
    });
    it('length', (done) => {
        deepEqual(seq(arr).length, 10, "length failed");
        deepEqual(seq(iter).length, 10, "length failed");
        done();
    });
    it('last', (done) => {
        deepEqual(seq(arr).last, 9, "last failed");
        deepEqual(seq(iter).last, 9, "last failed");
        done();
    });
    it('lastOption', (done) => {
        deepEqual(seq(arr).lastOption.equals(some(9)), true, "lastOption failed");
        deepEqual(seq(iter).lastOption.equals(some(9)), true, "lastOption failed");
        deepEqual(seq([]).lastOption.equals(none()), true, "lastOption failed");
        done();
    });
    it('map', (done) => {
        const a1 = seq([1, 2, 3]);
        deepEqual(a1.map(v => v * 2).toArray, [2, 4, 6], "map failed");
        deepEqual(seq(iter).map(v => v * 2).toArray, [0, 2, 4, 6, 8, 10, 12, 14, 16, 18], "map failed");
        done();
    });
    it('mkString', (done) => {
        deepEqual(seq(arr).mkString(), "0123456789", "mkString failed");
        deepEqual(seq(iter).mkString(), "0123456789", "mkString failed");
        deepEqual(seq(arr).mkString(','), "0,1,2,3,4,5,6,7,8,9", "mkString failed");
        deepEqual(seq(iter).mkString(','), "0,1,2,3,4,5,6,7,8,9", "mkString failed");
        deepEqual(seq(arr).mkString(','), "0,1,2,3,4,5,6,7,8,9", "mkString failed");
        deepEqual(seq(iter).mkString('[', ',', ']'), "[0,1,2,3,4,5,6,7,8,9]", "mkString failed");
        deepEqual(seq(arr).mkString('[', ',', ']'), "[0,1,2,3,4,5,6,7,8,9]", "mkString failed");
        done();
    });
    it('nonEmpty', (done) => {
        deepEqual(seq(arr).nonEmpty, true, "nonEmpty failed");
        deepEqual(seq([]).nonEmpty, false, "nonEmpty failed");
        deepEqual(seq(iter).nonEmpty, true, "nonEmpty failed");
        done();
    });
    it('reverse', (done) => {
        deepEqual(seq(iter).reverse.toArray, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reverse(), "reverse failed");
        deepEqual(seq(arr).reverse.toArray, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reverse(), "reverse failed");
        done();
    });
    it('slice', (done) => {
        deepEqual(seq(arr).slice(2, 5).toArray, [2, 3, 4], "slice failed");
        deepEqual(seq(arr).slice(12, 15).toArray, [], "slice failed");
        deepEqual(seq(iter).slice(2, 5).toArray, [2, 3, 4], "slice failed");
        done();
    });
    it('size', (done) => {
        deepEqual(seq(arr).size, 10, "size failed");
        deepEqual(seq(iter).size, 10, "size failed");
        done();
    });
    it('sum', (done) => {
        deepEqual(seq(arr).sum, 45, "sum failed");
        deepEqual(seq(iter).sum, 45, "sum failed");
        deepEqual(seq("abcdef").sum, "abcdef", "sum failed");
        done();
    });
    it('tail', (done) => {
        deepEqual(seq(arr).tail.toArray, [1, 2, 3, 4, 5, 6, 7, 8, 9], "tail failed");
        deepEqual(seq(iter).tail.toArray, [1, 2, 3, 4, 5, 6, 7, 8, 9], "tail failed");
        done();
    });
    it('take', (done) => {
        deepEqual(seq(arr).take(3).toArray, [0, 1, 2], "take failed");
        deepEqual(seq(iter).take(3).toArray, [0, 1, 2], "take failed");
        done();
    });
    it('toIndexed', (done) => {
        deepEqual(seq(arr).toIndexed.isIndexed, true, "toIndexed failed");
        deepEqual(seq(iter).toIndexed.isIndexed, true, "toIndexed failed");
        deepEqual(seq("abcdef").toIndexed.isIndexed, true, "toIndexed failed");
        done();
    });
    it('toString', (done) => {
        deepEqual(seq(arr).toString, "0123456789", "toString failed");
        deepEqual(seq(iter).toString, "0123456789", "toString failed");
        done();
    });
    it('should be a monad', (done) => {
        //Monad Laws
        const f = (x) => seq([x * x]);
        const g = (x) => seq([x + 2]);
        deepEqual(seq([3]).flatMap(f).toArray, f(3).toArray, "1st Monad Law");
        deepEqual(seq([1, 2, 3]).flatMap((x) => seq([x])).toArray, seq([1, 2, 3]).toArray, "2nd Monad Law");
        deepEqual(seq([1, 2, 3]).flatMap((x) => f(x).flatMap(g)).toArray, seq([1, 2, 3]).flatMap(f).flatMap(g).toArray, "3rd Monad Law");
        done();
    });
    it('should be lazy', (done) => {
        let count = 0;
        const f = (value) => {
            count = count + 1;
            return value > 3;
        };
        count = 0;
        seq(arr).filter(f).take(3).toArray;
        deepEqual(count, 7, "lazy failed");
        count = 0;
        let head = seq(arr).filter(f).head;
        deepEqual(count, 5, "lazy failed");
        deepEqual(head, 4, "lazy failed");
        count = 0;
        seq(iter).filter(f).take(3).toArray;
        deepEqual(count, 7, "lazy failed");
        count = 0;
        head = seq(iter).filter(f).head;
        deepEqual(count, 5, "lazy failed");
        deepEqual(head, 4, "lazy failed");
        done();
    });
    it('should build from a list', (done) => {
        deepEqual(seq(1, 2, 3).toArray, [1, 2, 3], "seq from list failed");
        done();
    });
    it('should build from a string', (done) => {
        deepEqual(seq("abcd").toArray, ['a', 'b', 'c', 'd'], "seq from string failed");
        done();
    });
});
