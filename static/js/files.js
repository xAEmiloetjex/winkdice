import axios from "./lib/axios.min.js";
import Utils, {
  Cookies,
  Toast,
  InfoUtils as PageInfo,
  CONFIG as CFG,
  cError,
  cWarn,
  _utils
} from "./lib/Utils.js";
import { RejectPageRequest, CheckIfAdmin } from "./lib/admin.js";

import "./_globals.js";

window.console.warn = (e) => cWarn(e, "file.js")
window.console.error = (e) => cError(e, "file.js")

document.onerror = (e) => cError(e, "file.js")
window.onerror = (e) => cError(e, "file.js")

document.onwarn = (e) => cWarn(e, "file.js")
window.onwarn = (e) => cWarn(e, "file.js")


localStorage.setItem("username", new Cookies().Get("UsrName"))


const userState = localStorage.getItem("username") != null ? true : false;



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
    url: "/api/result/files",
    params: {
      IsAxios: 1,
    },
  }).then(async (resp) => {
    console.log(await resp.data.post);
    const filesArray = await resp.data.post;
    filesArray.forEach((file, index) => {
      if (file.data.viewers.includes("%public")) {
        new Utils().getDomElement(".public-list").innerHTML += `
        <li>
          <div class="form fileEntry" style="display:flex;">
            <div style="width:var(--preview-width);aspect-ratio:1/1;">
              ${previewImage()}
            </div>
            <div style="width:75%">
              <h4>${file.data.originalname}</h4>
              <code>${file.ID} <h6>Uploaded by: ${file.data.uploader}</h6></code>
              <br />
              <a href="/files/open/${file.ID}" class="button-label" style="background: var(--green_3)">Open</a>
            </div>
          </div>
        </li>
        <br  class="fileDiv" />
      `;
      }
      if (file.data.uploader === localStorage.getItem("username")) {
        (new Utils().getDomElement(".owned-list").innerHTML += `
                <li>
                    <div class="form fileEntry" style="display:flex;">
                        <div style="width:var(--preview-width);aspect-ratio:1/1;">
                          ${previewImage()}
                        </div>
                        <div style="width:75%">
                          <h4>${file.data.originalname}</h4>
                          <code>${file.ID}</code>
                          <br />
                          <br />
                          <a href="/files/open/${file.ID}" class="button-label" style="background: var(--green_3)">Open</a>
                          <a href="/files/delete/${file.ID}" class="button-label" id="delete_${index}" style="background: var(--red_3)" delete-btn>Delete</a>
                          <br />
                        </div>
                      </div>
                    </li>
                    <br  class="fileDiv" />
            `);
        // return new Utils().getDomElement(`[id=delete_${index}]`).addEventListener("click", async (e) => {
        //   e.preventDefault()
        //   await axios({
        //     method: "post",
        //     url: "/files/delete/" + file.ID,
        //     params: {
        //       IsAxios: 1,
        //     },
        //   }).then(() => window.location.reload())
        // })
      }
      else if (file.data.viewers.includes(localStorage.getItem("username")))
        return (new Utils().getDomElement(".viewer-list").innerHTML += `
        <li>
            <div class="form fileEntry" style="display:flex;">
              <div style="width:var(--preview-width);aspect-ratio:1/1;">
                ${previewImage()}
              </div>
                <div style="width:75%">
                <h4>${file.data.originalname}</h4>
                <code>${file.ID} <h6>Uploaded by: ${file.data.uploader}</h6></code>
                <br />
                <a href="/files/open/${file.ID}" class="button-label" style="background: var(--green_3)">Open</a>  
              </div>
            </div>
          </li>
          <br  class="fileDiv" />
    `);
      else return;

      function previewImage() {
        if (String(file.data.mimetype).startsWith("image")) return `<img 
        class="preview_${file.ID}" 
        src="/files/getFile/${file.ID}" 
        style="width:100%;height:100%;" 
        onerror="this.onerror=null; this.src='/NoPreview.png'"
        alt=""
      />`
        else return `<img 
        class="preview_${file.ID}" 
        src="/NoPreview.png" 
        style="width:100%;height:100%;" 
        onerror="this.onerror=null; this.src='/NoPreview.png'"
        alt=""
      />`
        // console.log(file.data.mimetype)
        // return ""
      }
    });
  });
}

init();