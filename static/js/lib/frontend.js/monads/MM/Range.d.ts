/**
 * Created by Bruno Grieder.
 */
import { Seq } from './Seq.js';
/**
 * The Range class represents numeric values in range [start;end) with non-zero step value step
 */
export declare class Range extends Seq<number> {
    static from(lengthOrStart: number, end?: number, step?: number): Range;
}
/**
 * Create a range of integers of the specified length starting at 0
 */
export declare function range(length: number): Range;
/**
 * Create a range from the specified start to the element end-1 included  in step of 1
 */
export declare function range(start: number, end: number): Range;
/**
 * Create a range from start to end-step included
 */
export declare function range(start: number, end: number, step: number): Range;
