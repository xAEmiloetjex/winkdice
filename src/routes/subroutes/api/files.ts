import * as fs from "node:fs";
import * as path from "node:path";

import { Marked } from "marked";
// import * as get from "get"

const marked = new Marked();

import express, { Express, Request, Response, IRouter, IRoute } from "express";
import multer from "multer";

import { AppDataSource as db } from "../../../data-source";
import { User } from "../../../entity/User";
import { Post } from "../../../entity/Post";
import { File } from "../../../entity/File";

import { db as mdb } from "../../../../index";
import { getFromArray } from "./posts";

const queryRunner = db.createQueryRunner();

import { addWScache } from "../../../sockets";

import { bodyData } from "../../../types";

import { ValidateAuthenticity, getUser } from "../../../utils/validators";

type Req = Request;
type Res = Response;

const Users = db.getRepository(User);
const Posts = db.getRepository(Post);
const Files = db.getRepository(File);

const upload = multer();
const p = path;
class APIRouter_Files {
  public router: IRouter;
  constructor() {
    this.router = express.Router();
    this.router.post("/upload", upload.single("file"), this.Upload);
    this.router.post("/changeUser", this.changeUsers);
    this.router.post("/delete/:id", this.DeletefileP);
    this.router.get("/delete/:id", this.DeletefileG);
    this.router.get("/deleteAdmin/:id", this.DeletefileAdminG);
    this.router.get("/getFile/:id", this.SendFile);
    this.router.get("/getFile/:id/idgaf", this.SendFile);

    this.router.get("/", this.index);
    this.router.get("/open/:id", this.OpenFile);
  }
  index(req: Req, res: Res): IRoute | void {
    return res.render("files/files", {
      title: "Hello, World!",
      extra: ``,
    });
  }
  async Upload(req: Req, res: Res) {
    const data: bodyData = req.body;
    if (data == undefined) return res.send({ msg: "Data Undefined!" });

    console.log(data);
    // return

    try {
      JSON.parse(data.user as unknown as string);
    } catch (e) {
      console.log(e)
      return res.status(500).send({msg:"An error has occured", responseCode: 500})
    }

    const userdata = JSON.parse(data.user as unknown as string);

    console.log(userdata);

    const neoData = {
      ...data,
      user: {
        name: userdata.userName,
        token: userdata.userToken,
      },
    };
    if ((await ValidateAuthenticity(neoData)) == false)
      return res.send({
        code: "Server:913:UserTokenDoesNotMatchUserName",
        shortcode: 913,
      });
    // else if (data.post.content == "" || data.post.title == "")
    //   return res.send({
    //     code: "Server:5016:TitleOrContentEmpty",
    //     shortcode: 5016,
    //   });
    else {
      try {
        console.log(req.file);
        let id = makeid(32);
        let isPatch = req.file.mimetype.startsWith("text/x-patch")
        if (req.file.mimetype.endsWith("svg+xml")) id = id + ".svg";
        else if (req.file.mimetype.startsWith("image"))
          id = id + "." + req.file.mimetype.split("/")[1];
        else if (req.file.mimetype.startsWith("audio"))
          id = id + "." + req.file.mimetype.split("/")[1];
        else if (req.file.mimetype.startsWith("video"))
          id = id + "." + req.file.mimetype.split("/")[1];
        else if (req.file.mimetype.startsWith("text/html")) id = id + ".html";
        else if (req.file.mimetype.startsWith("text/css")) id = id + ".css";
        else if (req.file.mimetype.startsWith("text")) id = id + ".txt";
        else if (req.file.mimetype.startsWith("text/x-patch")) isPatch = true;
        else id = id;
        console.log(req.file.mimetype.startsWith("text/x-patch"), isPatch, p.join(__dirname + `/../../../../${isPatch ? "patches" : "uploads"}/` + (isPatch ? id + ".patch" : id)))
        fs.createWriteStream(
          p.join(__dirname + `/../../../../../${isPatch ? "patches" : "uploads"}/` + (isPatch ? id + ".patch" : id))
        ).write(req.file.buffer, async (err) => {
          if (err)
            return res
              .status(400)
              .send(
                "Upload failed!, redirecting... <script>window.location.href='/files'</script>"
              );
          else {
            const file = fs.readFileSync(
              p.join(__dirname + `/../../../../../${isPatch ? "patches" : "uploads"}/` + (isPatch ? id + ".patch" : id)),
              { encoding: "utf-8" }
            );
            const check = `<script type="module" src="/js/files/html-safe-render.js" defer></script>`;
            if (
              req.file.mimetype.startsWith("text/html") &&
              !file.includes(check)
            )
              return rejectHTMLUpload(res, id, check);
            await mdb.push(`files`, {
              ID: (isPatch ? id + ".patch" : id),
              data: {
                originalname: req.file.originalname,
                encoding: req.file.encoding,
                mimetype: req.file.mimetype,
                uploader: userdata.userName,
                viewers: [],
              },
            });
            return res
              .status(201)
              .send(
                "uploaded file!, redirecting... <script>window.location.href='/files'</script>"
              );
          }
        });
      } catch (e) {
        return res.send({
          code: "Server:9016:SomethingWentWrongCreatingPost",
          shortcode: 9016,
        });
      }
    }
  }
  async changeUsers(req, res) {
    const fileID = req.body.id;
    const remOrAdd = req.body.remOrAdd;
    const usrname = req.body.usrname;
    try {
      const db_getter: any[] = (await mdb.get("files")) as any[];
      const arrayItem: any | any[] = getFromArray(db_getter, fileID);
      let temp_1 = {};
      temp_1 = arrayItem;

      db_getter.splice(arrayItem.index, arrayItem.index);
      await mdb.set("files", db_getter);

      // temp_1.data.viewers = [];

      if (remOrAdd == "add") {
        // res.send({ msg: "added "+usrname+" to the list", code: "001" })
        //@ts-expect-error
        temp_1.data.viewers.push(usrname);
        await mdb.push("files", temp_1);
      } else if (remOrAdd == "remove") {
        // res.send({ msg: "removed "+usrname+" from the list", code: "001"})
        //@ts-expect-error
        temp_1.data.viewers = temp_1.data.viewers.filter((e) => e !== usrname);
        await mdb.push("files", temp_1);
      } else {
        // res.send({ msg: "unknown action: "+remOrAdd, code: "003" })
      }

      console.log(temp_1);
    } catch (e) {
      console.log(e);
    }
  }
  async DeletefileP(req, res) {
    const id = req.params.id;
    const fileData = getFromArray(await mdb.get("files"), id);
    return res.send({
      msg: "Temporarily disabled due to a rewrite that actually makes stuff safe",
    });
    // fs.rm(p.join(__dirname + "/../../../../uploads/" + id), async (err) => {
    //   if (err)
    //     return res.status(400).send({
    //       msg: "I don't have permisison or a file with that id doesn't exist!",
    //     });
    //   else {
    //     // await db.pull(`files`, fileData.index)
    //     let filesDB: any[] = await mdb.get("files");
    //     filesDB.splice(fileData.index, fileData.index);
    //     await mdb.set("files", filesDB);
    //     return res.status(201).send({ msg: "deleted file!" });
    //   }
    // });
  }
  async DeletefileG(req, res) {
    const id = req.params.id;
    const fileData = getFromArray(await mdb.get("files"), id);

    const neoData = {
      user: {
        name: req.cookies.UsrName,
        token: req.cookies.UsrToken,
      },
    };

    if ((await ValidateAuthenticity(neoData)) == false)
      return res.send({
        code: "Server:913:UserTokenDoesNotMatchUserName",
        shortcode: 913,
      });
    else {
      if (!(neoData.user.name === fileData.data.uploader))
        return res.send({ msg: "UNAUTHORIZED" });

      let isPatch = fileData.data.mimetype.startsWith("text/x-patch")

      fs.rm(p.join(__dirname + `/../../../../../${isPatch ? "patches" : "uploads"}/` + id), async (err) => {
        if (err)
          return res.status(400).send({
            msg: "I don't have permisison or a file with that id doesn't exist!",
          });
        else {
          // await db.pull(`files`, fileData.index)
          let filesDB: any[] = await mdb.get("files");
          filesDB.splice(fileData.index, fileData.index);
          await mdb.set("files", filesDB);
          return res
            .status(201)
            .send(
              "deleted file!, redirecting... <script>window.location.href='/files'</script>"
            );
        }
      });
    }
  }
  async DeletefileAdminG(req, res) {
    const id = req.params.id;
    const fileData = getFromArray(await mdb.get("files"), id);

    const neoData = {
      user: {
        name: req.cookies.UsrName,
        token: req.cookies.UsrToken,
      },
    };

    if ((await ValidateAuthenticity(neoData)) == false)
      return res.send({
        code: "Server:913:UserTokenDoesNotMatchUserName",
        shortcode: 913,
      });
    else {
      const sender = await getUser({
        userName: neoData.user.name,
        userToken: neoData.user.token,
      });

      if (!sender.roles.includes("admin"))
        return res.send({ msg: "UNAUTHORIZED" });
      let isPatch = fileData.data.mimetype.startsWith("text/x-patch")
      fs.rm(p.join(__dirname + `/../../../../../${isPatch ? "patches" : "uploads"}/` + id), async (err) => {
        if (err)
          return res.status(400).send({
            msg: "I don't have permisison or a file with that id doesn't exist!",
          });
        else {
          // await db.pull(`files`, fileData.index)
          let filesDB: any[] = await mdb.get("files");
          filesDB.splice(fileData.index, fileData.index);
          await mdb.set("files", filesDB);
          return res
            .status(201)
            .send(
              "deleted file!, redirecting... <script>window.location.href='/admin/files'</script>"
            );
        }
      });
    }
  }
  async OpenFile(req, res) {
    const id = req.params.id;
    if (getFromArray(await mdb.get("files"), id) == undefined)
      return res.send({ msg: "file not found", code: "404" });
    const fileData = getFromArray(await mdb.get("files"), id).data;
    // fs.readFileSync

    res.render("files/viewfile", {
      title: "Hello, World!",
      extra: ``,
      data: {
        id,
        fileData,
      },
    });
  }
  async SendFile(req: Req, res: Res) {
    try {
      const id = req.params.id;
      //@ts-expect-error
      console.log(getFromArray(await mdb.get("files"), id));
      //@ts-expect-error
      const fileData = getFromArray(await mdb.get("files"), id).data;
      const location = id.endsWith(".patch") ? "/../../../../../patches/" : "/../../../../../uploads/"
      if (
        fs.readdirSync(p.join(__dirname + location)).includes(id)
      ) {
        if (fileData.viewers.includes("%public")) Send();
        else if (fileData.viewers.includes("%public-hidden")) Send();
        else if (fileData.viewers.includes(req.cookies.UsrName)) Send();
        else if (fileData.uploader == req.cookies.UsrName) Send();
        else {
          res.status(403).render(`rejected`, {
            title: "403: Forbidden",
            resp: {
              status: 403,
              reason: `
            You don't have permission to view this file! <br />
            you are logged in as <code>${
              req.cookies.UsrName
            }</code>, but this file belongs to <code>${
                fileData.uploader
              }</code>. <br />
            But the author gave read permission to the following people: <br />
              ${JSON.stringify(fileData.viewers)} <br />
            If one of the listed accounts belongs to you then please log into that account, <br />
              if you are logged into one of those accounts but you still see this message, then please contact the admins.
          `,
            },
          });
        }
        // // @ts-expect-error
        async function Send() {
          if (fileData.mimetype == "text/markdown")
            fs.readFile(
              p.join(__dirname + "/../../../../../uploads/") + id,
              "utf8",
              async function (err, data) {
                res.send(`
                  <!DOCTYPE html>
                  <html>
                  <head>
                  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.8.0/build/styles/atom-one-dark.min.css">
                  <link rel="stylesheet" href="/css/tomorrow-night-80s.css" />
                  <link rel="stylesheet" href="/css/theme/core.css" />
                  <link rel="stylesheet" href="/css/admo.css" />
                  <script src="/js/_globals.js" type="module" defer></script>
    
                  <script type="module" src="/js/files/html-safe-render.js" defer></script>
                  <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.8.0/build/highlight.min.js"></script>
                  </head>
                  <body>
                  ${await RenderMD(data)}
                  </body>
                </html>
                  
                  `);
              }
            );
          else {
            await res.setHeader(
              "Content-Type",
              `${fileData.mimetype}; charset=UTF-8`
            );
            res.sendFile(p.join(__dirname + location) + id);
          }
        }
      } else {
        res.status(404).json({ code: 404, msg: "item is not found!" });
      }
      // res.status(418).send({})
      // fs.readFileSync

      // res.send(await streamToBlob(fs.createReadStream(p.join(__dirname + "/../../../../uploads/" + id)), fileData.mimeType))
      //     try {
      //       fs.createReadStream(p.join(__dirname + "/../../../../uploads/" + id))
      //         .on("data", function (chunk) {
      //           const url = "data:" + fileData.mimetype + ";base64,";
      //           try {
      //             res.send(url + chunk.toString("base64"));
      //           } catch (e) {
      //             res.send({code: 500, data:
      //               "data:text/html;base64," +
      //                 Util.Base64.encode(`
      //             <!DOCTYPE HTML>
      //             <html>
      //               <head>
      //                 <style>html,body {height:100%;width:100%;}textarea {min-width: max-content;min-height: max-content;width: 100%;height: 100%;}</style>
      //               </head>
      //               <body>
      //                 <h1>500: Internal server error</h1>
      //                 <hr/>
      //                 <article>
      //                   <h4>Returned Error:</h4>
      //                   <textarea contenteditable="false">
      // ${String(e).replace(
      //   p.join(__dirname + "/../../../../uploads/"),
      //   "<REDACTED>/nl.xa_emiloetjex.web.main/uploads/"
      // )}
      //                   </textarea>
      //               </body>
      //             </html>

      //             `)}
      //             );
      //           }
      //         })
      //         .on("error", (err) =>
      //           res.send({code: 500, data:
      //             "data:text/html;base64," +
      //               Util.Base64.encode(`
      //           <!DOCTYPE HTML>
      //           <html>
      //             <head>
      //               <style>html,body {height:100%;width:100%;}textarea {min-width: max-content;min-height: max-content;width: 100%;height: 100%;}</style>
      //             </head>
      //             <body>
      //               <h1>500: Internal server error</h1>
      //               <hr/>
      //               <article>
      //                 <h4>Returned Error:</h4>
      //                 <textarea contenteditable="false">
      // ${String(err).replace(
      // p.join(__dirname + "/../../../../uploads/"),
      // "<REDACTED>/nl.xa_emiloetjex.web.main/uploads/"
      // )}
      //                 </textarea>
      //             </body>
      //           </html>

      //           `)})
      //         );
      //     } catch (e) {
      //       res.send(e);
      //     }
      // console.log(
      //   await streamToBlob(
      //     fs.createReadStream(
      //       p.join(__dirname + "/../../../../uploads/" + id)
      //     )
      //   )
      // )
    } catch (e) {
      console.log(e);
      return res.status(500).send({ msg: "something went wrong", error: e });
    }
  }
}

