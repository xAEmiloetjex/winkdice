import * as http from "node:http";

import axios from "axios";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";

import { Logger, levels as LogLevel } from "./utils/logger";
import { crashHandler, type CrashHandler } from "./crashHandler";
// import { addWScache, ioServe } from './sockets';
import { AppDataSource } from "./data-source";

import { queueNames } from "./namespaces";

import { PageRoutes } from "./routes/main.router";
import { APIRoutes } from "./routes/api.router";
import APIRoutes_Files from "./routes/subroutes/api/files";
import RelayRoutes from "./routes/relay.router";
import { HEX_CHAR_LIST, mkRandStr2, UniqueGen } from "./utils/common";

type Req = Request;
type Res = Response;
type Next = NextFunction;

const logger = new Logger("APP");

const ip = process.env.HOST_IP || "0.0.0.0";
const port = process.env.HOST_PORT || 3000;

const app: Express = express();
const server = http.createServer(app);

app.disable("x-powered-by");

const allowlist = ["*"];
const corsOptionsDelegate = function (req: Request, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

/**
 * @function Main
 */
export async function Main(): Promise<CrashHandler> {
  return new Promise(async (resolve, reject) => {
    try {
      await AppDataSource.initialize().then(async () => {
        logger.info(`Starting server on port http://${ip}:${port}`);

        const { addWScache, ioServe } = await import("./sockets");

        ioServe(server);

        app.use(cors(corsOptionsDelegate));

        app.set("view engine", "ejs");
        app.set("views", "views");
        app.set("layout", "layouts/main");

        app.use(express.json());
        app.use(express.static("static"));
        app.use(require("cookie-parser")());
        app.use(require("express-ejs-layouts"));

        app.engine(".ejs", require("ejs").__express);

        app.use(async (req: Req, res: Res, next: Next) => {
          logger.log(
            LogLevel.Http,
            req.ip,
            "|",
            req.method,
            req.path,
            req.query,
            "|",
            req.params
          );
          res.setHeader("x-powered-by", "Bigus Dickus");
          // console.log(Number(req.query.delay), req.query.delay)
          if (req.query.delay)
            setTimeout(() => next(), Number(req.query.delay));
          else next();
        });

        if (
          process.env.ROUTES_RELAY_ONLY == "true" &&
          process.env.ROUTES_ENABLE_RELAY == "true"
        ) {
          app.use("/", RelayRoutes);
          app.use("/relay", RelayRoutes);
        } else {
          if (process.env.ROUTES_ENABLE_FRONTEND == "true")
            app.use("/", PageRoutes);
          if (process.env.ROUTES_ENABLE_API == "true")
            app.use("/api", APIRoutes);
          if (process.env.ROUTES_ENABLE_FILES_DIRECT == "true")
            app.use("/files", APIRoutes_Files);
          if (process.env.ROUTES_ENABLE_RELAY == "true")
            app.use("/relay", RelayRoutes);
        }

        app.all("/rand/:length", (req: Req, res: Res) => {
          res.send({
            result: UniqueGen(
              (length: number) => mkRandStr2(length, HEX_CHAR_LIST),
              Number(req.params.length)
            ),
          });
        });

        app.all("/end", (req: Req, res: Res) => {
          const body = req.body;
          const response = body;
          if (body.data.result_to) {
            try {
              axios({
                url: body.data.result_to,
                method: "post",
                data: response,
              });
            } catch (e) {
              logger.warn("Failed to send the response back to the commander");
            }
            // console.log("result_to == true", body);
          }
          res.send(response);
          // res.json(req.body)
        });

        app.all("*", (req: Request, res: Response, next: NextFunction) => {
          try {
            throw "Could not find the page you were looking for";
          } catch (err) {
            const body = req.body;
            const response = crashHandler.webResponseCodes[404](err, req, res);
            if (body.data) {
              if (body.data.result_to) {
                try {
                  axios({
                    url: body.data.result_to,
                    method: "post",
                    data: response,
                  });
                } catch (e) {
                  logger.warn(
                    "Failed to send the response back to the commander"
                  );
                }
                // console.log("result_to == true", body);
              }
            }
          }
        });

        server.listen(Number(port), ip, () => {
          logger.info(`Relay queue registered to: ${queueNames.relay}`);
          logger.info(`Server listening on port ${port}`);
          addWScache({
            id: "sendAimedMesg",
            args: {
              target: "global",
              message: {
                text: `Server re-started successfully`,
                position: "top-center",
                pauseOnHover: true,
                pauseOnFocusLoss: true,
              },
            },
          });
        });
      });
    } catch (e) {
      reject(crashHandler.mainFunctionExited(e));
    }
  });
}

async function fetchApiData(name: string) {
  const apiResponse = await axios.get(`https://api.genderize.io?name=${name}`);
  logger.info("Request sent to the API");
  return apiResponse.data;
}
