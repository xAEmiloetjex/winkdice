import axios from "/js/lib/axios.min.js";

import Utils, {
  Cookies,
  Toast,
  InfoUtils as PageInfo,
  CONFIG as CFG,
  cError,
  cWarn,
  _utils,
} from "../lib/Utils.js";

import "../_globals.js";
import { socket, syncGlobalStateCookies } from "../_globals.js";
import {
  CheckIfAdmin,
  CheckIfLoggedIn,
  RejectIfNotAdmin,
  RejectPageRequest,
} from "../lib/admin.js";
import { html } from "../lib/framework/index.js";

if (!CheckIfLoggedIn()) REJECTED();
if (!(await CheckIfAdmin())) REJECTED();

window.console.warn = (e) => cWarn(e, "console.js");
window.console.error = (e) => cError(e, "console.js");
document.onerror = (e) => cError(e, "console.js");
window.onerror = (e) => cError(e, "console.js");
document.onwarn = (e) => cWarn(e, "console.js");
window.onwarn = (e) => cWarn(e, "console.js");

const Koenk = new Cookies();

const seshObj = {
  sessionToken: Koenk.Get("SessionToken"),
  userName: Koenk.Get("UsrName"),
  userToken: Koenk.Get("UsrToken"),
};

function REJECTED() {
  html("main#main").set(``);
  RejectPageRequest("NoAdmin");
  setInterval(() => {
    html("main#main").set(``)
    RejectPageRequest("NoAdmin").then(() => {
      setTimeout(() => {
        alert(
          "You are not logged into an admin account, therefore you shouldn't be here!"
        );
        window.location.href = "/";
      },1000)
    });
  }, 100);
}

function timestamp() {
  const deet = new Date();
  return `[${deet.getHours()}:${deet.getMinutes()}:${deet.getSeconds()}]: `;
}

let histCount = 0;
const linePrefix = () => timestamp() + Koenk.Get("UsrName") + "@WinkDice >> ";

html("main#main").env(({ set, on, get, add, attr }) => {
  const parentMain = { set, on, get, add, attr };

  set(`
        <label for="consoleWindow" id="windowTitle"></label>
        <div class="form console-window" id="consoleWindow">

        </div>
    `);
  html("#windowTitle").set("🧑‍💻Console🧑‍💻");
  newInputLine();
});

async function newLine(text) {
  html("#consoleWindow").add(`${text} <br/>`);
}
async function newInputLine(state) {
  const prevElem = html(`#inputLine${histCount}Span`);
  // const prevInput = html(`#inputLine${histCount}`);
  if (prevElem.get().nodeName !== "BODY") {
    const prevVal = Koenk.Get("console_prevVal");
    await console.log("LOG", prevVal)
    await prevElem.set(prevVal);
  }
  await newLine(
    linePrefix() +
      `<span class="inputLine" id="inputLine${
        histCount + 1
      }Span"><input type="text" id="inputLine${
        histCount + 1
      }" class="console-input" /></span>`
  );

  html(`#inputLine${histCount + 1}`).env(({ set, on, get, add, attr }) => {
    const parent = { set, on, get, add, attr };

    on("keypress", ({ set, on, get, add, attr, ev }) => {
      const parent = html(`#inputLine${histCount}`);
      //   console.log(`#inputLine${histCount}`, parent.get(), ev.which)
      if (ev.which == 13) {
        const val = parent.get().value;

        Koenk.Set("console_prevVal", val)

        try {
          if (val.startsWith("help")) {
            helpBlock();
          } else if (val.startsWith("js:")) {
            const code = val.replace("js:", "");
            newLine(eval(code));
          } else if (val.startsWith("func:")) {
            const cmdLine = val.replace("func:", "");
            const args_ = cmdLine.split(" ");
            const cmd = args_[0];
            const args = args_.slice(1, args_.length);

            if (cmd == "help") {
              helpBlock();
            }
            if (cmd == "setTitle") {
              html("#windowTitle").set(args.join(" "));
            }
            if (cmd == "sendWS") {
              wsSend(JSON.parse(args.join("")));
            }
            if (cmd == "notifyModal") {
              if (args.length == 0) CustHelpBlock(
                `this command needs Arguments<br/>
                <code>(args[0]: Target)<code><code>(args.slice(1,args.length): Message)</code>
                `)
              else wsSend({
                id: "sendAimedModal",
                args: {
                  target: args[0],
                  message: {
                    text: args.slice(1,args.length).join(" "),
                  }
                }
            })
            }
            if (cmd == "notify") {
              if (args.length == 0) CustHelpBlock(
                `this command needs Arguments<br/>
                <code>(args[0]: Target)<code><code>(args.slice(1,args.length): Message)</code>
                `)
              else wsSend({
                id: "sendAimedMesg",
                args: {
                  target: args[0],
                  message: {
                    text: args.slice(1,args.length).join(" "),
                    position: "top-center",
                    pauseOnHover: true,
                    pauseOnFocusLoss: true
                  }
                }
            })
            }
            if (cmd == "nfsend") {
              if (args.length == 0) CustHelpBlock(
                `this command needs Arguments<br/>
                <code>(args[0]: Target)<code><code>(args.slice(1,args.length): Message)</code>
                `)
              else {wsSend({
                "id": "notification_send",
                "args": {
                  "msg": args.join(" "),
                  "data": {
                    "authToken": seshObj.userToken,
                    "target": "main",
                    "sender": seshObj.userName,
                    "content": args.join(" "),
                    "meta": {
                      "sessionId": seshObj.userName
                    }
                  }
                }
              })
              writeInfoBlock("var(--green_3)", "success");
              return newInputLine()
            } 
            }
            if (cmd == "popup") {
              wsSend({
                id: "modal",
                args: {
                  title: prompt("title"),
                  content: `<header style="color:var(--theme-fg)">${prompt("description")}</header>`,
                  targets: ["global"],
                },
              })
            }
            if (cmd == "servPatch") {
              const patch = prompt("Patch to apply")
              if(!patch.endsWith(".patch")) return alert("Invalid patch")
              else return wsSend({
                id: "console_cmd",
                args: {
                  type: "server_function_patch",
                  cmd: patch,
                  session: seshObj,
                },
              });
            }
            if (cmd == "servFunc") {
              return wsSend({
                id: "console_cmd",
                args: {
                  type: "server_function",
                  cmd: args.join(" "),
                  session: seshObj,
                },
              });
            }
          } else if (val.startsWith("node:")) {
            const code = val.replace("node:", "");
            // if (Koenk.Get("UsrName") !== "xA_Emiloetjex") {
            //   throw new EvalError(
            //     `You are not allowed to use this prefix, please use "js:" or "func:" to prefix your commands`
            //   );
            // }
            return wsSend({
              id: "console_cmd",
              args: {
                type: "node",
                cmd: code,
                session: seshObj,
              },
            });
          } else {
            // if (Koenk.Get("UsrName") !== "xA_Emiloetjex") {
            //   throw new EvalError(
            //     `You are not allowed to use this prefix, please use "js:" or "func:" to prefix your commands`
            //   );
            // }
            return wsSend({
              id: "console_cmd",
              args: {
                type: "bash",
                cmd: val,
                session: seshObj,
              },
            });
          }          
        } catch (e) {
          writeInfoBlock(
            "var(--red_3)",
            `ERROR:<br/>
          ${e}<br/>
          Please check your input
          <div class="form">${val}</div>`
          );
        }
        newInputLine(val);
      } else return;
    });
  });
  return histCount++;
}

