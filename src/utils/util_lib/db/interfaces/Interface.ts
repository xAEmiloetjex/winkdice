import { InMemoryDatabase } from "../drivers/memStore";
export class DBInterface {
    public db: any;
    constructor(Driver: InMemoryDatabase) {
        this.db = Driver;
    }
}