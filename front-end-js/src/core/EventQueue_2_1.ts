import { mkRandStr2 as mkrand_, removeFromArray, UniqueGen } from "./utils/common.js";
import { HEX_CHAR_LIST } from "./types/constants_1.js";
import { Logger } from "../logger.js";
import { type RestrictiveAny } from "../types.js";

export enum HandlerStatus {
  Ok,
  Error,
  Global,
  Unknown,
}

export enum LogLevels {
  Silent,
  Normal,
  Verbose,
}

export enum ResponseLevels {
  Normal,
  Verbose,
}

export interface T_glob_ {
  alt_evQueue: {
      constants: {
          EMIT_REMOVE_TIMEOUT: number;
          GLOBAL_QUEUE_SYNC_TIMEOUT: number;
          INTERNAL_GLOB_SYNC_OFFSET: number;
      };
      queue: Map<string, QueueItem[]>;
      queue_: QueueItem[];
  };
  globExecState: Map<string, RestrictiveAny[]>;
  stores: {
    [key:string]: RestrictiveAny
  };
  openStores: {
    [key:string]: RestrictiveAny
  };
}

export type TEvHandler = (...data: RestrictiveAny[]) => RestrictiveAny;

export interface EmitState {
  accessibleChildrenExecutorStates?: RestrictiveAny;
  HandlerState: HandlerState;
  obj: QueueItem;
}

export interface HandlerState {
  timestamp?: number;
  instance: string;
  status: HandlerStatus;
  err?: Error;
  results?: RestrictiveAny
}

/**
 * The `index` property is just an estimate
 */
export interface HandlerItem {
  name: string;
  handler: TEvHandler;
  ListenerId: string;
  index?: number
}

export interface QueueItem {
  emitId: string;
  name: string;
  data?: RestrictiveAny | RestrictiveAny[];
}

export interface IEvHandlerFunc {
  ListenerId: string;
  handler: TEvHandler;
}

export interface IOpts {
  byId: boolean;
}
export interface IRemLOpts extends IOpts {}

const colorHandler = {
  blue: (inp:RestrictiveAny) => <string>inp,
  yellow: (inp:RestrictiveAny) => <string>inp,
  red: (inp:RestrictiveAny) => <string>inp,
  green: (inp:RestrictiveAny) => <string>inp,
  magenta: (inp:RestrictiveAny) => <string>inp,
};

/**
 * @DEV
 ```ts
let _glob_ = {};

_glob_["alt_evQueue"] = {};
_glob_["alt_evQueue"]["constants"] = {
  EMIT_REMOVE_TIMEOUT: 100,
  GLOBAL_QUEUE_SYNC_TIMEOUT: 100,
  INTERNAL_GLOB_SYNC_OFFSET: 5,
};
// _glob_["alt_evQueue"]["on"] = new Map<string, IEvHandlerFunc[]>();
// _glob_["alt_evQueue"]["once"] = new Map<string, IEvHandlerFunc[]>();
_glob_["alt_evQueue"]["queue"] = new Map<string, RestrictiveAny[]>();
_glob_["alt_evQueue"]["queue_"] = [];

_glob_["globExecState"] = new Map<string, RestrictiveAny[]>();

_glob_["stores"] = {};
```
*/
function _glob_DEV(){}

let _glob_: T_glob_ = {
  alt_evQueue: {
    constants: {
      EMIT_REMOVE_TIMEOUT: 100,
      GLOBAL_QUEUE_SYNC_TIMEOUT: 100,
      INTERNAL_GLOB_SYNC_OFFSET: 5,
    },
    queue: new Map<string, QueueItem[]>(),
    queue_: []
  },
  globExecState: new Map<string, RestrictiveAny[]>(),
  stores: {},
  openStores: {}
};

// _glob_["alt_evQueue"]["on"] = new Map<string, IEvHandlerFunc[]>();
// _glob_["alt_evQueue"]["once"] = new Map<string, IEvHandlerFunc[]>();


const DEFAULTS = {
  LOGLEVEL: LogLevels.Normal,
  RESPLEVEL: ResponseLevels.Normal,
};

