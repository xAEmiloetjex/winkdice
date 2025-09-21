import axios from "../lib/axios.min.js";
import Utils, {
  Cookies,
  Toast,
  InfoUtils as PageInfo,
  CONFIG as CFG,
  cError,
  cWarn,
  _utils
} from "../lib/Utils.js";
import {
    CheckIfAdmin,
    CheckIfLoggedIn,
    RejectIfNotAdmin,
    RejectPageRequest,
  } from "../lib/admin.js";

import "../_globals.js";

import { html } from "../lib/framework/index.js";

window.console.warn = (e) => cWarn(e, "file.js")
window.console.error = (e) => cError(e, "file.js")

document.onerror = (e) => cError(e, "file.js")
window.onerror = (e) => cError(e, "file.js")

document.onwarn = (e) => cWarn(e, "file.js")
window.onwarn = (e) => cWarn(e, "file.js")

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

localStorage.setItem("username", new Cookies().Get("UsrName"))


const userState = localStorage.getItem("username") != null ? true : false;

const filter = html("input#filter")

async function init() {
  if (userState == false)
    return RejectPageRequest(
      "custom",
      "You need to be logged in to view this page"
    );
  await axios({
    method: "post",
    url: "/api/users/getRawData",
    data: {
      data: {
        userName: localStorage.getItem("username")
      }
    }
  }).then((res) => {
    console.log(res.data)
    _utils.$utils.getDomElement("#user").value = JSON.stringify(res.data)
  })
  await axios({
    method: "post",
    url: "/api/users/getAll",
    params: {
      IsAxios: 1,
    },
  }).then(async (resp) => {
    console.log(await resp.data.post);
    const filesArray = await resp.data;
    filesArray.forEach((file, index) => {
        const isBanned = file.roles.includes("banned")
        html(".list").env(({ set, on, get, add, attr }) => {
            add(`
                <li>
                    <div class="form fileEntry" style="display:flex;">
                        <div style="width:75%">
                          <h4>${file.userName}</h4>
                          <span>ID: <code>${file.id}</code></span>
                          <span>Token: <code>${file.userToken}</code></span>
                          <br />
                          <br />
                          <a href="/api/users/deleteAdmin/${file.userToken}" class="button-label" id="delete_${index}" style="background: var(--red_3)" delete-btn>Delete</a>
                          <a href="/api/users/banAdmin/${file.userToken}" class="button-label" id="delete_${index}" style="background: var(${isBanned ? "--green_3" : "--red_3"})" delete-btn>${isBanned ? "Unban" : "ban"}</a>
                          <br />
                        </div>
                    </div>
                </li>
                <br  class="fileDiv" />`);
            html(`#delete_${index}`).env(({ set, on, get, add, attr }) => {
                
            })
        })


      function previewImage() {
        if(String(file.data.mimetype).startsWith("image")) return `<img src="/files/getFile/${file.ID}" style="width:100%;height:100%;" />`
        else return ""
        // console.log(file.data.mimetype)
        // return ""
      }
    });
  });
}

init();

const filesArray = await axios({
    method: "post",
    url: "/api/users/getAll",
    params: {
      IsAxios: 1,
    },
  }).then((resp) => resp.data);

console.log("filesArray_GLOB", filesArray)

filter.env(({ set, on, get, add, attr }) => {

    on("input", () => {
        const val = get().value
        if (val == "") return (() => {html(".list").set(``);init()})()
        else return setList(val)
    })
})

html(".filter_tooltip").attr("title").set(`
+========================================+
|     HEHEHEHE GET FUCKED HEHEHEHHE      |
+========================================+
`)

/**
 * 
 * @param {string} filter 
 */
function setList(filter) {
    const splitted = filter.split(":")
    const filt = splitted[0]
    const val = splitted[1]

    html(".list").set(``)

    filesArray.forEach((file, index) => {
        html(".list").env(({ set, on, get, add, attr }) => {

            if(filt == "usr" && String(file.data.uploader).startsWith(val)) Add();
            else if (filt == "name" && String(file.data.originalname).startsWith(val)) Add();
            else if (filt == "id" && String(file.ID).startsWith(val)) Add();
            else if (filt == "mime" && String(file.data.mimetype).startsWith(val)) Add();
            else if (String(file.data.originalname).startsWith(filter)) Add();
            else return;

            function Add() {
            add(`
            <li>
            <div class="form fileEntry" style="display:flex;">
                <div style="width:75%">
                  <h4>${file.userName}</h4>
                  <span>ID: <code>${file.id}</code></span>
                  <span>Token: <code>${file.userToken}</code></span>
                  <br />
                  <br />
                  <a href="/files/open/${file.ID}" class="button-label" style="background: var(--green_3)">Open</a>
                  <a href="/files/deleteAdmin/${file.ID}" class="button-label" id="delete_${index}" style="background: var(--red_3)" delete-btn>Delete</a>
                  <br />
                </div>
            </div>
        </li>
        <br  class="fileDiv" />`);}
        })


      function previewImage() {
        if(String(file.data.mimetype).startsWith("image")) return `<img src="/files/getFile/${file.ID}" style="width:100%;height:100%;" />`
        else return ""
        // console.log(file.data.mimetype)
        // return ""
      }
    });
}