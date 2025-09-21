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

window.console.warn = (e) => cWarn(e, "adminPanel.js");
window.console.error = (e) => cError(e, "adminPanel.js");
document.onerror = (e) => cError(e, "adminPanel.js");
window.onerror = (e) => cError(e, "adminPanel.js");
document.onwarn = (e) => cWarn(e, "adminPanel.js");
window.onwarn = (e) => cWarn(e, "adminPanel.js");

const Koenk = new Cookies();

// html(".execution").set(`
// <div class="form notify" action="/admin">
//     <textarea name="NotifyText" id="" cols="30" rows="10"></textarea>
//     <button class="notif-btn">Send Notification</button>
// </div>
// <div class="form backend" action="/admin">
//   <textarea name="BackendText" id="" cols="30" rows="10"></textarea>
//   <button class="backend-btn">Send code to backend</button>
// </div>
// <br>

// `)

// _utils.$utils.getDomElement(".notif-btn").addEventListener("click", (ev) => {
//   ev.preventDefault();
//   socket.emit(
//     "notification_send",
//     _utils.$utils.getDomElement("[name=NotifyText]").value
//   );
// });
// _utils.$utils
//   .getDomElement(".backend-btn")
//   .addEventListener("click", async (ev) => {
//     ev.preventDefault();
//     await axios({
//       method: "POST",
//       url: "/api/execOnBackend",
//       data: {
//         data: _utils.$utils.getDomElement("[name=BackendText]").value,
//       },
//     }).then(async (resp) => {
//       console.log(resp.data);
//     });
//   });

// _utils.$utils
//   .getDomElement(".usrdat_update")
//   .addEventListener("click", async () => {
//     await axios({
//       method: "POST",
//       url: "/api/users/setRawData",
//       data: {
//         data: _utils.$utils.getDomElement("[name=userData_json]").value,
//       },
//     });
//   });

