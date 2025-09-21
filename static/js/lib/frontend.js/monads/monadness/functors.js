const ArrayInstanceOf = [Array, Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
export const Identity = (a) => a;
export function fmap(getter, setter, err) {
    return (func) => (m) => {
        try {
            let val = getter(m);
            if (typeof val === "object" && ArrayInstanceOf.some(i => val instanceof i)) {
                val = val.map(func);
            }
            return setter(func(val));
        }
        catch (e) {
            return err(e);
        }
    };
}
;
export function compose(f) {
    const funcIterator = [];
    function _compose(f2) {
        if (f2 === undefined) {
            return (a) => {
                let val = a;
                for (let i in funcIterator) {
                    val = funcIterator[i](val);
                }
                return val;
            };
        }
        funcIterator.push(f2);
        return _compose.bind(this);
    }
    ;
    return _compose.call(this, f);
}
function filter(f) {
    return (arr) => Array.prototype.filter.call(arr, f);
}
function sum(arr) {
    return arr.reduce((p, c) => p + c, 0);
}
function minus(arr) {
    return arr.reduce((p, c) => p - c, 0);
}
