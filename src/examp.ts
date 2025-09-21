import {EventEmitter} from "node:events";

const _ = new EventEmitter();

_.on("a", () => console.log("a"))
_.on("a", () => console.log("b"))

_.off("a", () => console.log("a"))
