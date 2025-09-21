import express, {
  Express,
  Request,
  Response,
  NextFunction,
  IRouter,
  IRoute,
} from "express";
import { Queue, Worker, QueueEvents } from "bullmq";
import axios from "axios";

import * as Yaml from 'yaml'

import { queueNames } from "../namespaces";
import { crashHandler } from "../crashHandler";
import { ClientsideInputError } from "../errors/ClientsideInputError";
import { main as interm } from "../utils/intermediate";

import { reg } from "../config";
import { Logger } from "../utils/logger";

import RelayRoutes_Sockets from './subroutes/relay/sockets'

const resultMap = new Map<string, any | any[]>();

const logger = new Logger("RelayRouter");

type Req = Request;
type Res = Response;
type Next = NextFunction;

const HTTPMETHODS = ["get", "put", "post", "delete"];
const errHandler = crashHandler;

const RetryStore = new Map();

const connection = {
  host: "127.0.0.1",
  port: 6379,
};

export const RelayQueue = new Queue(queueNames.relay, { connection });
const queueEvents = new QueueEvents(queueNames.relay);
const RelayWorker = new Worker(
  queueNames.relay,
  async (job) => {
    if (job.name == "relay") {
      const data: JOBDATA = job.data;
      let passed = data.data;
      if (passed.data_type) delete passed.data_type;
      if (passed.method) delete passed.method;
      axios({
        method: data.method,
        url: decodeURIComponent(data.to),
        data: {
          meta: {
            from: data.from,
            result_to: data.result_to,
            to: data.to,
            method: data.method,
          },
          data: passed,
        },
      })
        .then((resp) => {
          return void resp;
        })
        .catch((err) => {
          const id_ = data.method + ":" + data.to;

          if (!RetryStore.has(id_)) RetryStore.set(id_, 0);
          // logger.debug(id_);
          logger.error(err);
          RelayQueue.remove(job.id);
          if (Number(RetryStore.get(id_)) < Number(interm.relay.MaxRetries))
            return setTimeout(() => {
              RetryStore.set(id_, Number(RetryStore.get(id_)) + 1);
              RelayQueue.add("relay", data);
              console.log("RETRY", RetryStore.get(id_));
            }, Number(interm.relay.RetryDelay));
          else return RetryStore.delete(id_);
        });
    } else if (job.name == "relayMultiple") {
      const data: JOBDATA_Multi = job.data;
      data.receipients.forEach((receipient) => {
        let dataObj = {
          from: data.from,
          to: receipient,
          method: data.method,
          data: data.data,
        };
        RelayQueue.add("relay", dataObj);
      });
    }
  },
  { connection }
);

RelayWorker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.log(`${jobId} has failed with reason ${failedReason}`);
});

let AutomatedProcesses = [];

/**
 * @classdesc
 * 
 * RelayRouter is the router class for the relay thing
 * 
 */
class RelayRouter {
  public router: IRouter;
  constructor() {
    this.router = express.Router();
    this.router.all("/addJob/:name", this.all_addJob);
    this.router.all("/relay/:from/:to", this.all_relay);
    this.router.all("/relayMultiple", this.all_relayMultiple);
    this.router.all("/relayManifest", this.all_relayManifest);
    this.router.all("/sendResult", this.all_sendResult);

    this.router.use('/sockets', RelayRoutes_Sockets)

    this.router.all("/:from/:to", this.all_relay);

    if (process.env.DO_AUTOMATED_PROCESSES == "true") StartIntervals();

    logger.info('Relay router loaded')
  }
  all_addJob(req: Req, res: Res) {
    const data = req.query;
    if (JSON.stringify(data) == JSON.stringify({})) {
      // if there are no query parameters
      errHandler.webResponseCodes.auto(
        req,
        res,
        new ClientsideInputError(
          "in order to pass on data, we need to have it, pass it on as key-value pairs in the URL-queries"
        )
      );
    } else {
      RelayQueue.add(req.params.name, data);
      res.send({});
    }
  }