const APIRoutes_Files = new APIRouter_Files().router;
export default APIRoutes_Files;

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const { markedEmoji } = require("marked-emoji");
const eT = require("marked-extended-tables");
const { markedHighlight } = require("marked-highlight");
const hljs = require("highlight.js").default;
const DOMPurify = require("dompurify");
const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
  request: { fetch: require("node-fetch-native") },
});
const { gfmHeadingId } = require("marked-gfm-heading-id");
const { mangle } = require("marked-mangle");
const admonition = require("marked-admonition-extension");
const { markedSmartypants } = require("marked-smartypants");
const baseUrl = require("marked-base-url");

const options2 = {
  prefix: "my-prefix-",
};
// require('marked-admonition-extension/dist/index.css');
marked.use(admonition.default);
marked.use(gfmHeadingId(options2));
marked.use(eT());
marked.use(mangle());
marked.use(markedSmartypants());
marked.use(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

async function RenderMD(input) {
  const res = await octokit.rest.emojis.get();
  const emojis = res.data;
  const options = {
    emojis,
    unicode: false,
  };
  marked.use(markedEmoji(options));

  return String(marked.parse(input));
}

function rejectHTMLUpload(res, id, check) {
  res.status(406).send({
    msg: `htmlFile didn't include '${check}', please add that script tag to your head element before uploading!`,
  });
  fs.rm(p.join(__dirname + "/../../../../../uploads/" + id), () => {});
}
