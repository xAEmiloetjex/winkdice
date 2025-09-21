import * as fs from "node:fs"
import * as path from "node:path"

import express, { Express, Request, Response, IRouter, IRoute } from "express";
import multer from "multer";
import * as QRCode from "qrcode"

import { AppDataSource as db } from "../../../data-source";
import { User } from "../../../entity/User";
import { Post } from "../../../entity/Post";
import { File } from "../../../entity/File";

const queryRunner = db.createQueryRunner();

import { addWScache } from "../../../sockets";
import { bodyData } from "../../../types";
import { Logger } from "../../../utils/logger";
import {dataUriToBuffer} from "../../../utils/dataUri2Buffer";

import { ValidateAuthenticity, getUser } from "../../../utils/validators";

const logger = new Logger('Routes.Sub.Api.Gen')

type Req = Request;
type Res = Response;

const Users = db.getRepository(User);
const Posts = db.getRepository(Post);
const Files = db.getRepository(File);

const upload = multer()
const p = path
class APIRouter_Gen {
  public router: IRouter;
  constructor() {
    this.router = express.Router();
    this.router.get("/", this.index);
    this.router.get("/qrcode/:data", this.G$QRCode);
    this.router.post("/gen_qr", this.P$QRCode);
    this.router.post("/gen_qr_cons", this.P$QRConsole);
  }
  index(req: Req, res: Res): IRoute {
    res.send("hello, world!");
    return;
  }

  async P$QRCode(req: Req, res: Res) {
    const data = req.body.input;
    QRCode.toFile(
      path.join(__dirname, "../../../../static/temp/post.api_gen-qr.tmp.png"),
      data,
      (e) => {
        if (e) Void(e);
      }
    );
    if (req.body.discordbot == true) {
      QRCode.toDataURL(`${data}`, (error, str) => {
        if (error)
          return res.send({
            msg: "Something went wrong",
            Error: `"\`\`\`js\n${error}\`\`\`"`,
          });
        else return res.send({ output: str });
      });
    } else if (req.body.console == true) {
      QRCode.toString(`${data}`, (error, str) => {
        if (error)
          return res.send({
            msg: "Something went wrong",
            Error: `"${error}"`,
          });
        else return res.send({ data: str });
      });
    } else {
      QRCode.toDataURL(`${data}`, (error, str) => {
        if (error)
          return res.send({
            msg: "Something went wrong",
            Error: `"${error}"`,
          });
        else return res.send(`<img src="${str}" />`);
      });
    }
  }
  async G$QRCode(req, res: Res) {
    const data = req.params.data;
    QRCode.toFile(
      path.join(__dirname, "../../../../static/temp/get.api_qrcode.tmp.png"),
      data,
      (e) => {
        // if (e) return res.send({msg:"FUCK YOU!", data:{e}});
        // else
        //   return res.sendFile(
        //     path.join(__dirname, "../../../../static/temp/get.api_qrcode.tmp.png")
        //   );
      });
    QRCode.toDataURL(`${data}`, (error, str) => {
      if (error)
        return res.send({
          msg: "Something went wrong",
          Error: `"\`\`\`js\n${error}\`\`\`"`,
        });
      else {
        res.contentType("png")
        return res.send(new Buffer(dataUriToBuffer(str).buffer))
      }
    });

  }

  async P$QRConsole(req, res) {
    const data = req.body.input;

    QRCode.toString(`${data}`, (error, str) => {
      if (error) {
        return res.send({
          msg: "Something went wrong",
          Error: `"${error}"`,
        });
      } else {
        fs.writeFile(
          path.join(__dirname, "../../../../static/temp/post.api_genqrcons.tmp.txt"),
          str, () => { }
        );
        return res.send({ data: str });
      }
    });
  }
}

const APIRoutes_Gen = new APIRouter_Gen().router;
export default APIRoutes_Gen;

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_$";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
function Void(params) {
  if (params) logger.warn({ ...params });
  return void null;
}