  async all_relay(req: Req, res: Res) {
    const { from, to } = req.params;
    const data = req.query;
    const bodyData: BODYDATA = req.body;
    if (!req) {
    } else {
      let dataObj;
      if (data.data_type && data.data_type == "query") {
        if (!data.method) {
          return await errHandler.webResponseCodes.auto(
            req,
            res,
            new ClientsideInputError("No valid method query is defined")
          );
        }

        const method = checkMethod(String(data.method));

        dataObj = {
          from,
          to,
          method,
          data,
        };
      } else {
        const method = checkMethod(String(bodyData.method));

        dataObj = {
          from,
          to,
          method,
          data: bodyData.data,
        };
      }

      if(data.method) {
        RelayQueue.add("relay", dataObj);
        return res.send({ dataObj });
      }
    }
    function checkMethod(input: string) {
      const method = String(input).toLowerCase();
      if (HTTPMETHODS.includes(method)) return method;
      else
        return errHandler.webResponseCodes.auto(
          req,
          res,
          new ClientsideInputError(`Unknown HTTP Method: ${method}`)
        );
    }
  }

  async all_relayMultiple(req: Req, res: Res) {
    const data = req.query;
    const bodyData: BODYDATA = req.body;
    if (!req) {
    } else {
      let dataObj;
      if (data.data_type && data.data_type == "query") {
        if (!data.method) {
          return errHandler.webResponseCodes.auto(
            req,
            res,
            new ClientsideInputError("No valid method query is defined")
          );
        }

        const method = checkMethod(String(data.method));

        const { from, receipients } = data;

        dataObj = {
          from,
          receipients,
          method,
          data,
        };
      } else {
        const method = checkMethod(String(bodyData.method));

        const { from, receipients } = bodyData as unknown as JOBDATA_Multi;

        dataObj = {
          from,
          receipients,
          method,
          data: bodyData.data,
        };
      }
      if (data.method) {
        RelayQueue.add("relayMultiple", dataObj);
        return res.send({ dataObj });
      }
    }

    function checkMethod(input: string) {
      const method = String(input).toLowerCase();
      if (HTTPMETHODS.includes(method)) return method;
      else
        return errHandler.webResponseCodes.auto(
          req,
          res,
          new ClientsideInputError(`Unknown HTTP Method: ${method}`)
        );
    }
  }

  async all_relayManifest(req: Req, res: Res) {
    // const bodyData: relayManifestObj = req.body;
    let bodyData: relayManifestObj = {};
    if(req.query['object-format'] && String(req.query['object-format']).toLowerCase() !== 'json') {
      return res.send({
        msg: `For now only json is supported!`
      })
      switch(String(req.query['object-format']).toLowerCase()) {
        case 'yaml':
          bodyData = Yaml.parse(`${req.body}`)
          break;
        default:
          return res.send({ 
            msg: `'object-format' of '${String(req.query['object-format'])}' is not supported!`
          })
      }
    } else bodyData = req.body;

    const P = {
      waitForResp: req.query.waitForActualResponse,
      respId: req.query.responseId,
    };

    let AlteredReq = {...req}
    AlteredReq.body = bodyData

    ManifestProcessor(AlteredReq, res);
    if (P.waitForResp) {
      if (P.waitForResp == "true" || P.waitForResp == "1") {
        if (P.respId) {
          const I = setInterval(() => {
            const _res = resultMap.get(<any>P.respId);
            if (_res !== undefined) {
              res.send(_res);
              resultMap.delete(<any>P.respId);
              clearInterval(I);
            }
          }, 1);
        } else {
          return errHandler.webResponseCodes.auto(
            req,
            res,
            new ClientsideInputError(
              `Could not find parameter of 'responseId' but the parameter is required for the system to work!`
            )
          );
        }
      } else res.send({ bodyData });
    } else res.send({ bodyData });
    // res.send(0)
  }

  async all_sendResult(req: Req, res: Res) {
    const bodyData = req.body;
    if (req.query.responseId) {
      resultMap.set(<any>req.query.responseId, bodyData);
    } else {
      return errHandler.webResponseCodes.auto(
        req,
        res,
        new ClientsideInputError(
          `Could not find parameter of 'responseId' but the parameter is required for the system to work!`
        )
      );
    }
  }
}

