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
  CheckIfAdminSync,
  CheckIfLoggedIn,
  RejectIfNotAdmin,
  RejectPageRequest,
} from "../lib/admin.js";
import { html } from "../lib/framework/index.js";

let userState = {
  loggedIn: CheckIfLoggedIn(),
  admin: (await CheckIfAdmin())
}

// if (!CheckIfLoggedIn()) RejectPageRequest("NoAdmin");
// if (!(await CheckIfAdmin())) RejectPageRequest("NoAdmin");

window.console.warn = (e) => cWarn(e, "adminPanel.js");
window.console.error = (e) => cError(e, "adminPanel.js");
document.onerror = (e) => cError(e, "adminPanel.js");
window.onerror = (e) => cError(e, "adminPanel.js");
document.onwarn = (e) => cWarn(e, "adminPanel.js");
window.onwarn = (e) => cWarn(e, "adminPanel.js");

const Koenk = new Cookies();

const pagenum = html("[name=pagenum]").attr("value").get()
const reportnum = html("[name=reportnum]").attr("value").get()

const page = await axios({
    method: "POST",
    url: "/api/bug/getReport/" + pagenum + "/" + reportnum
}).then(resp => resp.data)

console.log(page)

const bugs = [page.table]
// console.log(bugs)

// html(".vagina-tion").env(({ set, on, get, add, attr }) => {
//     for (let i = 0; i < page.pagesLength; i++) {
//         add(`
//             <a href="/bugs/page/${i}" class="${i==pagenum?"active":"inactive"}">${i+1}</a>
//         `)
//     }
// })

// html(".buglist").env(({ set, on, get, add, attr }) => {
//     for (const bug of bugs) {
//         let desc = "";
//         const desc1 = String(bug.description);

//         if (desc1.length > 30) desc = desc1.slice(0, 30) + " ..."
//         else desc = desc1


//         add(`
//             <li class="form">
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
//             </li> 
//             <br/>
//         `)
//     }
// });
html(".report").env(({ set, on, get, add, attr }) => {
    for (const bug of bugs) {
        let desc = "";
        const desc1 = String(bug.description);

        // if (desc1.length > 30) desc = desc1.slice(0, 30) + " ..."
        // else
        desc = desc1


        add(`
          <header style="display:flex">
              <code class="button-label bug-tag bug-${bug.severity}">BUG:${bug.id}</code>
              <hr />
              <code class="button-label" style="background:var(--theme-bg-shade-4)">${bug.platform}</code>
              <span style="color:var(--theme-bg-shade-2)">----</span>
              <span>By: ${bug.user}</span>
          </header>
          ${(() => {
            let str = ""
            if ((userState.admin)) {
              str += `
                <h4 for="adminActions">Admin Actions</h4>
                <div class="admin-action form" id="adminActions" style="border: 1px var(--theme-fg) solid;padding:1rem;">
                  <a href="/api/bug/delete/${bug.id}" class="button-label" id="delete_0" style="background: var(--red_3)" delete-btn="">Delete</a>
                  <a href="/bugs/edit/${pagenum}/${reportnum}" class="button-label" id="edit_0" style="background: var(--blue_3)" edit-btn="">Edit</a>
                </div>
                <hr />
              `
            }
            return str
          })()}
          <h3>${bug.title}</h3>
          <hr/>
          <p>${desc}</p>
        `)
    }
});
