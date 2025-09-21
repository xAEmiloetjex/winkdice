import { writeFileSync } from "fs";
import { EmitState, HandlerStatus, LogLevels, ResponseLevels } from "../../src/core/EventQueue_2.js";
import { EventEmitter2 } from "../../src/Events.js";
import { Logger } from "../../src/logger.js";

const __log = new Logger("Tests::001::Results");
let state = {};

// setup
const EV0 = new EventEmitter2();
const EV1 = new EventEmitter2();
const EV2 = new EventEmitter2();
const EV3 = new EventEmitter2();
const EV4 = new EventEmitter2();

[EV0, EV1, EV2, EV3, EV4].forEach((EVEM, index) => {
  EVEM.setResponseLevel(ResponseLevels.Normal)
  EVEM.setLogLevel(LogLevels.Silent);
  EVEM.appendNewLogger(new Logger(`Tests::001::EVEM::${index}`));
});

// def_vars

let ev1_on_local;
let ev2_on_local;
let ev3_on_local;
let ev4_on_local;

let ev1_on_global;
let ev2_on_global;
let ev3_on_global;
let ev4_on_global;

let ev1_once_local;
let ev2_once_local;
let ev3_once_local;
let ev4_once_local;

let ev1_once_global;
let ev2_once_global;
let ev3_once_global;
let ev4_once_global;

function test_on_local() {
  return new Promise((res, rej) => {
    let retOk = 0;
    let returned = {};
    // // // // // // // // // // // // // // // // // // //
    const testName = "[EV1...EV4]<EventEmitter2>() test:on<Local>";

    console.log("\n-\n-\n-", testName, "\n-\n-\n-");

    ev1_on_local = EV1.on("signal_1", () => {
      __log.info(`{${testName}}::EV1`);
      return `{${testName}}::EV1`
    });
    ev2_on_local = EV2.on("signal_1", () => {
      __log.info(`{${testName}}::EV2`);
      return `{${testName}}::EV2`
    });
    ev3_on_local = EV3.on("signal_1", () => {
      __log.info(`{${testName}}::EV3`);
      return `{${testName}}::EV3`
    });
    ev4_on_local = EV4.on("signal_1", () => {
      __log.info(`{${testName}}::EV4`);
      return `{${testName}}::EV4`
    });

    EV1.emit("signal_1")
      .then(
        (e) => {
          __log.info(constrRetVal(e, ev1_on_local));
          retOk++;
          returned["EV1"] = constrRetVal(e, ev1_on_local);
        },
        (e) => {
          __log.info(constrRetVal(e, ev1_on_local));
          returned["EV1"] = constrRetVal(e, ev1_on_local);
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, ev1_on_local));
        returned["EV1"] = constrRetVal(e, ev1_on_local);
      });
    EV2.emit("signal_1")
      .then(
        (e) => {
          __log.info(constrRetVal(e, ev2_on_local));
          retOk++;
          returned["EV2"] = constrRetVal(e, ev2_on_local);
        },
        (e) => {
          __log.info(constrRetVal(e, ev2_on_local));
          returned["EV2"] = constrRetVal(e, ev2_on_local);
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, ev2_on_local));
        returned["EV2"] = constrRetVal(e, ev2_on_local);
      });
    EV3.emit("signal_1")
      .then(
        (e) => {
          __log.info(constrRetVal(e, ev3_on_local));
          retOk++;
          returned["EV3"] = constrRetVal(e, ev3_on_local);
        },
        (e) => {
          __log.info(constrRetVal(e, ev3_on_local));
          returned["EV3"] = constrRetVal(e, ev3_on_local);
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, ev3_on_local));
        returned["EV3"] = constrRetVal(e, ev3_on_local);
      });
    EV4.emit("signal_1")
      .then(
        (e) => {
          __log.info(constrRetVal(e, ev4_on_local));
          retOk++;
          returned["EV4"] = constrRetVal(e, ev4_on_local);
        },
        (e) => {
          __log.info(constrRetVal(e, ev4_on_local));
          returned["EV4"] = constrRetVal(e, ev4_on_local);
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, ev4_on_local));
        returned["EV4"] = constrRetVal(e, ev4_on_local);
      });

    if (retOk == 4) res(returned);
    else rej(returned);
  });
}

