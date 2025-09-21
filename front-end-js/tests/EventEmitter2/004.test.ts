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
import { mkRandStr2, UniqueGen } from "../../src/core/utils/common.js";

const __log = new Logger("Tests::003::Results");
let _state_ = {};

interface IListeners {
  [name: string]: HandlerItem
}

const EV0 = new EventEmitter2();

_state_[EV0.instanceId] = {};

const h1 = EV0.on('signal_001', (datar, kanjer) => {
    _state_[EV0.instanceId]['signal_001'] = {};
    _state_[EV0.instanceId]['signal_001']['datar'] = datar;
    _state_[EV0.instanceId]['signal_001']['datar']['kanjer'] = kanjer
    // return datar
    return 'handler_001'
});
const h2 = EV0.on('signal_001', (datar, kanjer) => {
    _state_[EV0.instanceId]['signal_001_2'] = {};
    _state_[EV0.instanceId]['signal_001_2']['datar'] = datar;
    _state_[EV0.instanceId]['signal_001_2']['datar']['kanjer'] = kanjer
    // return datar
    return 'handler_002'
});
const h3 = EV0.once('signal_001', (datar, kanjer) => {
  _state_[EV0.instanceId]['signal_001_3'] = {};
  _state_[EV0.instanceId]['signal_001_3']['datar'] = datar;
  _state_[EV0.instanceId]['signal_001_3']['datar']['kanjer'] = kanjer
  // return datar
  return 'handler_003'
});
EV0.emit('signal_001', { tjoek: 'tjieke', tjak: 'tjak' }, 'kika').then((state) => {
    console.log({
        state,
        datar: _state_[EV0.instanceId]
    });
    for (const obj of state.obj.data) {
        console.log(obj);
    }

    console.log(state.HandlerState.results)
    console.log({h1,h2,h3})

    console.log('result_'+h1.index, state.HandlerState.results.on['result_'+h1.index])
    
});
