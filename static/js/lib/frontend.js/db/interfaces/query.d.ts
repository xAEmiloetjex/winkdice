import { DBInterface } from "./Interface.js";
export interface QueryBase {
    op: 'create' | 'select' | 'insert' | 'update' | 'delete';
    [x: string | symbol]: any;
}
export interface CreateQuery extends QueryBase {
    op: 'create';
    what: 'table';
    id: string;
    [x: string | symbol]: any;
}
export interface CreateTableQuery extends CreateQuery {
    what: 'table';
    id: string;
    columns: {
        name: string;
        type: 'string' | 'number' | 'boolean';
    }[];
}
export interface InsertQuery extends QueryBase {
    op: 'insert';
    what: 'into';
    id: string;
    columns: string[];
    values: (string | number | boolean)[];
    [x: string | symbol]: any;
}
export interface InsertIntoQuery extends QueryBase {
    op: 'insert';
    what: 'into';
    id: string;
    columns: string[];
    values: (string | number | boolean)[];
}
export interface UpdateQuery extends QueryBase {
    op: 'update';
    id: string;
    columns: {
        columnName: string;
        newValue: string | number | boolean;
    }[];
    where: string | string[];
}
export interface SelectQuery extends QueryBase {
    op: 'select';
    id: string;
    columns: string[];
    where: string | string[];
}
export interface DeleteQuery extends QueryBase {
    op: 'delete';
    id: string;
    where: string | string[];
}
type CreateQueries = CreateQuery | CreateTableQuery;
type InsertQueries = InsertQuery | InsertIntoQuery;
type Queries = QueryBase | CreateQueries | InsertQueries | UpdateQuery | SelectQuery;
export declare class QueryInterface extends DBInterface {
    constructor(Driver: any);
    execute(q: Queries): Promise<any>;
    protected handleCreate(q: CreateQuery): Promise<any>;
    protected handleCreateTable(query: CreateTableQuery): Promise<any>;
    protected handleInsert(q: InsertQuery): Promise<any>;
    protected handleInsertInto(q: InsertIntoQuery): any;
    protected handleUpdate(q: UpdateQuery): {
        updated: any;
    };
    protected handleSelect(q: SelectQuery): any[];
    protected handleDelete(q: DeleteQuery): {
        deleted: any;
    };
    private applyWhereClause;
    private projectColumns;
    private applyWhereClauses;
}
export default QueryInterface;
