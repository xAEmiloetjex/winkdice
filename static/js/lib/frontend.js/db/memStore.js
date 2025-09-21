import { fMap } from '../index.js';
export class InMemoryDatabase {
    data = fMap.trueMap();
    parseKey(key) {
        return key.split(".");
    }
    has(key) {
        const parts = this.parseKey(key);
        let current = this.data;
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!current.has(part)) {
                return undefined;
            }
            current = current.get(part);
        }
        return current.has(parts[parts.length - 1]);
    }
    get(key) {
        const parts = this.parseKey(key);
        let current = this.data;
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!current.has(part)) {
                return undefined;
            }
            current = current.get(part);
        }
        return current.get(parts[parts.length - 1]);
    }
    set(key, value) {
        const parts = this.parseKey(key);
        let current = this.data;
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            console.log(part, current);
            if (!current.has(part)) {
                current.set(part, new Map());
            }
            current = current.get(part);
        }
        current.set(parts[parts.length - 1], value);
    }
    delete(key) {
        const parts = this.parseKey(key);
        let current = this.data;
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!current.has(part)) {
                return;
            }
            current = current.get(part);
        }
        current.delete(parts[parts.length - 1]);
    }
}
