import { EventClass } from "./core/EventQueue_1.js";
import { Some } from "./monads/thames/index.js";
var $ = {
    events: new EventClass(),
    action: $Action,
    ebol: $Ebol,
};
export function $Action(name, handler, callback) {
    // try {
    const cb2 = (...args) => callback(name, ...args);
    if (typeof handler == "string") {
        $.events.addListener(handler, cb2);
    }
    else
        handler.addEventListener("click", cb2);
    // } catch (e) {
    //   $.events.emit('internal:error', e)
    // } finally {
    //   $.events.emit('internal:complete')
    // }
}
export function $Ebol(a, b) {
    return Some(a).and(Some(b)).unwrap();
}
$["action"] = $Action;
$["ebol"] = $Ebol;
export default $;
