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
import { socket } from "../_globals.js"
import { CheckIfAdmin, CheckIfLoggedIn, RejectIfNotAdmin, RejectPageRequest } from "../lib/admin.js";
import { html } from "../lib/framework/index.js";

if (!CheckIfLoggedIn()) RejectPageRequest("NoAdmin")
if (!(await CheckIfAdmin())) RejectPageRequest("NoAdmin")

window.console.warn = (e) =>   cWarn(e, "adminPanel.js");
window.console.error = (e) => cError(e, "adminPanel.js");
document.onerror = (e) =>     cError(e, "adminPanel.js");
window.onerror = (e) =>       cError(e, "adminPanel.js");
document.onwarn = (e) =>       cWarn(e, "adminPanel.js");
window.onwarn = (e) =>         cWarn(e, "adminPanel.js");

const Koenk = new Cookies()

_utils.$utils.getDomElement(".notif-btn").addEventListener("click", (ev) => {
    ev.preventDefault()
    socket.emit("notification_send", _utils.$utils.getDomElement("[name=NotifyText]").value)
})
_utils.$utils.getDomElement(".backend-btn").addEventListener("click", async (ev) => {
    ev.preventDefault()
    await axios({
        method: "POST",
        url: "/api/execOnBackend",
        data: {
            data: (_utils.$utils.getDomElement("[name=BackendText]").value)
        }
    }).then(async resp => {
        console.log(resp.data)
    })
})

_utils.$utils.getDomElement("[name=userToken]").addEventListener("input", async (ev) => {
    console.log("change")
    await axios({
        method: "POST",
        url: "/api/users/getRawData",
        data: {
            data: {userToken: ev.target.value}
        }
    }).then(async resp => {
        console.log(resp.data)
        localStorage.setItem("usrData:"+resp.data.userName, resp.data)
        _utils.$utils.getDomElement("[name=userData_json]").value=JSON.stringify(resp.data)
    })
})

_utils.$utils.getDomElement(".usrdat_update").addEventListener("click", async () => {
    await axios({
        method: "POST",
        url: "/api/users/setRawData",
        data: {
            data: _utils.$utils.getDomElement("[name=userData_json]").value
        }
    })
})

html("main#main").env(({ set, on, get, add, attr }) => {
    add(`
        <br/>
        <hr/>
        <br/>
        <div class="form settings" id="settings">
            <h3>Admin account options</h3>
            <button class="maintenanceBypass"></button>
        </div>
    `)
    html("button.maintenanceBypass").env(({ set, on, get, add, attr }) => {
        stateDisplay(Koenk.Get("maintenanceBypass"))

        on("click", () => {
            const state = Koenk.Get("maintenanceBypass")
            const newState = state == "false" ? "true" : "false"

            console.log(state, newState)

            Koenk.Set("maintenanceBypass", newState)
            stateDisplay(newState)
        })

        function stateDisplay(state) {
            set(`maintenanceBypass: ${state}`)
        }
    })
})