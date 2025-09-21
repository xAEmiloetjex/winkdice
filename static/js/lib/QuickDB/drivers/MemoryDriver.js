export class MemoryDriver {
    store = new Map();
    async prepare(table) {
        this.getOrCreateTable(table);
    }
    getOrCreateTable(name) {
        const table = this.store.get(name);
        if (table)
            return table;
        const newTable = new Map();
        this.store.set(name, newTable);
        return newTable;
    }
    async deleteAllRows(table) {
        const store = this.getOrCreateTable(table);
        const len = store.size;
        store.clear();
        return len;
    }
    async deleteRowByKey(table, key) {
        const store = this.getOrCreateTable(table);
        return +store.delete(key);
    }
    async getAllRows(table) {
        const store = this.getOrCreateTable(table);
        return [...store.entries()].map(([k, v]) => ({ id: k, value: v }));
    }
    async getRowByKey(table, key) {
        const store = this.getOrCreateTable(table);
        const val = store.get(key);
        return [val == null ? null : val, val == null ? false : true];
    }
    async getStartsWith(table, query) {
        const store = this.getOrCreateTable(table);
        return [...store.entries()]
            .filter(([k]) => k.startsWith(query))
            .map(([k, v]) => ({ id: k, value: v }));
    }
    async setRowByKey(table, key, value, update) {
        const store = this.getOrCreateTable(table);
        store.set(key, value);
        return store.get(key);
    }
}
//# sourceMappingURL=MemoryDriver.js.map