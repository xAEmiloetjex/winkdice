import sqlite3 from "better-sqlite3";
export class SqliteDriver {
    static instance = null;
    _database;
    get database() {
        return this._database;
    }
    constructor(path) {
        this._database = sqlite3(path);
    }
    static createSingleton(path) {
        if (!SqliteDriver.instance) {
            SqliteDriver.instance = new SqliteDriver(path);
        }
        return SqliteDriver.instance;
    }
    async prepare(table) {
        this._database.exec(`CREATE TABLE IF NOT EXISTS ${table} (ID TEXT PRIMARY KEY, json TEXT)`);
    }
    async getAllRows(table) {
        const prep = this._database.prepare(`SELECT * FROM ${table}`);
        const data = [];
        for (const row of prep.iterate()) {
            data.push({
                id: row.ID,
                value: JSON.parse(row.json),
            });
        }
        return data;
    }
    async getRowByKey(table, key) {
        const value = (await this._database
            .prepare(`SELECT json FROM ${table} WHERE ID = @key`)
            .get({ key }));
        return value != null ? [JSON.parse(value.json), true] : [null, false];
    }
    async getStartsWith(table, query) {
        const prep = this._database.prepare(`SELECT * FROM ${table} WHERE ID LIKE '${query}%'`);
        const data = [];
        for (const row of prep.iterate()) {
            data.push({
                id: row.ID,
                value: JSON.parse(row.json),
            });
        }
        return data;
    }
    async setRowByKey(table, key, value, update) {
        const stringifiedJson = JSON.stringify(value);
        if (update) {
            this._database
                .prepare(`UPDATE ${table} SET json = (?) WHERE ID = (?)`)
                .run(stringifiedJson, key);
        }
        else {
            this._database
                .prepare(`INSERT INTO ${table} (ID,json) VALUES (?,?)`)
                .run(key, stringifiedJson);
        }
        return value;
    }
    async deleteAllRows(table) {
        const result = this._database.prepare(`DELETE FROM ${table}`).run();
        return result.changes;
    }
    async deleteRowByKey(table, key) {
        const result = this._database
            .prepare(`DELETE FROM ${table} WHERE ID=@key`)
            .run({ key });
        return result.changes;
    }
}
//# sourceMappingURL=SqliteDriver.js.map