function ManifestProcessor(
  req: Req | { body: any },
  res: Res | {},
  isConfig?: boolean
) {
  const reqBody = req.body;
  let bodyData: relayManifestObj = {};

  // console.log(reqBody)
  if (
    reqBody.meta &&
    reqBody.meta.to &&
    reqBody.meta.method &&
    String(reqBody.meta.to).includes("/relayManifest")
  )
    bodyData = req.body.data;
  else bodyData = req.body;

  // console.log("ManifestProcessor::DEBUG>>", bodyData)

  if (bodyData.single && Array.isArray(bodyData.single)) {
    for (const job of bodyData.single) {
      const { from, to, data } = job;
      const method = checkMethod(job.method);
      if (method == undefined)
        return logger.error(
          new Error(
            `DEBUG: no valid Method is defined in the current executing manifest`
          )
        );
      let dataObj = {
        from,
        to,
        method,
        data,
      };
      RelayQueue.add("relay", dataObj);
    }
  }
  if (bodyData.multiple && Array.isArray(bodyData.multiple)) {
    for (const job of bodyData.multiple) {
      const { from, receipients, data } = job;
      const method = checkMethod(job.method);
      if (method == undefined)
        return logger.error(
          new Error(
            `DEBUG: no valid Method is defined in the current executing manifest`
          )
        );
      let dataObj = {
        from,
        receipients,
        method,
        data,
      };
      RelayQueue.add("relayMultiple", dataObj);
    }
  }

  function checkMethod(input: string) {
    const method = String(input).toLowerCase();
    if (HTTPMETHODS.includes(method)) return method;
    else if (isConfig !== true)
      return errHandler.webResponseCodes.auto(
        // @ts-ignore
        req,
        res,
        new ClientsideInputError(`Unknown HTTP Method: ${method}`)
      );
  }
}

const RelayRoutes = new RelayRouter().router;
export default RelayRoutes;

interface BODYDATA {
  method: "get" | "put" | "post" | "delete";
  data: {
    [key: string | symbol]: any;
  };
}

interface JOBDATA extends BODYDATA {
  from: string;
  to: string;
  result_to?: string;
}

interface JOBDATA_Multi extends BODYDATA {
  from: string;
  receipients: string[];
}

interface relayManifestObj {
  single?: JOBDATA[];
  multiple?: JOBDATA_Multi[];
}

const minuteStore = new Map();
const _min_Store = {
  set: async (key: string, value: string) => {
    minuteStore.set(key, value);
    setTimeout(() => minuteStore.delete(key), 10000);
  },
  get: (key: string) => minuteStore.get(key),
  delete: (key: string) => minuteStore.delete(key),
};

function StartIntervals() {
  for (const interv_col of reg.intervals.Collection) {
    for (const interv of interv_col.interval) {
      for (const obj of interv.objs) {
        AutomatedProcesses.push(
          setInterval(() => {
            if (obj.is_enabled === true)
              ManifestProcessor({ body: obj }, {}, true);
          }, interv.timeout)
        );
      }
    }
  }
  for (const timestamp_col of reg.timestamps.Collection) {
    for (const timestmp of timestamp_col.timestamp) {
      for (const obj of timestmp.objs) {
        AutomatedProcesses.push(
          setInterval(() => {
            const d = new Date();
            const mo = d.getMonth() + 1;
            const w = d.getDay();
            const h = d.getHours();
            const m = d.getMinutes();
            const s = d.getSeconds();
            // console.log("CurrentTime", `${mo}:${w}:${h}:${m}:${s}`)

            for (const time of timestmp.timestamps) {
              const t = time.split(":");
              let _mo = t[0];
              let _mw = t[1];
              let _w = t[2];
              let _h = t[3];
              let _m = t[4];
              let _s = t[5];
              if (t[0] == "0") _mo = String(mo);
              if (t[1] == "0") _mw = String("0");
              if (t[2] == "0") _w = String(w);
              if (t[3] == "0") _h = String(h);
              if (t[4] == "0") _m = String(m);
              if (t[5] == "0") _s = String(s);
              if (
                t[0] == "0" &&
                t[1] == "0" &&
                t[2] == "0" &&
                t[3] == "0" &&
                t[4] == "0" &&
                t[5] == "0"
              )
                console.log(
                  `There's a timestamped loop that's completely zero-ed out`
                );
              else {
                // ManifestProcessor({ body: obj }, {}, true);
                if (
                  _mo == String(mo) &&
                  // _mw == String('0') &&
                  _w == String(w) &&
                  _h == String(h) &&
                  _m == String(m) &&
                  _s == String(s)
                ) {
                  if (_min_Store.get(time) !== undefined) return;
                  ManifestProcessor({ body: obj }, {}, true);
                  _min_Store.set(time, "alibaba")
                }
              }
            }
          }, 1)
        );
      }
    }
  }
}
