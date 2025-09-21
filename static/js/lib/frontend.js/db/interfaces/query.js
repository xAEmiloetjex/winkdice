import { DBInterface } from "./Interface.js";
export class QueryInterface extends DBInterface {
    // public db: InMemoryDatabase;
    constructor(Driver) {
        // this.db = new InMemoryDatabase();
        super(Driver);
    }
    async execute(q) {
        // console.log(q)
        if (q.op === 'create') {
            return await this.handleCreate(q);
        }
        else if (q.op === 'insert') {
            return await this.handleInsert(q);
        }
        else if (q.op === 'update') {
            return await this.handleUpdate(q);
        }
        else if (q.op === 'select') {
            return await this.handleSelect(q);
        }
        else if (q.op === 'delete') {
            return await this.handleDelete(q);
        }
    }
    async handleCreate(q) {
        if (q.what === 'table') {
            return await this.handleCreateTable(q);
        }
        else {
            throw new Error(`No implementation for '${q.op} ${q.what}' exists`);
        }
    }
    async handleCreateTable(query) {
        // Matches: CREATE TABLE tablename (column1 type, column2 type, ...)
        const spec = {
            tableName: query.id,
            columnDefinitions: query.columns
        };
        const { tableName, columnDefinitions } = spec;
        if (await this.db.has(tableName.toLowerCase())) {
            console.log(`Table '${tableName.toLowerCase()}' found to already be existing.`);
            return;
        }
        else {
            const validTypes = ['string', 'number', 'boolean'];
            columnDefinitions.forEach(col => {
                if (!validTypes.includes(col.type)) {
                    throw new Error(`Unsupported data type: ${col.type}`);
                }
            });
            return this.db.createTable(tableName.toLowerCase(), columnDefinitions);
        }
    }
    async handleInsert(q) {
        if (q.what === 'into') {
            return await this.handleInsertInto(q);
        }
        else {
            throw new Error(`No implementation for '${q.op} ${q.what}' exists`);
        }
    }
    handleInsertInto(q) {
        const columnNames = q.columns.map(col => String(col).trim());
        const rowValues = q.values.map(val => {
            const trimmed = String(val).trim();
            // Handle null values
            if (trimmed.toLowerCase() === 'null')
                return null;
            // Handle string values with possible spaces
            if (trimmed.startsWith("'"))
                return trimmed.slice(1, -1);
            // Handle numeric values
            const num = Number(trimmed);
            if (isNaN(num))
                return trimmed; // If not a number, return as string
            return num;
        });
        if (columnNames.length !== rowValues.length) {
            throw new Error('Column count does not match values count');
        }
        const record = Object.fromEntries(columnNames.map((col, i) => [col, rowValues[i]]));
        // console.log('Debug-record:', record)
        return this.db.insert(q.id, record);
    }
    handleUpdate(q) {
        // const updates = Object.fromEntries(
        //     Array(q.columns).map((pair: {
        //         columnName: string,
        //         newValue: string|number|boolean
        //     }) => {
        //         const {columnName: col, newValue: val} = pair[0]
        //         console.log({col,val}, pair)
        //         const value = 
        //         (String(val).startsWith("\'") || String(val).startsWith("'"))
        //             ? String(val).slice(1, -1)
        //             : Number(val);
        //         return [col, value]
        //     })
        // )
        const updates = ((pairs) => {
            let store = {};
            for (const pair of pairs) {
                const { columnName: col, newValue: val } = pair;
                const value = (String(val).startsWith("\'") || String(val).startsWith("'"))
                    ? String(val).slice(1, -1)
                    : Number(val);
                store[col] = value;
            }
            return store;
        })(q.columns);
        let records = this.db.getAll(q.id);
        // if (q.where && (q.where.entries || q.where.all)) {
        records = this.applyWhereClause(records, q.where);
        // }
        records.forEach(record => {
            this.db.update(q.id, record.id, { ...record, ...updates });
            // console.log('Update.Record:',record, updates)
        });
        return { updated: records.length };
    }
    handleSelect(q) {
        const selectedColumns = q.columns.map(col => String(col).trim());
        let result = this.db.getAll(q.id);
        if (q.where) {
            result = this.applyWhereClause(result, q.where);
        }
        return this.projectColumns(result, selectedColumns);
    }
    handleDelete(q) {
        let records = this.db.getAll(q.id);
        if (q.where) {
            records = this.applyWhereClause(records, q.where);
        }
        records.forEach(record => {
            this.db.delete(q.id, record.id);
        });
        return { deleted: records.length };
    }
    applyWhereClause(records, clause) {
        if (Array.isArray(clause)) {
            return clause.reduce((filteredRecords, currentClause) => {
                return this.applyWhereClause(filteredRecords, currentClause);
            }, records);
        }
        // Handle more complex WHERE conditions
        const [column, operator, ...valueParts] = clause.trim().split(/\s+/);
        const value = valueParts.join(' ').trim();
        // Handle null comparisons
        if (value.toLowerCase() === 'null') {
            return records.filter(record => {
                switch (operator.toLowerCase()) {
                    case 'is':
                        return record[column] === null;
                    case 'is not':
                        return record[column] !== null;
                    default:
                        throw new Error(`Invalid operator for NULL comparison: ${operator}`);
                }
            });
        }
        const compareValue = value.startsWith("'") ? value.slice(1, -1) : Number(value);
        if (!value.startsWith("'") && isNaN(compareValue)) {
            throw new Error(`Invalid value in WHERE clause: ${value}`);
        }
        return records.filter(record => {
            switch (operator.toLowerCase()) {
                case '=':
                case '==':
                    return record[column] === compareValue;
                case '>':
                    return record[column] > compareValue;
                case '<':
                    return record[column] < compareValue;
                case '>=':
                    return record[column] >= compareValue;
                case '<=':
                    return record[column] <= compareValue;
                case '!=':
                case '<>':
                    return record[column] !== compareValue;
                default:
                    throw new Error(`Unsupported operator: ${operator}`);
            }
        });
    }
    projectColumns(records, columns) {
        if (columns.includes('*'))
            return records;
        return records.map(record => {
            return Object.fromEntries(columns.map(col => [col, record[col]]));
        });
    }
    // limbo
    applyWhereClauses(records, clauses) {
        // @ts-expect-error
        if (!clauses.entries && !clauses.all)
            throw new Error('we expect the clauses to be either type of {entries:string[]}');
        // @ts-expect-error
        if (clauses.entries || clauses.all) {
            // @ts-expect-error
            if (clauses.all)
                throw new Error('The \'all\' function is not yet implemented');
            if (
            // @ts-expect-error
            (clauses.entries && !Array.isArray(clauses.entries)) ||
                // @ts-expect-error
                (clauses.all && !Array.isArray(clauses.all)))
                throw new Error('we expect the clauses to be either type of {entries:string[]},\nWe haven\'t implemented recursive whereClauses yet');
        }
        let store = [];
        // @ts-expect-error
        // return this.applyWhereClause(records, clauses.entries[0])
        for (const clause in clauses.entries) {
            const retVals = this.applyWhereClause(records, clause);
            for (const val in retVals) {
                store.push(val);
            }
        }
        return store;
        // return this.applyWhereClause(records, clause)
    }
}
export default QueryInterface;
