import axios from "/js/lib/axios.min.js";

import Utils, {
  Cookies,
  Toast,
  InfoUtils as PageInfo,
  CONFIG as CFG,
  cError,
  cWarn,
  _utils,
} from "./lib/Utils.js";

import { CheckIfLoggedIn, RejectPageRequest } from "./lib/admin.js";

import "./_globals.js";
import { socket } from "./_globals.js"
import { html } from "./lib/framework/index.js";

window.console.warn = (e) =>   cWarn(e, "chat.js");
window.console.error = (e) => cError(e, "chat.js");
document.onerror = (e) =>     cError(e, "chat.js");
window.onerror = (e) =>       cError(e, "chat.js");
document.onwarn = (e) =>       cWarn(e, "chat.js");
window.onwarn = (e) =>         cWarn(e, "chat.js");

const cookie = new Cookies();
let toast;
const PI = new PageInfo();

const status = html("#status").get().value
const reason = html("#reason").get().value

RejectPageRequest("custom", reason)