function test_on_global() {
  return new Promise((res, rej) => {
    // // // // // // // // // // // // // // // // // // //
    const testName = "[EV1...EV4]<EventEmitter2>() test:on<Global>";

    console.log("\n-\n-\n-", testName, "\n-\n-\n-");

    ev1_on_global = EV1.on("global::signal_1", () => {
      __log.info(`{${testName}}::EV1`);
      return `{${testName}}::EV1`
    });
    ev2_on_global = EV2.on("global::signal_1", () => {
      __log.info(`{${testName}}::EV2`);
      return `{${testName}}::EV2`
    });
    ev3_on_global = EV3.on("global::signal_1", () => {
      __log.info(`{${testName}}::EV3`);
      return `{${testName}}::EV3`
    });
    ev4_on_global = EV4.on("global::signal_1", () => {
      __log.info(`{${testName}}::EV4`);
      return `{${testName}}::EV4`
    });

    const additive_ = {
      ev1_on_global,
      ev2_on_global,
      ev3_on_global,
      ev4_on_global,
    };
    EV0.emit("global::signal_1")
      .then(
        (e) => {
          __log.info(constrRetVal(e, additive_));
          res(constrRetVal(e, additive_));
        },
        (e) => {
          __log.info(constrRetVal(e, additive_));
          rej(constrRetVal(e, additive_));
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, additive_));
        rej(constrRetVal(e, additive_));
      });
  });
}
function test_once_local() {
  return new Promise((res, rej) => {
    let retOk = 0;
    let returned = {};
    returned["exec1"] = {}
    returned["exec2"] = {}
    // // // // // // // // // // // // // // // // // // //
    const testName = "[EV1...EV4]<EventEmitter2>() test:once<Local>";

    console.log("\n-\n-\n-", testName, "\n-\n-\n-");

    state["test:once_Local_count"] = {
      ev1: 0,
      ev2: 0,
      ev3: 0,
      ev4: 0,
    };

    ev1_once_local = EV1.once("signal_2", () => {
      state["test:once_Local_count"]["ev1"] += 1;
      __log.info(`{${testName}}::EV1`);
      return `{${testName}}::EV1`
    });
    ev2_once_local = EV2.once("signal_2", () => {
      state["test:once_Local_count"]["ev2"] += 1;
      __log.info(`{${testName}}::EV2`);
      return `{${testName}}::EV2`
    });
    ev3_once_local = EV3.once("signal_2", () => {
      state["test:once_Local_count"]["ev3"] += 1;
      __log.info(`{${testName}}::EV3`);
      return `{${testName}}::EV3`
    });
    ev4_once_local = EV4.once("signal_2", () => {
      state["test:once_Local_count"]["ev4"] += 1;
      __log.info(`{${testName}}::EV4`);
      return `{${testName}}::EV4`
    });

    console.log("\n-", "Exec 1", "\n-");

    EV1.emit("signal_2")
      .then(
        (e) => {
          __log.info(constrRetVal(e, ev1_once_local));
          retOk++;
          returned["exec1"]["EV1"] = constrRetVal(e, ev1_once_local);
        },
        (e) => {
          __log.info(constrRetVal(e, ev1_once_local));
          returned["exec1"]["EV1"] = constrRetVal(e, ev1_once_local);
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, ev1_once_local));
        returned["exec1"]["EV1"] = constrRetVal(e, ev1_once_local);
      });
    EV2.emit("signal_2")
      .then(
        (e) => {
          __log.info(constrRetVal(e, ev2_once_local));
          retOk++;
          returned["exec1"]["EV2"] = constrRetVal(e, ev2_once_local);
        },
        (e) => {
          __log.info(constrRetVal(e, ev2_once_local));
          returned["exec1"]["EV2"] = constrRetVal(e, ev2_once_local);
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, ev2_once_local));
        returned["exec1"]["EV2"] = constrRetVal(e, ev2_once_local);
      });
    EV3.emit("signal_2")
      .then(
        (e) => {
          __log.info(constrRetVal(e, ev3_once_local));
          retOk++;
          returned["exec1"]["EV3"] = constrRetVal(e, ev3_once_local);
        },
        (e) => {
          __log.info(constrRetVal(e, ev3_once_local));
          returned["exec1"]["EV3"] = constrRetVal(e, ev3_once_local);
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, ev3_once_local));
        returned["exec1"]["EV3"] = constrRetVal(e, ev3_once_local);
      });
    EV4.emit("signal_2")
      .then(
        (e) => {
          __log.info(constrRetVal(e, ev4_once_local));
          retOk++;
          returned["exec1"]["EV4"] = constrRetVal(e, ev4_once_local);
        },
        (e) => {
          __log.info(constrRetVal(e, ev4_once_local));
          returned["exec1"]["EV4"] = constrRetVal(e, ev4_once_local);
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, ev4_once_local));
        returned["exec1"]["EV4"] = constrRetVal(e, ev4_once_local);
      });
    console.log("Executions:", state["test:once_Local_count"]);
    console.log("\n-", "Exec 2", "\n-");
    EV1.emit("signal_2")
      .then(
        (e) => {
          __log.info(constrRetVal(e, ev1_once_local));
          retOk++;
          returned["exec2"]["EV1"] = constrRetVal(e, ev1_once_local);
        },
        (e) => {
          __log.info(constrRetVal(e, ev1_once_local));
          returned["exec2"]["EV1"] = constrRetVal(e, ev1_once_local);
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, ev1_once_local));
        returned["exec2"]["EV1"] = constrRetVal(e, ev1_once_local);
      });
    EV2.emit("signal_2")
      .then(
        (e) => {
          __log.info(constrRetVal(e, ev2_once_local));
          retOk++;
          returned["exec2"]["EV2"] = constrRetVal(e, ev2_once_local);
        },
        (e) => {
          __log.info(constrRetVal(e, ev2_once_local));
          returned["exec2"]["EV2"] = constrRetVal(e, ev2_once_local);
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, ev2_once_local));
        returned["exec2"]["EV2"] = constrRetVal(e, ev2_once_local);
      });
    EV3.emit("signal_2")
      .then(
        (e) => {
          __log.info(constrRetVal(e, ev3_once_local));
          retOk++;
          returned["exec2"]["EV3"] = constrRetVal(e, ev3_once_local);
        },
        (e) => {
          __log.info(constrRetVal(e, ev3_once_local));
          returned["exec2"]["EV3"] = constrRetVal(e, ev3_once_local);
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, ev3_once_local));
        returned["exec2"]["EV3"] = constrRetVal(e, ev3_once_local);
      });
    EV4.emit("signal_2")
      .then(
        (e) => {
          __log.info(constrRetVal(e, ev4_once_local));
          retOk++;
          returned["exec2"]["EV4"] = constrRetVal(e, ev4_once_local);
        },
        (e) => {
          __log.info(constrRetVal(e, ev4_once_local));
          returned["exec2"]["EV4"] = constrRetVal(e, ev4_once_local);
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, ev4_once_local));
        returned["exec2"]["EV4"] = constrRetVal(e, ev4_once_local);
      });
    console.log("Executions:", state["test:once_Local_count"]);
    if (retOk == 8) res(returned);
    else rej(returned);
  });
}
function test_once_global() {
  return new Promise((res, rej) => {
    let retOk = 0;
    let returned = {};
    // // // // // // // // // // // // // // // // // // //
    const testName = "[EV1...EV4]<EventEmitter2>() test:once<Global>";

    console.log("\n-\n-\n-", testName, "\n-\n-\n-");

    state["test:once_Global_count"] = {
      ev1: 0,
      ev2: 0,
      ev3: 0,
      ev4: 0,
    };

    ev1_once_global = EV1.once("global::signal_2", () => {
      state["test:once_Global_count"]["ev1"] += 1;
      __log.info(`{${testName}}::EV1`);
      return `{${testName}}::EV1`
    });
    ev2_once_global = EV2.once("global::signal_2", () => {
      state["test:once_Global_count"]["ev2"] += 1;
      __log.info(`{${testName}}::EV2`);
      return `{${testName}}::EV2`
    });
    ev3_once_global = EV3.once("global::signal_2", () => {
      state["test:once_Global_count"]["ev3"] += 1;
      // throw {
      //   name: "TestError",
      //   message: "This error is returned because i wanted to!",
      //   stack: ""
      // }
      __log.info(`{${testName}}::EV3`);
      return `{${testName}}::EV3`
    });
    ev4_once_global = EV4.once("global::signal_2", () => {
      state["test:once_Global_count"]["ev4"] += 1;
      __log.info(`{${testName}}::EV4`);
      return `{${testName}}::EV4`
    });

    const additive__ = {
      ev1_once_global,
      ev2_once_global,
      ev3_once_global,
      ev4_once_global,
    };
    console.log("\n-", "Exec 1", "\n-");
    EV0.emit("global::signal_2")
      .then(
        (e) => {
          __log.info(constrRetVal(e, additive__));
          retOk++;
          returned["exec1"] = constrRetVal(e, additive__);
        },
        (e) => {
          __log.info(constrRetVal(e, additive__));
          returned["exec1"] = constrRetVal(e, additive__);
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, additive__));
        returned["exec1"] = constrRetVal(e, additive__);
      });
    // returned["exec1"]["unixTimestamp"] = Date.now()
    console.log("Executions:", state["test:once_Global_count"]);

    console.log("\n-", "Exec 2", "\n-");
    EV0.emit("global::signal_2")
      .then(
        (e) => {
          __log.info(constrRetVal(e, additive__));
          retOk++;
          returned["exec2"] = constrRetVal(e, additive__);
        },
        (e) => {
          __log.info(constrRetVal(e, additive__));
          returned["exec2"] = constrRetVal(e, additive__);
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, additive__));
        returned["exec2"] = constrRetVal(e, additive__);
      });
    // returned["exec2"]["unixTimestamp"] = Date.now()
    console.log("Executions:", state["test:once_Global_count"]);
    if (retOk == 2)
      res({ returned, globalCount: state["test:once_Global_count"] });
    else rej({ returned, globalCount: state["test:once_Global_count"] });
  });
}
function test_off_local() {
  return new Promise((res, rej) => {
    let retOk = 0;
    let returned = {};
    // // // // // // // // // // // // // // // // // // //
    const testName = "[EV1...EV4]<EventEmitter2>() test:off<Local>";

    console.log("\n-\n-\n-", testName, "\n-\n-\n-");

    EV2.off("signal_1", ev2_on_local.ListenerId, { byId: true });

    EV1.emit("signal_1")
      .then(
        (e) => {
          __log.info(constrRetVal(e, ev1_on_local));
          retOk++;
          returned["EV1"] = constrRetVal(e, ev1_on_local);
        },
        (e) => {
          __log.info(constrRetVal(e, ev1_on_local));
          returned["EV1"] = constrRetVal(e, ev1_on_local);
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, ev1_on_local));
        returned["EV1"] = constrRetVal(e, ev1_on_local);
      });
    EV2.emit("signal_1")
      .then(
        (e) => {
          __log.info(constrRetVal(e, ev2_on_local));
          retOk++;
          returned["EV2"] = constrRetVal(e, {...ev2_on_local, then_ver: "resolve"});
        },
        (e) => {
          __log.info(constrRetVal(e, ev2_on_local));
          returned["EV2"] = constrRetVal(e, {...ev2_on_local, then_ver: "reject"});
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, ev2_on_local));
        returned["EV2"] = constrRetVal(e, ev2_on_local);
      });
    EV3.emit("signal_1")
      .then(
        (e) => {
          __log.info(constrRetVal(e, ev3_on_local));
          retOk++;
          returned["EV3"] = constrRetVal(e, ev3_on_local);
        },
        (e) => {
          __log.info(constrRetVal(e, ev3_on_local));
          returned["EV3"] = constrRetVal(e, ev3_on_local);
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, ev3_on_local));
        returned["EV3"] = constrRetVal(e, ev3_on_local);
      });
    EV4.emit("signal_1")
      .then(
        (e) => {
          __log.info(constrRetVal(e, ev4_on_local));
          retOk++;
          returned["EV4"] = constrRetVal(e, ev4_on_local);
        },
        (e) => {
          __log.info(constrRetVal(e, ev4_on_local));
          returned["EV4"] = constrRetVal(e, ev4_on_local);
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, ev4_on_local));
        returned["EV4"] = constrRetVal(e, ev4_on_local);
      });

    if (retOk == 4) res(returned);
    else rej(returned);
  });
}
function test_off_global() {
  return new Promise((res, rej) => {
    // // // // // // // // // // // // // // // // // // //
    const testName = "[EV1...EV4]<EventEmitter2>() test:off<Global>";

    console.log("\n-\n-\n-", testName, "\n-\n-\n-");

    EV2.off("global::signal_1", ev2_on_global.ListenerId, { byId: true });

    const additive___ = {
      ev1_on_global,
      ev2_on_global,
      ev3_on_global,
      ev4_on_global,
    };
    EV0.emit("global::signal_1")
      .then(
        (e) => {
          __log.info(constrRetVal(e, additive___));
          res(constrRetVal(e, additive___));
        },
        (e) => {
          __log.info(constrRetVal(e, additive___));
          rej(constrRetVal(e, additive___));
        }
      )
      .catch((e) => {
        __log.info(constrRetVal(e, additive___));
        rej(constrRetVal(e, additive___));
      });
  });
}

