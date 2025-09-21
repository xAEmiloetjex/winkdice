import Utils, {Cookies, feTypings} from "./Utils.js"
import lodash from "https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm"

const tc = new feTypings()

export default class joemamaDB {
    #struct = {
        token: null,
        table: null
    }
    /**
     * 
     * @param {string} table 
     * @param {string} token 
     */
    constructor(table, token) {
        this.#struct.token = tc.striSync(token);
        this.#struct.table = tc.striSync(table);
    }
    async init() {
        await (await this.mappings()).Create(this.#struct.table)
    }
    async mappings() {
        const current = localStorage.getItem("joemamaDB_Mappings")
        if (current == null) localStorage.setItem("joemamaDB_Mappings", "{}")
        let mapping = JSON.parse(current)
        function Create(tableName) {
            const id = new Utils().makeid(8);
            const registryBank = "JMDB_t_"+id

            // if (mapping[tableName] && mapping[tableName].startsWith("JMDB")) return console.error("A table with that name already exists") 

            if (new Cookies().Check(registryBank)) return Create(tableName);
            else {
                mapping[tableName] = registryBank
                localStorage.setItem("joemamaDB_Mappings", JSON.stringify(mapping))
                new Cookies().Set(registryBank, JSON.stringify({}))
            }
        }
        function getMapping(tableName) {
            return mapping[tableName]
        }
        function getTable(tableName) {
            return new Cookies().Get(getMapping(tableName))
        }
        async function set(tableName, keyname, value) {
            const currTab = new Cookies().Get(getMapping(tableName));
            let table = JSON.parse(currTab)

            if (keyname.includes(".")) {
                const keySplit = keyname.split(".");
                const [result, exist] = get(tableName, keyname)
                
                let obj;
                if (result instanceof Object == false) {
                    obj = {}
                } else {
                    obj = result
                }
                const valueSet = lodash.set(
                    obj ?? {},
                    keySplit.slice(1).join("."),
                    value
                )
                table[keySplit[0]] = valueSet
            }
            else table[keyname] = value
            

            return new Cookies().Set(getMapping(tableName), JSON.stringify(table))
        }
        function get (tableName, keyname) {
            const val = new Cookies().Get(getMapping(tableName))[keyname]
            return [val == null ? null : val, val == null ? false : true];
        }
        function del(tableName, keyname) {
            const currTab = new Cookies().Get(getMapping(tableName));
            let table = JSON.parse(currTab)
            delete table[keyname]
            return new Cookies().Set(getMapping(tableName), JSON.stringify(table))
        }
        return {Create, getMapping, getTable, set, get, del}
    }
    async GetTable() {
        return (await this.mappings()).getTable(this.#struct.table)
    }
    async Set(keyname, value) {
        return await (await this.mappings()).set(this.#struct.table, keyname, value)
    }
    async Get(keyname) {
        if (keyname.includes(".")) {
            const keySplit = keyname.split(".")
            const [result] = (await this.mappings()).get(this.#struct.table, keySplit[0])
            return lodash.get(result, keySplit.slice(1).join("."))
        }

        const [result] = (await this.mappings()).get(this.#struct.table, keyname)
        return result
    }
    async Delete(keyname) {
        return (await this.mappings()).del(this.#struct.table, keyname)
    }
    
}