import { InMemoryDatabase } from "../drivers/memStore.js";
export class DBInterface {
    public db: any;
    constructor(Driver: InMemoryDatabase) {
        this.db = Driver;
    }
}