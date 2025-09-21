/**
 * Created by Bruno Grieder.
 */
import { Seq } from './Seq.js';
/**
 * The Range class represents numeric values in range [start;end) with non-zero step value step
 */
export class Range extends Seq {
    static from(lengthOrStart, end, step) {
        let rstart, rend, rstep;
        if (typeof end === 'undefined' && typeof step === 'undefined') {
            rstart = 0;
            rstep = 1;
            rend = Math.floor(lengthOrStart) - rstep;
        }
        else if (typeof step === 'undefined') {
            rstep = 1;
            rstart = Math.floor(lengthOrStart);
            rend = Math.floor(end) - rstep;
        }
        else {
            rstart = lengthOrStart;
            rend = end;
            rstep = step;
        }
        const iter = {
            [Symbol.iterator]: () => {
                let current = rstart;
                return {
                    next: () => {
                        const done = rstep <= 0 ? current < rend : current > rend;
                        const value = done ? void 0 : current;
                        current = current + rstep;
                        return { done: done, value: value };
                    }
                };
            },
            length: Math.floor((rend + rstep - rstart) / rstep),
            reverseIterator: () => {
                let current = rend;
                return {
                    next: () => {
                        const done = rstep > 0 ? current < rstart : current > rstart;
                        const value = done ? void 0 : current;
                        current = current - rstep;
                        return { done: done, value: value };
                    }
                };
            }
        };
        return new Range(iter);
    }
}
export function range(lengthOrStart, end, step) {
    return Range.from(lengthOrStart, end, step);
}
