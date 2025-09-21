import { InMemoryDatabase } from "../drivers/memStore.js";
export declare class DBInterface {
    db: any;
    constructor(Driver: InMemoryDatabase);
}