/**
 * @function SyncLoop
 *
 * Used to synchronize the global queues into one main global queue
 */
function SyncLoop() {
  return setInterval(() => {
    const queues: Map<string, QueueItem[]> = _glob_.alt_evQueue.queue;
    // const main: RestrictiveAny[] = _glob_["alt_evQueue"]["queue_"]

    const __: QueueItem[] = [];

    queues.forEach((v, _k) => {
      v.forEach((v_) => __.push(v_));
    });

    _glob_.alt_evQueue.queue_ = __;
  }, _glob_.alt_evQueue.constants.GLOBAL_QUEUE_SYNC_TIMEOUT);
}

function mkRandStr2(length_:number, charlist:string) {
  return UniqueGen((length:number) => mkrand_(length, charlist), length_)
}

/**
 * The back-end of the EventEmitter2 class,
 * Usually it's not recommended to interact with this directly
 * since the EventEmitter2 class is there to provide a fixed layout to this class that may change majorly over time
 */
export class EventQueue {
  public readonly instanceId = mkRandStr2(8, HEX_CHAR_LIST);
  public readonly queue: QueueItem[] = [];
  private globQueue: QueueItem[] = [];
  private executedGlobals: QueueItem[] = [];
  private handlers = new Map<string, IEvHandlerFunc[]>();
  private oneTimeHandlers = new Map<string, IEvHandlerFunc[]>();
  private _logger_ = new Logger("EventEmitter_v2", console, colorHandler);

  public logLevel: LogLevels = DEFAULTS.LOGLEVEL;
  public respLevel: ResponseLevels = DEFAULTS.RESPLEVEL;

  public setLogLevel(logLevel: LogLevels) {
    this.logLevel = logLevel;
  }
  public setResponseLevel(respLevel: ResponseLevels) {
    this.respLevel = respLevel;
  }

  public appendNewLogger(loggerClass: Logger) {
    return (this._logger_ = loggerClass);
  }

  constructor() {
    _glob_.stores[this.instanceId] = {};
    // _glob_["stores"][this.instanceId]["execGlobs"] = {}
    // setInterval(() => {
    //   this.globQueue = _glob_["alt_evQueue"]["queue_"];
    //   this.executedGlobals = [];
    // }, _glob_.alt_evQueue.constants.GLOBAL_QUEUE_SYNC_TIMEOUT + _glob_.alt_evQueue.constants.INTERNAL_GLOB_SYNC_OFFSET);

    const { GLOBAL_QUEUE_SYNC_TIMEOUT, INTERNAL_GLOB_SYNC_OFFSET } =
      _glob_.alt_evQueue.constants;

    setInterval(() => {
      this.globQueue = [..._glob_.alt_evQueue.queue_]; // Creates a shallow copy to prevent unintended mutations
      this.executedGlobals.length = 0; // Resets the array more efficiently
    }, GLOBAL_QUEUE_SYNC_TIMEOUT + INTERNAL_GLOB_SYNC_OFFSET);

    setInterval(() => {
      if (this.globQueue.length < 1) return;
      else {
        const obj = this.globQueue[this.globQueue.length - 1];
        const { emitId, name, data } = obj;

        if (this.logLevel != LogLevels.Silent)
          this._logger_.warn("Globals are experimental!");

        // if (this.logLevel == LogLevels.verbose)
        //   this._logger_.debug({
        //     globStores: _glob_["stores"],
        //     isAlreadyInExecGlobs: this.getStore("execGlobs", obj)._result,
        //     obj,
        //   })

        if (this.getStore("execGlobs", obj)._result == false) {
          let stateHolder: RestrictiveAny[] = [];
          if (_glob_.globExecState.has(emitId))
            stateHolder = _glob_.globExecState.get(emitId) ?? [];
          const ___ = this.Handle(name, data);
          stateHolder.push(___);
          _glob_.globExecState.set(emitId, stateHolder);
          if (___.status == HandlerStatus.Error) {
            this._logger_.error("EventHandlerError", ___);
          }
        }
        this.globQueue.pop();
        // this.executedGlobals.push(obj);
        this.pushStore("execGlobs", obj);
      }
    }, 0);
  }

