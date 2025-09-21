/**
 * @name Logger
 * @class Perform calculation while collecting logs
 */
export class Logger {
    logs;
    value;
    /**
     * @description Construct a Logger object.
     * @constructor
     * @param {TLogs[]} logs The collection of logs.
     * @param {TValue} value The value to wrap.
     */
    constructor(logs, value) {
        this.logs = logs;
        this.value = value;
    }
    /**
     * @name Logger
     * @description Helper function to build a Logger object.
     * @static
     * @param {TLogs[]} story The collection of logs.
     * @param {TValue} value The value to wrap.
     * @returns {Logger<TLogs, TValue>} A Logger object containing the collection of logs and value.
     */
    static logger(logs, value) {
        return new Logger(logs, value);
    }
    static tell(s) {
        return new Logger([s], 0);
    }
    static startWith(s, value) {
        return new Logger([s], value);
    }
    of(v) {
        return new Logger([], v);
    }
    flatMap(fn) {
        const result = fn(this.value);
        return new Logger(this.logs.concat(result.logs), result.value);
    }
    flatMapPair(fn) {
        const result = fn(this.value);
        return new Logger(this.logs.concat(result[0]), result[1]);
    }
    runUsing(fn) {
        return fn({ logs: this.logs, value: this.value });
    }
}
