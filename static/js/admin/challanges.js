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

// const filter = html("input#filter")

async function init() {
  if (userState == false)
    return RejectPageRequest(
      "custom",
      "You need to be logged in to view this page"
    );
  await axios({
    method: "post",
    url: "/api/challanges/getRawData",
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
    method: "get",
    url: "/api/challanges/getAll",
    params: {
      IsAxios: 1,
    },
  }).then(async (resp) => {
    console.log(resp);
    let filesArray = Array.isArray(await resp.data) ? await resp.data : [];
    filesArray.push({
        isNew: true,
        timeBoundaries: {
          start: '1970-01-01 00:00:01',
          end: '1970-01-01 00:00:01'
        },
        question: '<NEW QUESTION>',
        answers: ['<NEW ANSWER>']
    })
    filesArray.forEach((file, index) => {
      html(".list").env(({ set, on, get, add, attr }) => {
        console.log(index, file)
        add(`
            <li>
                <div class="form fileEntry" style="display:flex;">
                    <div style="width:75%">
                      <span>ID: <code>${index}</code> ${file.isNew ? "(This one doesn't exist yet but will be pushed anyways if you press edit, thus adding a new one with the submitted data)" : ""}</span>
                      <label for="question_${index}">
                        <h2>Question:</h2>
                        <input type="text" name="question_${index}" id="question_${index}" value="${file.question}">
                      </label>
                      <hr />
                      <label for="startDate_${index}">
                        <h4>startDate:</h4>
                        <input type="text" name="startDate_${index}" id="startDate_${index}" value="${file.timeBoundaries.start}">
                      </label><br/>
                      <label for="endDate_${index}">
                        <h4>endDate:</h4>
                        <input type="text" name="endDate_${index}" id="endDate_${index}" value="${file.timeBoundaries.end}">
                      </label>
                      <hr/>
                      <label for="answers_${index}">
                        <h4>answers: (split by ';')</h4>
                        <input type="text" name="answers_${index}" id="answers_${index}" value="${file.answers.join(";")}">
                      </label>
                      <br />
                      <br />
                      <a href="/api/challanges/delete/${index}" class="button-label" id="delete_${index}" style="background: var(--red_3)" delete-btn>Delete</a>
                      <button
                        class="button-label" id="set_${index}" 
                        style="background: var(--orange_3)"
                        onclick="sessionStorage.setItem('chal_edit_ev:click:_edit', '${index}')" 
                        delete-btn
                      >Edit</button>

                      <br />
                    </div>
                </div>
            </li>
            <br  class="fileDiv" />`);
            // _utils.$utils.getDomElement(`#question_${index}`  ).value = file.question
            // _utils.$utils.getDomElement(`#startDate_${index}` ).value = file.timeBoundaries.start
            // _utils.$utils.getDomElement(`#endDate_${index}`   ).value = file.timeBoundaries.end
            // _utils.$utils.getDomElement(`#answers_${index}`   ).value = file.answers.join(';')

        html(`#delete_${index}`).env(({ set, on, get, add, attr }) => {
            
        })
    })
    });
  });
}

setInterval(() => {
  const val = sessionStorage.getItem("chal_edit_ev:click:_edit")
  // sessionStorage.setItem("antiEventListenerBypass", )
  if (val != 'false') {
    sessionStorage.setItem("chal_edit_ev:click:_edit", 'false');
    console.log("edit_event Triggered", val);
    axios({
      method: "post",
      url: String("/api/challanges/set/" + Number(val)),
      params: {
        IsAxios: 1,
      },
      data: {
        timeBoundaries: {
          start: _utils.$utils.getDomElement(`#startDate_${val}` ).value,
          end: _utils.$utils.getDomElement(`#endDate_${val}` ).value,
        },
        question: _utils.$utils.getDomElement(`#question_${val}`  ).value,
        answers: String(_utils.$utils.getDomElement(`#answers_${val}`   ).value).split(';')
      }
    }).then(async (resp) => {
      console.log (resp, val)
    })
  }
}, 100);

// const arr_47 = [
//   {
//     timeBoundaries: {
//       start: '2024-06-13 00:00:01',
//       end: '2025-01-01 00:00:01'
//     },
//     question: 'Why are you gay?',
//     answers: ['because yes', 'yes']
//   }
// ]
// arr_47.forEach((file,index) => ChallangeDisplay(file,index))

init();

const filesArray = await axios({
    method: "post",
    url: "/api/challanges/getAll",
    params: {
      IsAxios: 1,
    },
  }).then((resp) => resp.data);

console.log("filesArray_GLOB", filesArray)

// filter.env(({ set, on, get, add, attr }) => {

//     on("input", () => {
//         const val = get().value
//         if (val == "") return (() => {html(".list").set(``);init()})()
//         else return setList(val)
//     })
// })

// html(".filter_tooltip").attr("title").set(`
// +========================================+
// |     HEHEHEHE GET FUCKED HEHEHEHHE      |
// +========================================+
// `)

function ChallangeDisplay(file,index) {
  // const isBanned = file.roles.includes("banned")
}