  private pushStore(name: string, data: RestrictiveAny | RestrictiveAny[]) {
    
    if (!_glob_.stores[this.instanceId][name])
    
      _glob_.stores[this.instanceId][name] = {};
    
    const _in = { ..._glob_.stores[this.instanceId][name] };
    let _out = _in;
    _out[JSON.stringify(data)] = true;
    
    _glob_.stores[this.instanceId][name] = _out;
    return {
      _out,
    
      store: _glob_.stores[this.instanceId][name],
    };
  }
  private getStore(name: string, data: RestrictiveAny | RestrictiveAny[]) {
    
    if (!_glob_.stores[this.instanceId][name])
    
      _glob_.stores[this.instanceId][name] = {};
    
    const _in = { ..._glob_.stores[this.instanceId][name] };
    let _out = _in;
    let _result =
      _out[JSON.stringify(data)] !== undefined
        ? _out[JSON.stringify(data)]
        : false;
    return {
      _result,
      _out,
    
      store: _glob_.stores[this.instanceId][name],
    };
  }
  private removeStore(name: string, data: RestrictiveAny | RestrictiveAny[]) {
    
    if (!_glob_.stores[this.instanceId][name])
    
      _glob_.stores[this.instanceId][name] = {};
    
    const _in = { ..._glob_.stores[this.instanceId][name] };
    let _out = _in;
    delete _out[JSON.stringify(data)];
    
    _glob_.stores[this.instanceId][name] = _out;
    return {
      _out,
    
      store: _glob_.stores[this.instanceId][name],
    };
  }

  public openStore = {
    push(name: string, data: RestrictiveAny | RestrictiveAny[]): any/* Will fix later */ {
    
      if (!_glob_.openStores[this.instanceId][name])
    
        _glob_.openStores[this.instanceId][name] = {};
    
      const _in = { ..._glob_.openStores[this.instanceId][name] };
      // Will fix later
      let _out: any/* Will fix later */ = _in;
      _out[JSON.stringify(data)] = true;
    
      _glob_.openStores[this.instanceId][name] = _out;
      return {
        _out,
    
        store: _glob_.openStores[this.instanceId][name],
      };
    },
    get(name: string, data: RestrictiveAny | RestrictiveAny[]): any/* Will fix later */ {
    
      if (!_glob_.openStores[this.instanceId][name])
    
        _glob_.openStores[this.instanceId][name] = {};
    
      const _in = { ..._glob_.openStores[this.instanceId][name] };
      let _out = _in;
      let _result =
        _out[JSON.stringify(data)] !== undefined
          ? _out[JSON.stringify(data)]
          : false;
      return {
        _result,
        _out,
    
        store: _glob_.openStores[this.instanceId][name],
      };
    },
    remove(name: string, data: RestrictiveAny | RestrictiveAny[]): any/* Will fix later */ {
    
      if (!_glob_.openStores[this.instanceId][name])
    
        _glob_.openStores[this.instanceId][name] = {};
    
      const _in = { ..._glob_.openStores[this.instanceId][name] };
      let _out: any/* Will fix later */ = _in;
      delete _out[JSON.stringify(data)];
    
      _glob_.openStores[this.instanceId][name] = _out;
      return {
        _out,
    
        store: _glob_.openStores[this.instanceId][name],
      };
    }
  }

