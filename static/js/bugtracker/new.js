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
import { socket } from "../_globals.js";
import {
  CheckIfAdmin,
  CheckIfLoggedIn,
  RejectIfNotAdmin,
  RejectPageRequest,
} from "../lib/admin.js";
import { html } from "../lib/framework/index.js";

// if (!CheckIfLoggedIn()) RejectPageRequest("NoAdmin");
// if (!(await CheckIfAdmin())) RejectPageRequest("NoAdmin");

window.console.warn = (e) => cWarn(e, "adminPanel.js");
window.console.error = (e) => cError(e, "adminPanel.js");
document.onerror = (e) => cError(e, "adminPanel.js");
window.onerror = (e) => cError(e, "adminPanel.js");
document.onwarn = (e) => cWarn(e, "adminPanel.js");
window.onwarn = (e) => cWarn(e, "adminPanel.js");

const Koenk = new Cookies();

const getPlatform = () =>
  document.querySelector(`input[name="platform"]:checked`) == null
    ? undefined
    : document.querySelector(`input[name="platform"]:checked`).value;
const getSeverity = () =>
  document.querySelector(`input[name="severity"]:checked`) == null
    ? undefined
    : document.querySelector(`input[name="severity"]:checked`).value;
const getTitle = () => document.querySelector(`input[name="title"]`).value;
const getDesc = () => document.querySelector(`textarea[name="desc"]`).value;

html(`input[name=submit]`).on("click", ({ set, on, get, add, attr }) => {
  const report = {
    platform: getPlatform(),
    user: Koenk.Get("UsrName"),
    severity: getSeverity(),
    title: getTitle(),
    description: getDesc(),
  };

  if (report.platform == null || report.platform == undefined)
    return alert('Please select an option under "Platform"');
  if (report.severity == null || report.severity == undefined)
    return alert('Please select an option under "Severity"');
  if (report.title == "" || report.title == null || report.title == undefined)
    return "Please enter a title";
  if (
    report.description == "" ||
    report.description == null ||
    report.description == undefined
  )
    return alert('Please enter a description (or put a "-" there)');
  if (report.user == "" || report.user == null || report.user == undefined)
    return (() => {
      alert(
        "You are not logged in, if you exit this dialog then you will be redirected to login"
      );
      window.location.href = "/login";
    })();
  (async () => {
    await axios({
      method: "POST",
      url: `/api/bug/new`,
      data: { data: report },
    }).then(() => {
      new Toast({
        text: "Send report!",
      });
    });
  })();
});

// html(".report").env(({ set, on, get, add, attr }) => {
//     for (const bug of bugs) {
//         let desc = "";
//         const desc1 = String(bug.description);

//         // if (desc1.length > 30) desc = desc1.slice(0, 30) + " ..."
//         // else
//         desc = desc1

//         add(`
//                 <header style="display:flex">
//                     <code class="button-label bug-tag bug-${bug.severity}">BUG:${bug.id}</code>
//                     <hr />
//                     <code class="button-label" style="background:var(--theme-bg-shade-4)">${bug.platform}</code>
//                     <span style="color:var(--theme-bg-shade-2)">----</span>
//                     <span>By: ${bug.user}</span>
//                 </header>
//                 <h3>${bug.title}</h3>
//                 <hr/>
//                 <p>${desc}</p>
//         `)
//     }
// });
