import { html } from "./fw.js";
import { EventClass } from "./core/EventQueue_1.js";
import { Some } from "./monads/thames/index.js";
var $ = {
  events: new EventClass(),
  action: $Action,
  ebol: $Ebol,
};

export function $Action(
  name: string,
  handler: string | HTMLElement,
  callback: (...args: any[]) => any
) {
  // try {
    const cb2 = (...args: any[]) => callback(name, ...args)
    if (typeof handler == "string") {
      $.events.addListener(handler, cb2);
    } else handler.addEventListener("click", cb2);
  // } catch (e) {
  //   $.events.emit('internal:error', e)
  // } finally {
  //   $.events.emit('internal:complete')
  // }
}
export function $Ebol(a:any, b:any):any {
  return Some<any>(a).and(Some<any>(b)).unwrap()
}

$["action"] = $Action;
$["ebol"] = $Ebol;
export default $;
