import { get, set, unset } from "../lodash.js";
import { CustomError as QuickError, ErrorKind } from "./error.js";
import { isConnectable, isDisconnectable } from "./utilities.js";
import { MemoryDriver } from "./drivers/MemoryDriver.js";
export class QuickDB {
    static instances = new Map();
    _driver;
    tableName;
    normalKeys;
    options;
    get driver() {
        return this._driver;
    }
    constructor(options = {}) {
        options.table ??= "json";
        options.filePath ??= "json.sqlite";
        options.normalKeys ??= false;
        if (!options.driver) {
            // const { MemoryDriver } = require("./drivers/MemoryDriver");
            options.driver = new MemoryDriver(options.filePath);
        }
        this.options = options;
        this._driver = options.driver;
        this.tableName = options.table;
        this.normalKeys = options.normalKeys;
    }
    async addSubtract(key, value, sub = false) {
        if (typeof key != "string") {
            throw new QuickError(`First argument (key) needs to be a string received "${typeof key}"`, ErrorKind.InvalidType);
        }
        if (value == null) {
            throw new QuickError("Missing second argument (value)", ErrorKind.MissingValue);
        }
        let currentNumber = await this.get(key);
        if (currentNumber == null)
            currentNumber = 0;
        if (typeof currentNumber != "number") {
            try {
                currentNumber = parseFloat(currentNumber);
            }
            catch (_) {
                throw new QuickError(`Current value with key: (${key}) is not a number and couldn't be parsed to a number`, ErrorKind.InvalidType);
            }
        }
        if (typeof value != "number") {
            try {
                value = parseFloat(value);
            }
            catch (_) {
                throw new QuickError(`Value to add/subtract with key: (${key}) is not a number and couldn't be parsed to a number`, ErrorKind.InvalidType);
            }
        }
        sub ? (currentNumber -= value) : (currentNumber += value);
        await this.set(key, currentNumber);
        return currentNumber;
    }
    async getArray(key) {
        const currentArr = (await this.get(key)) ?? [];
        if (!Array.isArray(currentArr)) {
            throw new QuickError(`Current value with key: (${key}) is not an array`, ErrorKind.InvalidType);
        }
        return currentArr;
    }
    static registerSingleton(name, options = {}) {
        if (typeof name != "string") {
            throw new QuickError(`First argument (name) needs to be a string received "${typeof name}"`, ErrorKind.InvalidType);
        }
        const instance = new QuickDB(options);
        this.instances.set(name, instance);
        return instance;
    }
    static getSingletion(name) {
        if (typeof name != "string") {
            throw new QuickError(`First argument (name) needs to be a string received "${typeof name}"`, ErrorKind.InvalidType);
        }
        return this.instances.get(name);
    }
    async init() {
        if (isConnectable(this.driver)) {
            await this.driver.connect();
        }
        await this.driver.prepare(this.tableName);
    }
    async close() {
        if (isDisconnectable(this.driver)) {
            await this.driver.disconnect();
        }
    }
    async all() {
        return this.driver.getAllRows(this.tableName);
    }
    async get(key) {
        if (typeof key != "string") {
            throw new QuickError(`First argument (key) needs to be a string received "${typeof key}"`, ErrorKind.InvalidType);
        }
        if (key.includes(".") && !this.normalKeys) {
            const keySplit = key.split(".");
            const [result] = await this.driver.getRowByKey(this.tableName, keySplit[0]);
            return get(result, keySplit.slice(1).join("."));
        }
        const [result] = await this.driver.getRowByKey(this.tableName, key);
        return result;
    }
    async set(key, value) {
        if (typeof key != "string") {
            throw new QuickError(`First argument (key) needs to be a string received "${typeof key}"`, ErrorKind.InvalidType);
        }
        if (value == null) {
            throw new QuickError("Missing second argument (value)", ErrorKind.MissingValue);
        }
        if (key.includes(".") && !this.normalKeys) {
            const keySplit = key.split(".");
            const [result, exist] = await this.driver.getRowByKey(this.tableName, keySplit[0]);
            let obj;
            if (result instanceof Object == false) {
                obj = {};
            }
            else {
                obj = result;
            }
            const valueSet = set(obj ?? {}, keySplit.slice(1).join("."), value);
            return this.driver.setRowByKey(this.tableName, keySplit[0], valueSet, exist);
        }
        const exist = (await this.driver.getRowByKey(this.tableName, key))[1];
        return this.driver.setRowByKey(this.tableName, key, value, exist);
    }
    async update(key, object) {
        if (typeof key != "string") {
            throw new QuickError(`First argument (key) needs to be a string received "${typeof key}"`, ErrorKind.InvalidType);
        }
        if (typeof object != "object" || object == null) {
            throw new QuickError(`Second argument (object) needs to be an object received "${typeof object}"`, ErrorKind.InvalidType);
        }
        const data = (await this.get(key)) ?? {};
        if (typeof data != "object" || Array.isArray(data)) {
            throw new QuickError(`The current data is not an object, update only works on objects`, ErrorKind.InvalidType);
        }
        for (const [k, v] of Object.entries(object)) {
            data[k] = v;
        }
        return await this.set(key, data);
    }
    async has(key) {
        return (await this.get(key)) != null;
    }
    async delete(key) {
        if (typeof key != "string") {
            throw new QuickError(`First argument (key) needs to be a string received "${typeof key}"`, ErrorKind.InvalidType);
        }
        if (key.includes(".")) {
            const keySplit = key.split(".");
            const obj = (await this.get(keySplit[0])) ?? {};
            unset(obj, keySplit.slice(1).join("."));
            return this.set(keySplit[0], obj);
        }
        return this.driver.deleteRowByKey(this.tableName, key);
    }
    async deleteAll() {
        return this.driver.deleteAllRows(this.tableName);
    }
    async add(key, value) {
        return this.addSubtract(key, value);
    }
    async sub(key, value) {
        return this.addSubtract(key, value, true);
    }
    async push(key, ...values) {
        if (typeof key != "string") {
            throw new QuickError(`First argument (key) needs to be a string received "${typeof key}"`, ErrorKind.InvalidType);
        }
        if (values.length === 0) {
            throw new QuickError("Missing second argument (value)", ErrorKind.MissingValue);
        }
        const currentArr = await this.getArray(key);
        currentArr.push(...values);
        return this.set(key, currentArr);
    }
    async unshift(key, value) {
        if (typeof key != "string") {
            throw new QuickError(`First argument (key) needs to be a string received "${typeof key}"`, ErrorKind.InvalidType);
        }
        if (value == null) {
            throw new QuickError("Missing second argument (value)", ErrorKind.InvalidType);
        }
        let currentArr = await this.getArray(key);
        if (Array.isArray(value))
            currentArr = value.concat(currentArr);
        else
            currentArr.unshift(value);
        return await this.set(key, currentArr);
    }
    async pop(key) {
        if (typeof key != "string") {
            throw new QuickError(`First argument (key) needs to be a string received "${typeof key}"`, ErrorKind.InvalidType);
        }
        const currentArr = await this.getArray(key);
        const value = currentArr.pop();
        await this.set(key, currentArr);
        return value;
    }
    async shift(key) {
        if (typeof key != "string") {
            throw new QuickError(`First argument (key) needs to be a string received "${typeof key}"`, ErrorKind.InvalidType);
        }
        const currentArr = await this.getArray(key);
        const value = currentArr.shift();
        await this.set(key, currentArr);
        return value;
    }
    async pull(key, value, once = false) {
        if (typeof key != "string") {
            throw new QuickError(`First argument (key) needs to be a string received "${typeof key}"`, ErrorKind.InvalidType);
        }
        if (value == null) {
            throw new QuickError("Missing second argument (value)", ErrorKind.MissingValue);
        }
        const currentArr = await this.getArray(key);
        if (!Array.isArray(value) && typeof value != "function")
            value = [value];
        const data = [];
        for (const i in currentArr) {
            if (Array.isArray(value)
                ? value.includes(currentArr[i])
                : value(currentArr[i], i))
                continue;
            data.push(currentArr[i]);
            if (once)
                break;
        }
        return await this.set(key, data);
    }
    async startsWith(query) {
        if (typeof query != "string") {
            throw new QuickError(`First argument (query) needs to be a string received "${typeof query}"`, ErrorKind.InvalidType);
        }
        const results = await this.driver.getStartsWith(this.tableName, query);
        return results;
    }
    async table(table) {
        if (typeof table != "string") {
            throw new QuickError(`First argument (table) needs to be a string received "${typeof table}"`, ErrorKind.InvalidType);
        }
        const options = { ...this.options };
        options.table = table;
        options.driver = this.driver;
        const instance = new QuickDB(options);
        await instance.driver.prepare(options.table);
        return instance;
    }
    useNormalKeys(activate) {
        this.normalKeys = activate;
    }
}
//# sourceMappingURL=index.js.map