import { writeFileSync } from "fs";
import {
  EmitState,
  HandlerStatus,
  LogLevels,
  ResponseLevels,
} from "../../src/core/EventQueue_2.js";
import { EventEmitter2 } from "../../src/Events.js";
import { Logger } from "../../src/logger.js";

const __log = new Logger("Tests::002::Results");
let _state_ = {};

// setup
const EV0 = new EventEmitter2();
const EV1 = new EventEmitter2();
const EV2 = new EventEmitter2();
const EV3 = new EventEmitter2();
const EV4 = new EventEmitter2();

[EV0, EV1, EV2, EV3, EV4].forEach((EVEM, index) => {
  EVEM.setResponseLevel(ResponseLevels.Normal);
  EVEM.setLogLevel(LogLevels.Silent);
  EVEM.appendNewLogger(new Logger(`Tests::002::EVEM::${index}`));
});

let ev1_dataCarryOver_local;
let ev1_dataCarryOver_global;

function test_dataCarryOver_local() {
  return new Promise((res, rej) => {
    let retOk = 0;
    let returned = {};
    let response;
    // // // // // // // // // // // // // // // // // // //
    const testName = "[EV1]<EventEmitter2>() test:data_carry_over<Local>";

    ev1_dataCarryOver_local = EV1.on("data_carry", (data1, data2) => {
      response = { data1, data2 };
    });
    EV1.emit(
      "data_carry",
      { testName, someOtherData: true },
      ev1_dataCarryOver_local
    )
      .then(
        (e) => {
          __log.info(constrRetVal(e, response));
          retOk++;
          returned["EV1"] = constrRetVal(e, response);
        },
        (e) => {
          __log.info(constrRetVal(e, response));
          returned["EV1"] = constrRetVal(e, response);
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, response));
        returned["EV1"] = constrRetVal(e, response);
      });
    if (retOk == 1) res(returned);
    else rej(returned);
  });
}
function test_dataCarryOver_global() {
  return new Promise((res, rej) => {
    let retOk = 0;
    let returned = {};
    let response;
    // // // // // // // // // // // // // // // // // // //
    const testName = "[EV1]<EventEmitter2>() test:data_carry_over<Global>";

    ev1_dataCarryOver_global = EV1.on("global::data_carry", (data1, data2) => {
      response = { data1, data2 };
      __log.info("EV1::<GlobalListener>(global::data_carry)", response)
    });
    EV0.emit(
      "global::data_carry",
      { testName, someOtherData: true },
      ev1_dataCarryOver_global
    )
      .then(
        (e) => {
          __log.info(constrRetVal(e, response));
          retOk++;
          returned["EV0"] = constrRetVal(e, response);
          __log.debug("EV0::<GlobalEmitter>(global::data_carry)::resolve", returned)
        },
        (e) => {
          __log.info(constrRetVal(e, response));
          returned["EV0"] = constrRetVal(e, response);
          __log.debug("EV0::<GlobalEmitter>(global::data_carry)::reject", returned)
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, response));
        returned["EV0"] = constrRetVal(e, response);
        __log.debug("EV0::<GlobalEmitter>(global::data_carry)::catch", returned)
      });
    __log.debug(returned, response)
    if (retOk == 1) res(returned);
    else rej(returned);
  });
}

async function main() {
  const _dataCarry_local = await test_dataCarryOver_local().catch((e) => e);
  const _dataCarry_global = await test_dataCarryOver_global().catch((e) => e);
  const result_string = JSON.stringify({
    metadata: {
      ids: {
        EV0: EV0.instanceId,
        EV1: EV1.instanceId,
        EV2: EV2.instanceId,
        EV3: EV3.instanceId,
        EV4: EV4.instanceId,
      },
      HandlerState_Statuses: {
        Ok: HandlerStatus.Ok,
        Error: HandlerStatus.Error,
        Global: HandlerStatus.Global,
        Unknown: HandlerStatus.Unknown,
      },
    },
    _dataCarry_local,
    _dataCarry_global,
  });
  console.log("end results:", result_string);
  console.log(
    writeFileSync(
      "./tests/EventEmitter2/002.results.json",
      result_string,
      "utf8"
    )
  );
  setTimeout(() => process.exit(0), 1000);
}

main();

// HELPER FUNCTIONS
function constrRetVal(_: EmitState, additive) {
  const _in = { ..._ };
  let _out = _in;
  _out["ListenerResponse"] = additive;
  return _out;
}