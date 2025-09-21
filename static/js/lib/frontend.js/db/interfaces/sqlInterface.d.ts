import { DBInterface } from "./Interface.js";
export declare class SQLInterface extends DBInterface {
    constructor(Driver: any);
    executeQuery(sqlQuery: string): Promise<any>;
    private handleSelect;
    private handleInsert;
    private handleUpdate;
    private handleDelete;
    private handleCreateTable;
    private applyWhereClause;
    private projectColumns;
}
export default SQLInterface;
