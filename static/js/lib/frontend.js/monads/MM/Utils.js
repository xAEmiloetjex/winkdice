/**
 * Created by Bruno Grieder.
 */
/**
 * Test is two values are equals by first checking id they implement an `equals` methods
 * otherwise test using `===`
 */
export function eq(a, b) {
    if (typeof b === 'object') {
        const feq = b['equals'];
        return (feq && feq.call(b, a)) || (a === b);
    }
    return (a === b);
}
