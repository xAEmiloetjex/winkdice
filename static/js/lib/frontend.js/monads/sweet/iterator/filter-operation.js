import { just, none } from "../maybe/index.js";
import { IntermidiateOperation } from "./intermediate-operation.js";
export class FilterOperation extends IntermidiateOperation {
    predicate;
    constructor(predicate) {
        super();
        this.predicate = predicate;
    }
    execute(value) {
        const result = this.predicate(value, () => this.terminate());
        if (this.terminated) {
            return none();
        }
        return result ? just(value) : none();
    }
}
