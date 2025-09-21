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

// RejectPageRequest("custom", "Page closed down because of a <a href=\"\/bugs/page/0/1\">FATAL bug</a>")

import "./_globals.js";
import { socket } from "./_globals.js"

window.console.warn = (e) =>   cWarn(e, "chat.js");
window.console.error = (e) => cError(e, "chat.js");
document.onerror = (e) =>     cError(e, "chat.js");
window.onerror = (e) =>       cError(e, "chat.js");
document.onwarn = (e) =>       cWarn(e, "chat.js");
window.onwarn = (e) =>         cWarn(e, "chat.js");

const cookie = new Cookies();
let toast;
const PI = new PageInfo();

let LastMessageIndex = 0;

const form = _utils.$utils.getDomElement(".messageBox")
form.addEventListener("submit", async (ev) => {
    ev.preventDefault()
    const mesg = _utils.$utils.getDomElement(".message")
    await axios({
        method: "POST",
        url: "/api/dm/send",
        data: {
            data: {
                authToken: _utils.$cookies.Get("UsrToken"),

                target: (_utils.$utils.getDomElement(".chatTarget")).value,
                sender: _utils.$cookies.Get("UsrName"),
                content: mesg.value
            }
        }
    }).then(async resp => {
        console.log(resp.data)
        loadMessages(true)
    })
})

socket.on("newMessage", (data) => {
    // console.log("[WS DEBUGGER]: ", "newMessage", data)
    if (data.target == _utils.$cookies.Get("UsrName")) loadMessages(true)
})

/**
 * 
 * @param {boolean} onlyLast 
 */
async function loadMessages(onlyLast) {
    await axios({
        method: "POST",
        url: "/api/dm/getMessages",
        data: {
            data: {
                target: (_utils.$utils.getDomElement(".chatTarget")).value,
                sender: _utils.$cookies.Get("UsrName"),
                onlyLast: onlyLast == true ? true : false
                // content: mesg.value
            }
        }
    }).then(async resp => {
        console.log(JSON.stringify(resp.data))
        if (onlyLast == true) resp.data.messages.forEach((msg, ind) => renderMessage(msg, LastMessageIndex))
        else resp.data.messages.forEach(renderMessage)
    })
}
function renderMessage(message, index) {
    index = "_" + index

    const isYou = _utils.$cookies.Get("UsrName") == message.sendBy ? "you" : "other"

    const mesg = document.createElement("div")
    mesg.className = "mesg " + isYou
    mesg.setAttribute("data-index", index)
    _utils.$utils.getDomElement(".messages").appendChild(mesg)
    const mesgElem = _utils.$utils.getDomElement("[data-index="+index+"]")
    const sendBy = document.createElement("div")
    sendBy.className = "sendBy"
    sendBy.setAttribute("data-index", index)
    sendBy.innerHTML=`<span class="name">${message.sendBy}</span> <span class="date">${message.createdAt}</span>`;
    mesgElem.appendChild(sendBy)
    const content = document.createElement("div")
    content.className = "content"
    content.setAttribute("data-index", index)
    content.innerHTML=_utils.$utils.chatFormat(message.content)
    mesgElem.appendChild(content)

    return LastMessageIndex++
}

loadMessages()

if (!(await CheckIfLoggedIn())) {
    RejectPageRequest("custom", "you are not logged in!<br/>redirecting to login page in 5 seconds!");
    setTimeout(() => {window.location.replace("/login")}, 5000)
} 