async function main() {
  const start = Date.now();
  const _on_local = await test_on_local().catch((e) => e);
  const _on_global = await test_on_global().catch((e) => e);
  const _once_local = await test_once_local().catch((e) => e);
  const _once_global = await test_once_global().catch((e) => e);
  const _off_local = await test_off_local().catch((e) => e);
  const _off_global = await test_off_global().catch((e) => e);
  const end = Date.now()

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
        Ok:     HandlerStatus.Ok,
        Error:  HandlerStatus.Error,
        Global: HandlerStatus.Global,
        Unknown: HandlerStatus.Unknown,
      },
      // enums: {
      //   HandlerStatus: {
      //     corresponding_to: "metadata.HandlerState_Statuses",
      //     value: HandlerStatus
      //   }
      // },

    },
    _on_local,
    _on_global,
    _once_local,
    _once_global,
    _off_local,
    _off_global,
  })
  console.log("end results:", result_string);
  console.log(writeFileSync("./tests/EventEmitter2/001.results.json", result_string, "utf8"))
  console.log('\n\n------------\nThis Took:',end - start, 'ms.\n------------\n')
  setTimeout(() => process.exit(0), 1000);
}

main();

// HELPER FUNCTIONS
function constrRetVal(_: EmitState, additive) {
  const _in = { ..._ };
  let _out = _in;
  _out["listeners"] = additive;
  return _out;
}