  public logGlob() {
    console.log(_glob_);
  }

/**
 * The `index` property is just an estimate
 */
  public addSingleUseListener(
    name: string,
    handler: TEvHandler
  ): HandlerItem {
    const ListenerId = mkRandStr2(16, HEX_CHAR_LIST);
    let handlers: any|any[]/* Will fix later */ = [];

    // if (name.startsWith("global::")) {

    //   // if (this.logLevel != LogLevels.silent) this._logger_.warn("Globals are experimental!")
    //   // if (_glob_["alt_evQueue"]["once"].has(name))
    //   //   handlers = _glob_["alt_evQueue"]["once"].get(name);
    //   // handlers.push({ handler });
    //   // _glob_["alt_evQueue"]["once"].set(name, handlers);
    //   this._logger_.warn(
    //     "singleUse listeners are bugged in the global scope.\n",
    //     "however they are not in the local scope,\n",
    //     "to preserve your listener it's still available locally.\n",
    //     "if you want a listener to be single use in the global scope,\n",
    //     "You will have to manually block execution after the first time, a simple if statement can provide this\n",
    //     "Example:\n\n",
    //     "var singleUseHandlerState = false\n",
    //     "eventEmitter.on(\'global::EventName\', () => {\n",
    //     "   singleUseHandlerState = true;\n",
    //     "   console.log(\'Hello, World!\');\n",
    //     "});"
    //   )
    // } //else {
    if (this.oneTimeHandlers.has(name))
      handlers = this.oneTimeHandlers.get(name);
    handlers.push({ ListenerId, handler });
    this.oneTimeHandlers.set(name, handlers);

    return {
      name,
      handler,
      ListenerId,
      index: handlers.length
    };
    //}
  }
  /**
 * The `index` property is just an estimate
 */
  public addListener(
    name: string,
    handler: TEvHandler
  ): HandlerItem {
    const ListenerId = mkRandStr2(16, HEX_CHAR_LIST);
    let handlers: any|any[]/* Will fix later */ = [];

    // if (name.startsWith("global::")) {
    //   if (this.logLevel != LogLevels.silent) this._logger_.warn("Globals are experimental!")
    //   if (_glob_["alt_evQueue"]["on"].has(name))
    //     handlers = _glob_["alt_evQueue"]["on"].get(name);
    //   handlers.push({ ListenerId, handler });
    //   _glob_["alt_evQueue"]["on"].set(name, handlers);
    // } else {
    if (this.handlers.has(name)) handlers = this.handlers.get(name);
    handlers.push({ ListenerId, handler });
    this.handlers.set(name, handlers);
    // }

    return {
      name,
      handler,
      ListenerId,
      index: handlers.length
    };
  }

  public removeListener(
    name: string,
    listeners: string | TEvHandler | string[] | TEvHandler[],
    opts?: IRemLOpts
  ) {
    let opts_ = {};
    
    if (!opts) opts_["byId"] = false;
    
    else if (!opts.byId) opts_["byId"] = false;
    
    else if (typeof opts["byId"] !== "boolean") opts_["byId"] = false;
    else opts_ = opts;
    // const isGlobal = name.startsWith("global::")

    
    const Process = (_listener) => {
      let handlers: IEvHandlerFunc[] = [];
      let arr2 = [];

    
      if (this.handlers.has(name)) handlers = this.handlers.get(name);
      else return this._logger_.error("No valid event ID was provided.");

      for (const handle of handlers) {
    
        if (opts_["byId"] == true && handle.ListenerId !== _listener)
          arr2.push(handle);
    
        if (opts_["byId"] !== true && handle.handler !== _listener)
          arr2.push(handle);
      }
      this.handlers.set(name, arr2);
    };

    if (Array.isArray(listeners)) {
      for (const listen of listeners) {
        Process(listen);
      }
    } else Process(listeners);
  }
  public removeAllListeners(name: string) {
    this.handlers.delete(name);
  }

