import axios from "./lib/axios.min.js";
import Utils, {
  Cookies,
  Toast,
  InfoUtils as PageInfo,
  CONFIG as CFG,
  cError,
  cWarn
} from "./lib/Utils.js";
import { RejectPageRequest, CheckIfAdmin } from "./lib/admin.js";

import "./_globals.js";

window.console.warn = (e) => cWarn(e, "viewfile.js")
window.console.error = (e) => cError(e, "viewfile.js")

document.onerror = (e) => cError(e, "viewfile.js")
window.onerror = (e) => cError(e, "viewfile.js")

document.onwarn = (e) => cWarn(e, "viewfile.js")
window.onwarn = (e) => cWarn(e, "viewfile.js")

const author = new Utils().getDomElement("#author").value;
const viewerList = JSON.parse(new Utils().getDomElement("#userList").value);
const loggedinas = () => {
  const _ = localStorage.getItem("username");
  if (_ == null) return "Guest (not logged in)";
  else return _;
};
// alert(author)

async function init() {
  // await axios({
  //   method: "post",
  //   url: "/files/getFile/" + new Utils().getDomElement("#fileid").value,
  // }).then((response) => {
  //   console.log(response.data);
  //   new Utils().getDomElement(".frame").setAttribute("src", response.data);
    
  //   if(response.data.code == 500){
  //     new Utils().getDomElement(".file").innerHTML=`<iframe class="frame" src="${response.data.data}"></iframe>`
  //   }
  // });
  new Utils().getDomElement(".frame").setAttribute("src", "/files/getFile/" + new Utils().getDomElement("#fileid").value);
  if (loggedinas() != author) {
    new Utils().getDomElement(".PermSection").innerHTML = "";
    if (viewerList.includes(loggedinas())) return;
    else if (viewerList.includes("%public")) return;
    return RejectPageRequest(
      "custom",
      `
      You don't have permission to view this file! <br />
      you are logged in as <code>${loggedinas()}</code>, but this file belongs to <code>${author}</code>. <br />
      But the author gave read permission to the following people: <br />
        ${JSON.stringify(viewerList)} <br />
      If one of the listed accounts belongs to you then please log into that account, <br />
        if you are logged into one of those accounts but you still see this message, then please contact the admins.
    `
    );
  }

  listViewers();

  new Utils()
    .getDomElement(".viewerRemove")
    .addEventListener("click", () => userhandler("remove"), true);
  new Utils()
    .getDomElement(".viewerAdd")
    .addEventListener("click", () => userhandler("add"), true);
}

init();

async function listViewers() {
  const viewerListDev = ["user1", "user2", "user3"];
  const _ = viewerList;
  const listElem = new Utils().getDomElement(".viewerList");
  _.forEach((u) => {
    const entryElem = document.createElement("option");
    entryElem.value = u;
    entryElem.text = u;
    listElem.appendChild(entryElem);
  });
}

// const reader = new FileReader();

async function userhandler(type) {
  await axios({
    method: "post",
    url: "/files/changeUser",
    data: {
      id: new Utils().getDomElement("#fileid").value,
      remOrAdd: type,
      usrname: prompt("username"),
    },
  }).then((res => console.log(res.data)));
  // window.location.reload();
}

async function HaveSex() {}
