import { writeFileSync } from "fs";
import {
  EmitState,
  HandlerItem,
  HandlerStatus,
  LogLevels,
  ResponseLevels,
} from "../../src/core/EventQueue_2.js";
import { EventEmitter2 } from "../../src/Events.js";
import { Logger } from "../../src/logger.js";
import { HEX_CHAR_LIST } from "../../src/core/types/constants_1.js";
import { mkRandStr2 } from "../../src/core/utils/common.js";

const __log = new Logger("Tests::003::Results");
let _state_ = {};

// // setup
// const EV0 = new EventEmitter2();
// const EV1 = new EventEmitter2();
// const EV2 = new EventEmitter2();
// const EV3 = new EventEmitter2();
// const EV4 = new EventEmitter2();

// [EV0, EV1, EV2, EV3, EV4].forEach((EVEM, index) => {
//   EVEM.setResponseLevel(ResponseLevels.Normal);
//   EVEM.setLogLevel(LogLevels.Silent);
//   EVEM.appendNewLogger(new Logger(`Tests::002::EVEM::${index}`));
// });

interface IListeners {
  [name: string]: HandlerItem
}

export class LogHandler extends EventEmitter2 {
  public readonly instanceId = mkRandStr2(8, HEX_CHAR_LIST);
  private __logger__ = new Logger(`LogHandler(${this.instanceId})`);
  private _listeners: IListeners  = {}
  public listeners  : IListeners  = {}

  // public setLogLevel(logLevel: LogLevels) {
  //   this.logLevel = logLevel;
  // }
  // public setResponseLevel(respLevel: ResponseLevels) {
  //   this.respLevel = respLevel;
  // }

  public resetListenersOveride() {
    return this.listeners = {...this._listeners}
  }

  public appendNewLogger(loggerClass: Logger) {
    return (this.__logger__ = loggerClass);
  }

  constructor() {
    super()
    super.setLogLevel(LogLevels.Silent)
    super.setResponseLevel(ResponseLevels.Normal)

    this._listeners["error"] = 
      super.on("__emitError", (err) => {
        this.__logger__.error(err)
      })

    this._listeners["warn"] = 
      super.on("__emitWarn", (err) => {
        this.__logger__.warn(err)
      })

    this._listeners["info"] = 
      super.on("__emitInfo", (err) => {
        this.__logger__.info(err)
      })
    
    this.listeners = {...this._listeners}
  }

  public __error(input) {return super.emit("__emitError", input)}
  public __warn (input) {return super.emit("__emitWarn",  input)}
  public __info (input) {return super.emit("__emitInfo",  input)}
}

async function main(): Promise<void> {
  const Handler = new LogHandler()

  // Handler.__info(Handler.listeners)

  Handler.listeners.error.handler ("(Direct handler call)")
  Handler.listeners.warn.handler  ("(Direct handler call)")
  Handler.listeners.info.handler  ("(Direct handler call)")

  Handler.__error ("(ErrorHandler helper method call)")
  Handler.__warn  ("(ErrorHandler helper method call)")
  Handler.__info  ("(ErrorHandler helper method call)")

  Handler.emit("__emitError", "(EventEmitter2 event call)")
  Handler.emit("__emitWarn",  "(EventEmitter2 event call)")
  Handler.emit("__emitInfo",  "(EventEmitter2 event call)")
  return
}

main()
// EV0.on("global::errHandler_::Error", (err) => {

// })