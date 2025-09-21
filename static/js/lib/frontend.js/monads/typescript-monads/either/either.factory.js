import { Either } from './either.js';
export function either(left, right) {
    return new Either(left, right);
}