html("main#main").env(({ set, on, get, add, attr }) => {
  add(`
    <div class="form userData">
        <h1>USER DATA EDITOR</h1>
        <input type="text" name="userToken" class="userdata_token" placeholder="user token" />

        <textarea name="userData_json" id="" cols="30" rows="10"></textarea>
        <div class="form hidden">
            <input name="userData_id" id="usrId">
            <input name="userData_Token" id="usrToken">
            <input name="userData_username" id="usrUsrName">
            <input name="userData_displayname" id="usrDsplyName">
            <input name="userData_password" id="usrPswd" disabled>
            <input name="userData_email" id="usrEmail">
            <input name="userData_roles" id="usrRoles">
            <input name="userData_created" id="usrCreated">
            <label for="usrId">User ID</label>
            <label for="usrToken">User Token</label>
            <label for="usrUsrName">User Name</label>
            <label for="usrDsplyName">Display Name</label>
            <label for="usrPswd">Password hash</label>
            <label for="usrEmail">Email</label>
            <label for="usrRoles">User Roles</label>
            <label for="usrCreated">Created At</label>
        </div>

        <button class="usrdat_update">Update!</button>
    </div>
        <br/>
        <hr/>
        <br/>
        <div class="form settings" id="settings">
            <h3>Admin account options</h3>
            <button class="maintenanceBypass"></button>
        </div>
        <br/>
        <hr/>
        <br/>
        <div class="form server-settings" id="serverSettings">
            <h3>server options</h3>
            <button class="maintenanceMode"></button>
            <button class="evalBtn"></button>
            <button class="rlSpecBtn"></button>
            <button class="rlAllBtn"></button>
            <button class="rlUserBtn"></button>
            <button class="popupBtn"></button>

        </div>
    `);
  html("[name=userToken]").env(({ set, on, get, add, attr }) => {
    // console.log(get());
    on("input", async (ev) => {
      console.log("change");
      await axios({
        method: "POST",
        url: "/api/users/getRawData",
        data: {
          data: { userToken: get().value },
        },
      }).then(async (resp) => {
        console.log(resp.data);
        localStorage.setItem("usrData:" + resp.data.userName, resp.data);
        _utils.$utils.getDomElement("[name=userData_json]").value =
          JSON.stringify(resp.data);
        html("[name=userData_id]").get().value = resp.data.id;
        html("[name=userData_Token]").get().value = resp.data.userToken;
        html("[name=userData_username]").get().value = resp.data.userName;
        html("[name=userData_displayname]").get().value = resp.data.displayName;
        html("[name=userData_password]").get().value = resp.data.password;
        html("[name=userData_email]").get().value = resp.data.email;
        html("[name=userData_roles]").get().value = resp.data.roles;
        html("[name=userData_created]").get().value = resp.data.createdAt;
      });
    });
  });
  html(".usrdat_update").on("click", async () => {

    const val = _utils.$utils.getDomElement("[name=userData_json]").value

    if (val==undefined||val==null||val=="") return
    else {
      try {
        await JSON.parse(val)
        await send()
      } catch (e) {
        cError(e, "adminPanel.js");
      }
    }
    async function send() {
      await axios({
      method: "POST",
      url: "/api/users/setRawData",
      data: {
        data: val,
      },
    });}
  });
  html("button.maintenanceBypass").env(({ set, on, get, add, attr }) => {
    stateDisplay(Koenk.Get("maintenanceBypass"));

    on("click", () => {
      const state = Koenk.Get("maintenanceBypass");
      const newState = state == "false" ? "true" : "false";

      console.log(state, newState);

      Koenk.Set("maintenanceBypass", newState);
      stateDisplay(newState);
    });

    function stateDisplay(state) {
      set(`maintenanceBypass: ${state}`);
    }
  });

  html("button.maintenanceMode").env(({ set, on, get, add, attr }) => {
    stateDisplay(Koenk.Get("maintenanceMode"));

    on("click", async () => {
      const state = Koenk.Get("maintenanceMode");
      const newState_ = state == "false" ? "true" : "false";
      const newState = newState_ == undefined ? "true" : newState_;

      console.log(state, newState);

      await nfsend("@maintenance set " + newState);
      syncGlobalStateCookies();

      // Koenk.Set("maintenanceBypass", newState);
      stateDisplay(newState);
    });

    function stateDisplay(state) {
      set(`maintenanceMode: ${state}`);
    }
  });
  html("button.popupBtn").env(({ set, on, get, add, attr }) => {
    stateDisplay("");
    on("click", async () => {
      await popup(prompt("title"),prompt("description"))
      stateDisplay("");
    });
    function stateDisplay(state) {
      set(`Popup Modal`);
    }
  });
  html("button.evalBtn").env(({ set, on, get, add, attr }) => {
    stateDisplay("");
    on("click", async () => {
      await nfsend("@eval " + prompt("code"));
      stateDisplay("");
    });
    function stateDisplay(state) {
      set(`Eval`);
    }
  });
  html("button.rlSpecBtn").env(({ set, on, get, add, attr }) => {
    stateDisplay("");
    on("click", async () => {
      await nfsend("@rlSpec " + prompt("reload page:"));
      stateDisplay("");
    });
    function stateDisplay(state) {
      set(`Reload specific page`);
    }
  });  
  html("button.rlUserBtn").env(({ set, on, get, add, attr }) => {
    stateDisplay("");
    on("click", async () => {
      await nfsend("@rlUser " + prompt("reload user:"));
      stateDisplay("");
    });
    function stateDisplay(state) {
      set(`Reload user`);
    }
  });
  html("button.rlAllBtn").env(({ set, on, get, add, attr }) => {
    stateDisplay("");
    on("click", async () => {
      await nfsend("@rl");
      stateDisplay("");
    });
    function stateDisplay(state) {
      set(`Reload All`);
    }
  });
});

async function nfsend(string) {
  return await axios({
    method: "POST",
    url: "/api/addWSCache",
    data: {
      data: {
        authToken: "qnHfAh0q2t7xU2BkIkVdQShx4Y4DVGvd",
        wsIn: {
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
        },
      },
    },
  }).then((resp) => {
    console.log(resp.data);
    return resp;
  });
}

async function popup(title, desc) {
  return await axios({
    method: "POST",
    url: "/api/addWSCache",
    data: {
      data: {
        authToken: "qnHfAh0q2t7xU2BkIkVdQShx4Y4DVGvd",
        wsIn: {
          id: "modal",
          args: {
            title: title,
            content: `<header style="color:var(--theme-fg)">${desc}</header>`,
            targets: ["global"],
          },
        },
      },
    },
  }).then((resp) => {
    console.log(resp.data);
    return resp;
  });
}


// axios({
//   method: "post",
//   url: "/api/users/getAll"
// }).then(resp => {
//   console.log(resp.data)
// })