  public emit(name: string, ..._data: RestrictiveAny[]): Promise<EmitState> {
    return new Promise((resolve, reject) => {
      const obj = {
        emitId: mkRandStr2(16, HEX_CHAR_LIST),
        name,
        data: _data ? _data : undefined,
      };
      if (name.startsWith("global::")) {
        if (this.logLevel != LogLevels.Silent)
          this._logger_.warn("Globals are experimental!");
        let internalQueue = [];

        if (_glob_.alt_evQueue.queue.has(this.instanceId))
    
          internalQueue = _glob_.alt_evQueue.queue.get(this.instanceId);

        internalQueue.push(obj);

        _glob_.alt_evQueue.queue.set(this.instanceId, internalQueue);

        setTimeout(() => {
          const queueArr_: Map<string, RestrictiveAny[]> = _glob_.alt_evQueue.queue;
          const queueArr = queueArr_.get(this.instanceId);
          queueArr_.set(
            this.instanceId,
    
            queueArr.filter((elem) => elem != obj)
          );
          this.removeStore("execGlobs", obj)
          // if (isOnce) {
          //   _glob_["alt_evQueue"]["once"].delete(name);
          // }
          resolve({
            accessibleChildrenExecutorStates: _glob_.globExecState.get(
              obj.emitId
            ),
            HandlerState: {
              instance: this.instanceId,
              status: HandlerStatus.Global,
            },
            obj,
          });
        }, _glob_.alt_evQueue.constants.EMIT_REMOVE_TIMEOUT);
      } else {
        // this.queue.push(obj)
        const handler__ = this.Handle(obj.name, obj.data);

        if (handler__.status == HandlerStatus.Ok)
          resolve({
            HandlerState: handler__,
            obj,
          });
        else
          reject({
            HandlerState: handler__,
            obj,
          });
      }
    });
  }
  private Handle(name: string, data: any): HandlerState {
    const RL_IsVerbose = this.respLevel == ResponseLevels.Verbose;

    let doesntExist = false;
    let _on_c = 0;
    let _once_c = 0;

    try {
      let handled = {
        on: {},
        once: {}
      }
      // if (name.startsWith("global::")) {
      //   if (_glob_["alt_evQueue"]["on"].has(name)) {
      //     const handlers = _glob_["alt_evQueue"]["on"].get(name);
      //     for (const handelen of handlers) {
      //       handelen.handler(data);
      //     }
      //   }
      //   if (_glob_["alt_evQueue"]["once"].has(name)) {
      //     const handlers = _glob_["alt_evQueue"]["once"].get(name);
      //     for (const handelen of handlers) {
      //       handelen.handler(data);
      //     }
      //   }
      // } else {
      if (!this.handlers.has(name) && !this.oneTimeHandlers.has(name))
        doesntExist = true;
      if (this.handlers.has(name)) {
        const handlers = this.handlers.get(name);
    
        for (const handelen of handlers) {
          _on_c++;
    
          if (Array.isArray(data)) handled.on["result_"+_on_c] = handelen.handler(...data)
    
          else handled.on["result_"+_on_c] = handelen.handler(data);
        }
      }
      if (this.oneTimeHandlers.has(name)) {
        const handlers = this.oneTimeHandlers.get(name);
    
        for (const handelen of handlers) {
          _once_c++;
    
          if (Array.isArray(data)) handled.once["result_"+_once_c]=handelen.handler(...data)
    
          else handled.once["result_"+_once_c]=handelen.handler(data);
        }
        this.oneTimeHandlers.delete(name);
      }

      if (doesntExist == true || (_on_c < 1 && _once_c < 1))
        return {
          timestamp: RL_IsVerbose == true ? Date.now() : undefined,
          instance: this.instanceId,
          status: HandlerStatus.Unknown,
          err:
            RL_IsVerbose == true
              ? {
                  name: "NoHandlerState",
                  message:
                    "No handler is found, therefore this call is ignored (this is not an actual error, just a state)",
                }
              : undefined,
        };
      // }
      if (this.logLevel == LogLevels.Verbose)
        this._logger_.debug({
          name,
          data,
          state: {
            status: HandlerStatus.Ok,
          },
        });
      return {
        timestamp: RL_IsVerbose == true ? Date.now() : undefined,
        instance: this.instanceId,
        status: HandlerStatus.Ok,
        results: handled
      };
    } catch (e) {
    
      this._logger_.error(e);
      if (this.logLevel == LogLevels.Verbose)
        this._logger_.debug({
          name,
          data,
          state: {
            instance: this.instanceId,
            status: HandlerStatus.Error,
            err: e,
          },
        });
      return {
        timestamp: RL_IsVerbose == true ? Date.now() : undefined,
        instance: this.instanceId,
        status: HandlerStatus.Error,
    
        err: e,
      };
    }
  }
}

SyncLoop();
