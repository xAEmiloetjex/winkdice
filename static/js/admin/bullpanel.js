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

if (!CheckIfLoggedIn()) REJECTED()
if (!(await CheckIfAdmin())) REJECTED()

window.console.warn = (e) => cWarn(e, "bullpanel.js");
window.console.error = (e) => cError(e, "bullpanel.js");
document.onerror = (e) => cError(e, "bullpanel.js");
window.onerror = (e) => cError(e, "bullpanel.js");
document.onwarn = (e) => cWarn(e, "bullpanel.js");
window.onwarn = (e) => cWarn(e, "bullpanel.js");

const Koenk = new Cookies();


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