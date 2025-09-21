/**
 * Author: Bruno Grieder
 */
import { none, option, some } from '../Option';
require('source-map-support').install();
import { tri } from '../Try';
const deepEqual = chai.assert.deepEqual;
describe('Try', function () {
    before((done) => {
        done();
    });
    after((done) => {
        done();
    });
    it('collect', (done) => {
        deepEqual(tri(() => 2).collect(() => true)(v => v * 2).get, 4, "collect failed");
        deepEqual(tri(() => 2).collect(() => false)(v => v * 2).isFailure, true, "collect failed");
        deepEqual(tri(() => { throw new Error('OK'); }).collect(() => true)(v => v * 2).isFailure, true, "collect failed");
        done();
    });
    it('filter', (done) => {
        deepEqual(tri(() => 2).filter(() => true).get, 2, "filter failed");
        try {
            tri(() => 2).filter(() => false).get;
            return done(new Error('filter failed'));
        }
        catch (e) {
            /* ignore */
        }
        try {
            tri(() => { throw new Error('OK'); }).filter(() => true).get;
            return done(new Error('filter failed'));
        }
        catch (e) {
            /* ignore */
        }
        try {
            tri(() => { throw new Error('OK'); }).filter(() => false).get;
            return done(new Error('filter failed'));
        }
        catch (e) {
            /* ignore */
        }
        done();
    });
    it('flatten', (done) => {
        deepEqual(tri(() => tri(() => 2)).flatten().get, 2, "flatten failed");
        deepEqual(tri(() => 2).flatten().get, 2, "flatten failed");
        deepEqual(tri(() => { throw new Error('OK'); }).flatten().isFailure, true, "flatten failed");
        deepEqual(tri(() => tri(() => { throw new Error('OK'); })).flatten().isFailure, true, "flatten failed");
        done();
    });
    it('flatMap', (done) => {
        deepEqual(tri(() => 2).flatMap((v) => tri(() => v * 3)).get, 6, "flatMap failed");
        deepEqual(tri(() => { throw new Error('OK'); }).flatMap((v) => tri(() => v * 3)).isFailure, true, "flatMap failed");
        done();
    });
    it('fold', (done) => {
        deepEqual(tri(() => 2).fold((e) => 3, (v) => v * 2), 4, "fold failed");
        deepEqual(tri(() => { throw new Error('OK'); }).fold((e) => 3, (v) => v * 2), 3, "fold failed");
        done();
    });
    it('foreach', (done) => {
        let count = 0;
        const f = (value) => {
            count = count + value;
        };
        count = 0;
        tri(() => { throw new Error('OK'); }).foreach(f);
        deepEqual(count, 0, "foreach failed");
        count = 0;
        tri(() => 2).foreach(f);
        deepEqual(count, 2, "foreach failed");
        done();
    });
    it('get', (done) => {
        try {
            tri(() => { throw new Error('OK'); }).get;
            return done(new Error("get Failed"));
        }
        catch (e) {
            /* ignore */
        }
        deepEqual(tri(() => 2).get, 2, 'get Failed');
        done();
    });
    it('getOrElse', (done) => {
        deepEqual(tri(() => 2).getOrElse(() => 3), 2, "getOrElse failed");
        deepEqual(tri(() => { throw new Error('OK'); }).getOrElse(() => 3), 3, "getOrElse failed");
        done();
    });
    it('map', (done) => {
        deepEqual(tri(() => 2).map(v => v * 2).get, 4, "map failed");
        deepEqual(tri(() => { throw new Error('OK'); }).map(v => v * 2).isFailure, true, "map failed");
        done();
    });
    it('orElse', (done) => {
        deepEqual(tri(() => 2).orElse(() => tri(() => 3)).get, 2, "orElse failed");
        deepEqual(tri(() => { throw new Error('OK'); }).orElse(() => tri(() => 3)).get, 3, "orElse failed");
        done();
    });
    it('recover', (done) => {
        deepEqual(tri(() => 2).recover((e) => 3).get, 2, "recover failed");
        deepEqual(tri(() => { throw new Error('OK'); }).recover((e) => 3).get, 3, "recover failed");
        done();
    });
    it('recoverWith', (done) => {
        deepEqual(tri(() => 2).recoverWith((e) => tri(() => 3)).get, 2, "recoverWith failed");
        deepEqual(tri(() => { throw new Error('OK'); }).recoverWith((e) => tri(() => 3)).get, 3, "recoverWith failed");
        done();
    });
    it('toOption', (done) => {
        deepEqual(tri(() => 2).toOption.get, 2, "toOption failed");
        deepEqual(tri(() => 2).toOption.equals(some(2)), true, "toOption failed");
        deepEqual(tri(() => { throw new Error('OK'); }).toOption.equals(none()), true, "toOption failed");
        let count = 0;
        const f = () => {
            count = count + 1;
            return count * 2;
        };
        const opt = tri(f);
        deepEqual(count, 0, "toOption failed");
        deepEqual(opt.get, 2, "toOption failed");
        deepEqual(count, 1, "toOption failed");
        done();
    });
    it('toPromise', async () => {
        deepEqual(await tri(() => 2).toPromise, 2, "toPromise failed");
        deepEqual(await tri(() => { throw new Error('OK'); }).toPromise.catch(() => 2), 2, "toPromise failed");
    });
    it('transform', (done) => {
        deepEqual(tri(() => 2).transform((e) => tri(() => 3), (v) => tri(() => v * 2)).get, 4, "transform failed");
        deepEqual(tri(() => { throw new Error('OK'); }).transform((e) => tri(() => 3), (v) => tri(() => v * 2)).get, 3, "transform failed");
        done();
    });
    it('should be a monad', (done) => {
        //Monad Laws
        const f = (x) => tri(() => x * x);
        const g = (x) => tri(() => x + 2);
        deepEqual(tri(() => 3).flatMap(f).get, f(3).get, "1st Monad Law");
        deepEqual(tri(() => 2).flatMap((x) => tri(() => x)).get, tri(() => 2).get, "2nd Monad Law");
        deepEqual(tri(() => 4).flatMap((x) => f(x).flatMap(g)).get, tri(() => 4).flatMap(f).flatMap(g).get, "3rd Monad Law");
        done();
    });
    it('should be lazy', (done) => {
        let count = 0;
        const f = () => {
            count = count + 1;
            return 2;
        };
        const t = tri(f).filter(() => true);
        deepEqual(count, 0, 'lazy failed');
        deepEqual(t.get, 2, 'lazy failed');
        deepEqual(count, 1, 'lazy failed');
        deepEqual(t.isSuccess, true, 'lazy failed');
        deepEqual(count, 1, 'lazy failed');
        done();
    });
    it('example', (done) => {
        function divide(numerator, denominator) {
            const parseNumerator = () => option(parseFloat(numerator)).orThrow(() => "Please provide a valid numerator");
            const parseDenominator = () => option(parseFloat(denominator)).orThrow(() => "Please provide a valid denominator");
            return tri(parseNumerator).flatMap(num => tri(parseDenominator).map(den => num / den));
        }
        deepEqual(divide(6, 3).get, 2, 'example failed');
        deepEqual(divide(6, 0).get, Infinity, 'example failed');
        deepEqual(divide("blah", 3)
            .recover((e) => {
            deepEqual(e.message.indexOf("numerator") !== -1, true, 'example failed');
            return Infinity;
        })
            .get, Infinity, 'example failed');
        deepEqual(divide(6, "blah")
            .recover((e) => {
            deepEqual(e.message.indexOf("denominator") !== -1, true, 'example failed');
            return Infinity;
        })
            .get, Infinity, 'example failed');
        done();
    });
});
