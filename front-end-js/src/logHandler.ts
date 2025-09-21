import {
  HandlerItem,
  LogLevels,
  ResponseLevels,
} from "./core/EventQueue_2.js";
import { EventEmitter2 } from "./Events.js";
import { Logger } from "./logger.js";
import { HEX_CHAR_LIST } from "./core/types/constants_1.js";
import { mkRandStr2 } from "./core/utils/common.js";

export interface IExtraFuncs {
  error?: (input:any) => {},
  info?: (input:any) => {},
  warn?: (input:any) => {},
  debug?: (input:any) => {},
}

interface IListeners {
  [name: string]: HandlerItem
}

export class LogHandler extends EventEmitter2 {
  public readonly instanceId = mkRandStr2(8, HEX_CHAR_LIST);
  private __logger__ = new Logger(`LogHandler(${this.instanceId})`);
  private _listeners: IListeners  = {}
  public listeners  : IListeners  = {}

  /**
   * Resets the overides applied to the listeners
   */
  public resetListenersOveride() {
    return this.listeners = {...this._listeners}
  }

  /**
   * Appends a different logger than the default
   */
  public appendNewLogger(loggerClass: Logger) {
    return (this.__logger__ = loggerClass);
  }

  constructor(extraFuncs?: IExtraFuncs) {
    if (extraFuncs == undefined) extraFuncs = {}

    super()
    super.setLogLevel(LogLevels.Silent)
    super.setResponseLevel(ResponseLevels.Normal)

    this._listeners["error"] = 
      super.on("__emitError", (err) => {
        this.__logger__.error(err)
        if(extraFuncs.error) extraFuncs.error(err)
      })
    this._listeners["warn"] = 
      super.on("__emitWarn", (err) => {
        this.__logger__.warn(err)
        if(extraFuncs.warn) extraFuncs.warn(err)
      })
    this._listeners["info"] = 
      super.on("__emitInfo", (err) => {
        this.__logger__.info(err)
        if(extraFuncs.info) extraFuncs.info(err)
      })
    this._listeners["debug"] = 
      super.on("__emitDebug", (err) => {
        this.__logger__.debug(err)
        if(extraFuncs.debug) extraFuncs.debug(err)
      })
    
    this.listeners = {...this._listeners}
  }

  /** * Helper method */
  public __error(input) {return super.emit("__emitError", input)}
  /** * Helper method */
  public __warn (input) {return super.emit("__emitWarn",  input)}
  /** * Helper method */
  public __info (input) {return super.emit("__emitInfo",  input)}
  /** * Helper method */
  public __debug(input) {return super.emit("__emitDebug", input)}
}