async function wsSend(object) {
  return await axios({
    method: "POST",
    url: "/api/addWSCache",
    data: {
      data: {
        authToken: "qnHfAh0q2t7xU2BkIkVdQShx4Y4DVGvd",
        wsIn: object,
      },
    },
  }).then((resp) => {
    console.log(resp.data);
    return resp;
  });
}

const exampleWsIn = (string) => {
  return {
    id: "notification_send",
    args: {
      msg: `${string}`,
      data: {
        authToken: "qnHfAh0q2t7xU2BkIkVdQShx4Y4DVGvd",
        target: "main",
        sender: "testBot",
        content: string,
        meta: {
          sessionId: "000000",
        },
      },
    },
  };
};

function writeInfoBlock(color, text) {
  newLine(`<div class="form" style="border: 2px ${color} dashed;background:var(--theme-bg);">
  ${text}
  </div>`);
}

function helpBlock() {
  writeInfoBlock(
    "var(--blue_3)",
    `<h3>This is a console where you can execute commands</h3>
    <h5>Prefixes</h5>
    <strong>js:</strong> - Execute JavaScript Code.<br/>
    <strong>func:</strong> - Execute built-in commands (except for help).<br/>
    <strong>node:</strong><em>*</em> - Execute JavaScript code on the Node.JS back-end (locked)<br/>
    <strong></strong><em>*</em> - No prefix means to execute shell commands on the server's OS (locked)<br/>
    <hr/>
    <h5>Built-In commands</h5>
    <strong>setTitle</strong> - change the text in the topbar of this console section that says "Console"<br/>
    <strong>sendWS</strong> - send a websocket queue<br/>
    <strong>help</strong> - this help message, this also overwrites the shell command predix so this can be used without the "func:" prefix<br/>
    <strong>notify</strong> - send everyone a toast message<br/>
    <strong>notifyModal</strong> - send everyone a modal message<br/>
    <strong>nfsend</strong> - toast message legacy, but still used for global functions like <code>@rl</code>, <code>@rlSpec</code>, <code>@rlUsr</code>, <code>@maintenance</code> and <code>@eval</code><br/>
    <strong>popup</strong> - send annoying popup notification<br/>
    <strong>servFunc</strong> - execute functions on the back-end (like <code>restart</code>)<br/>
    <strong>servPatch</strong><em>*</em> - apply git patches to the server (locked)`
    );
}
function CustHelpBlock(text) {
  writeInfoBlock(
    "var(--blue_3)",
    text
  );
}

socket.on("console_resp", (data) => {
  console.log(data);
  if (data.session.sessionToken != seshObj.sessionToken) return;
  writeInfoBlock("var(--green_3)", data.response);
  newInputLine();
});
socket.on("console_err", (data) => {
  console.log(data);
  if (data.session.sessionToken != seshObj.sessionToken) return;
  writeInfoBlock(
    "var(--red_3)",
    `ERROR:<br/>
    ${data.response}<br/>`
  );
  newInputLine();
});
