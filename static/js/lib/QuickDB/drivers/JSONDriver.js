import { existsSync, readFileSync } from "fs";
import { readFile } from "fs/promises";
import writeFile from "write-file-atomic";
import { MemoryDriver } from "./MemoryDriver";
export class JSONDriver extends MemoryDriver {
    path;
    constructor(path = "./quickdb.json") {
        super();
        this.path = path;
        this.loadContentSync();
    }
    loadContentSync() {
        if (existsSync(this.path)) {
            const contents = readFileSync(this.path, { encoding: "utf-8" });
            try {
                const data = JSON.parse(contents);
                for (const table in data) {
                    const store = this.getOrCreateTable(table);
                    data[table].forEach((d) => store.set(d.id, d.value));
                }
            }
            catch {
                throw new Error("Database malformed");
            }
        }
        else {
            writeFile.sync(this.path, "{}");
        }
    }
    async loadContent() {
        if (existsSync(this.path)) {
            const contents = await readFile(this.path, { encoding: "utf-8" });
            try {
                const data = JSON.parse(contents);
                for (const table in data) {
                    const store = this.getOrCreateTable(table);
                    data[table].forEach((d) => store.set(d.id, d.value));
                }
            }
            catch {
                throw new Error("Database malformed");
            }
        }
        else {
            await writeFile(this.path, "{}");
        }
    }
    async export() {
        const val = {};
        for (const tableName of this.store.keys()) {
            val[tableName] = await this.getAllRows(tableName);
        }
        return val;
    }
    async snapshot() {
        const data = await this.export();
        await writeFile(this.path, JSON.stringify(data));
    }
    async deleteAllRows(table) {
        const val = super.deleteAllRows(table);
        await this.snapshot();
        return val;
    }
    async deleteRowByKey(table, key) {
        const val = super.deleteRowByKey(table, key);
        await this.snapshot();
        return val;
    }
    async setRowByKey(table, key, value, update) {
        const val = super.setRowByKey(table, key, value, update);
        await this.snapshot();
        return val;
    }
}
//# sourceMappingURL=JSONDriver.js.map