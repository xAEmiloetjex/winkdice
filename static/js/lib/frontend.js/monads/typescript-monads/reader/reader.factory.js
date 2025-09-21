import { Reader } from './reader.js';
export function reader(fn) {
    return new Reader(fn);
}
