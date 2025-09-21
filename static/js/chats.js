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

import { RejectPageRequest } from "./lib/admin.js";

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


await axios({
    method: "POST",
    url: "/api/dm/getChats",
    data: {
        data: {
            user: _utils.$cookies.Get("UsrName")
        }
    }
}).then(async resp => {
    console.log(resp.data)
    const container = _utils.$utils.getDomElement("#dms")
    resp.data.chats.forEach(async chat => {
        const otherPerson = chat.user1 == _utils.$cookies.Get("UsrName") ? chat.user2 : chat.user1
        console.log(chat.id)
        const lastMsg = await axios({
            method: "POST",
            url: "/api/dm/getChatByID",
            data: {data: {
                    id: chat.id,
                    singleProp: false,
                    prop: "id"
                }}
        }).then(async resp => await axios({
            method: "POST",
            url: "/api/dm/getMessages",
            data: {data: {
                target: resp.data.user2,
                sender: resp.data.user1,
                onlyLast: true
            }}
        }).then(resp => resp.data))
        console.log(lastMsg)


        const chat_ = document.createElement("div");
        chat_.className = "form chatlistEntry";
        chat_.innerHTML = `
        <button class="deleteDm-${chat.id}" data-colorscheme="red">Delete</button>
        <a href="/dm/${otherPerson}" class="" style="background:var(--theme-bg);">
        <h3>${otherPerson}</h3>
        <br>
        <div class="lastMessage">
            <span class="message_sender">${lastMsg.messages[0].sendBy}:</span>
            <span class="message_content">${lastMsg.messages[0].content}</span>
        </div>    
        </a> 
        `

        container.appendChild(chat_);

        _utils.$utils
        .getDomElement(`.deleteDm-${chat.id}`)
        .addEventListener("click", async () => {
          const isSure = confirm("Are you sure you want to delete this DM chat?");
          if (isSure) {
            await axios({
              method: "POST",
              url: "/api/dm/delete",
              data: {
                data: {
                  chat,
                  user: {
                    name: _utils.$cookies.Get("UsrName"),
                    token: _utils.$cookies.Get("UsrToken"),
                  },
                },
              },
            }).then((res) => {window.location.reload()});
          } else return;
        });
    })
})

await axios({
    method: "POST",
    url: "/api/chat/getChats",
    data: {
        data: {
            user: _utils.$cookies.Get("UsrName")
        }
    }
}).then(async resp => {
    console.log(resp.data)
    const container = _utils.$utils.getDomElement("#own")
    resp.data.chats.forEach(async chat => {
        const otherPerson = chat.name
        // console.log(chat.id, chat)
        const chat__ = await axios({
            method: "POST",
            url: "/api/chat/getChatByID",
            data: {data: {
                    id: chat.id,
                    singleProp: false,
                    prop: "id"
                }}
        }).then(resp => resp.data)
        // await console.log(chat__)
        const lastMsg = await axios({
            method: "POST",
            url: "/api/chat/getMessages",
            data: {data: {
                target: chat__.name,
                onlyLast: true
            }}
        }).then(resp => resp.data)
        // console.log(lastMsg)


        const chat_ = document.createElement("div");
        chat_.className = "form chatlistEntry";
        chat_.innerHTML = `
        <button class="deleteChat-${chat.id}" data-colorscheme="red">Delete</button>
        <a href="/chat/${otherPerson}" class="" style="background:var(--theme-bg);">
        <h3>${otherPerson}</h3>
        <br>
        <div class="lastMessage">
            <span class="message_sender">${lastMsg.messages[0].sendBy}:</span>
            <span class="message_content">${lastMsg.messages[0].content}</span>
        </div>    
        </a> 
        `

        container.appendChild(chat_);

        _utils.$utils
        .getDomElement(`.deleteChat-${chat.id}`)
        .addEventListener("click", async () => {
          const isSure = confirm("Are you sure you want to delete this chat?");
          if (isSure) {
            await axios({
              method: "POST",
              url: "/api/chat/delete",
              data: {
                data: {
                  chat,
                  user: {
                    name: _utils.$cookies.Get("UsrName"),
                    token: _utils.$cookies.Get("UsrToken"),
                  },
                },
              },
            }).then((res) => {window.location.reload()});
          } else return;
        });
    })
})


const dmName = _utils.$utils.getDomElement(".dm_n")
const chatName = _utils.$utils.getDomElement(".chat_n")
const dmbtn = _utils.$utils.getDomElement(".newDM_b")
const chatbtn = _utils.$utils.getDomElement(".newchat_b")

dmbtn.addEventListener("click", () => {
    window.location.href = "/dm/" + dmName.value
})

chatbtn.addEventListener("click", () => {
    window.location.href = "/chat/" + chatName.value
})