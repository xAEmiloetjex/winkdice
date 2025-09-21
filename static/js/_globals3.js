import Utils, {
  Cookies,
  Toast,
  InfoUtils as PageInfo,
  CONFIG,
  cError,
  cWarn,
  mmext,
  _utils,
} from "./lib/Utils.js";
import { html } from "./lib/framework/index.js";
import { EventEmitter } from "./lib/frontend.js/Events_alt.js";
import { HEX_CHAR_LIST } from "./lib/frontend.js/core/types/constants_1.js";
import { mkRandStr2 } from "./lib/frontend.js/core/utils/common.js";
import { Cache } from "./lib/frontend.js/front-end_cache.js";
import { winkdice_logo } from "./lib/svg_icons/winkdice-logo.js";
import { LogHandler } from "./lib/frontend.js/logHandler.js";
import { Logger } from "./lib/frontend.js/logger.js";

const modals = new mmext("mmext_neoUIv1_");

let _this_ = {};
_this_["platform"] = {
  name: "WinkDice",
};

_this_["data"] = {
  main: {
    message: "Hello, new User!",
    desc: `
    <h3 class="desc">As this is your first time visiting..</h3>
    <ul class="list">
      <li class="item"><a href="/login">Why don't you make an account?</a></li>
    </ul>
    `,
  },
};

let NeoModal_1 = {};
NeoModal_1["message_markup"] = `
<div class="form neoUIv1_modal_mesg">
  <div class="title-container">
    <div class="logo">
      ${winkdice_logo(64, 64)} <span class="logo-title">WinkDice</span>
    </div>
    <br/>
    <span class="title">${_this_.data.main.message}</span>
  </div>
  <div class="content-container">
    ${_this_.data.main.desc}
  </div>
  <div class="footer-container">
    <button class="modal__btn allow neoUIv1_btn" data-micromodal-close aria-label="" neoModal-btn="close_first" onclick="sessionStorage.setItem('aelb_ev:click:_CloseHelloWorld', 'true')">close</button>
  </div>
</div>
`;

NeoModal_1["id"] = modals.create(
  NeoModal_1.message_markup,
  false,
  "neoUIv1_modal"
).id;

export function HelloWorldModal() {
  modals.show({ targets: "storage" }, NeoModal_1.id, true);

  const btn_ = html("[neoModal-btn=close_first]")

  let btn_countdown = 10
  btn_.attr("disabled").set("")
  btn_.set(`Close (10)`)
  const countDown = setInterval(() => {
    const btn_ = html("[neoModal-btn=close_first]")
    // console.log("assdgdsgh", btn_)
    btn_countdown--
    btn_.set(`Close (${btn_countdown})`)
    if (btn_countdown < 1) {
      btn_.attr("disabled").remove()
      btn_.set('Close')
      clearInterval(countDown)
    }
  }, 1000)

  const evHandler__ = setInterval(() => {
    // sessionStorage.setItem("antiEventListenerBypass", )
    if (sessionStorage.getItem("aelb_ev:click:_CloseHelloWorld") == "true") {
      sessionStorage.setItem("aelb_ev:click:_CloseHelloWorld", "");
      // console.log("AntiBypass is triggered");
      // HandleAllowEVENT();
      modals.close({ targets: "storage" }, NeoModal_1.id, true);
      clearInterval(evHandler__);
    }
  }, 100);
}

// export function RejectIfNotAdmin() {
//   if (!CheckIfAdmin()) RejectPageRequest("NoAdmin");
// }

// export async function checkIfBanned() {
//   console.log(await CheckIfHasRole("banned"))
//   if (await CheckIfHasRole("banned") == false) return
//   else {
//     RejectPageRequest("banned")
//     setInterval(async () => {

//     }, 100)
//   }
// }

export const EV = new EventEmitter();
export const logHandler = new LogHandler({
  error:  (err) => {
    warnModal([{
      title: "Error",
      desc: err,
      btnTimeout: 0
    }])
  },
  warn:   (err) => {
    warnModal([{
      title: "Warning",
      desc: err,
      btnTimeout: 0
    }])
  },
  info:   (err) => {
    warnModal([{
      title: "Info",
      desc: err,
      btnTimeout: 0
    }])
  },
  debug:  (err) => {
    warnModal([{
      title: "Debug",
      desc: err,
      btnTimeout: 0
    }])
  },
});

const colorHandler = {
  blue: (inp) => inp,
  yellow: (inp) => inp,
  red: (inp) => inp,
  green: (inp) => inp,
  magenta: (inp) => inp,
};

logHandler.appendNewLogger(new Logger("<LogHandler>", console, colorHandler))

EV.on("warnModal", (opts) => warnModal(opts))

function warnModal(opts) {
  console.log(opts)
  const {title,desc,btnTimeout} = opts
  let btnTime = 10;
  if (btnTimeout !== undefined) btnTime = btnTimeout
  console.log(btnTime, btnTimeout)
  const ID_ = mkRandStr2(8, HEX_CHAR_LIST)
  let _this2_ = {}
  _this2_["data2"] = {
    main: {
      message: title,
      desc: desc,
    },
  };
  
  let NeoModal_2 = {};
  NeoModal_2["message_markup"] = `
  <div class="form neoUIv1_modal_mesg">
    <div class="title-container">
      <div class="logo">
        ${winkdice_logo(64, 64)} <span class="logo-title">WinkDice</span>
      </div>
      <br/>
      <span class="title">${_this2_.data2.main.message}</span>
    </div>
    <div class="content-container">
      ${_this2_.data2.main.desc}
    </div>
    <div class="footer-container">
      <button class="modal__btn allow neoUIv1_btn" data-micromodal-close aria-label="" neoModal-btn="close_first_${ID_}" onclick="sessionStorage.setItem('aelb_ev:click:_Close_${ID_}', 'true')">close</button>
    </div>
  </div>
  `;
  
  NeoModal_2["id"] = modals.create(
    NeoModal_2.message_markup,
    false,
    "neoUIv1_modal"
  ).id;
  
  function ModalSetup() {
    modals.show({ targets: "storage" }, NeoModal_2.id, true);
  
    const btn_ = html(`[neoModal-btn=close_first_${ID_}]`)
  
    let btn_countdown = btnTime
    btn_.attr("disabled").set("")
    btn_.set(`Close (10)`)
    const countDown = setInterval(() => {
      const btn_ = html(`[neoModal-btn=close_first_${ID_}]`)
      // console.log("assdgdsgh", btn_)
      btn_countdown--
      btn_.set(`Close (${btn_countdown})`)
      if (btn_countdown < 1) {
        btn_.attr("disabled").remove()
        btn_.set('Close')
        clearInterval(countDown)
      }
    }, btnTime > 0 ? btnTime : 0)
  
    const evHandler__ = setInterval(() => {
      // sessionStorage.setItem("antiEventListenerBypass", )
      if (sessionStorage.getItem(`aelb_ev:click:_Close_${ID_}`) == "true") {
        sessionStorage.setItem(`aelb_ev:click:_Close_${ID_}`, "");
        // console.log("AntiBypass is triggered");
        // HandleAllowEVENT();
        modals.close({ targets: "storage" }, NeoModal_2.id, true);
        modals.delete(NeoModal_2.id, true)
        clearInterval(evHandler__);
      }
    }, 100);
  }
  
  ModalSetup()
}

// logHandler.__debug("A")
// logHandler.__info ("B")
// logHandler.__warn ("C")
// logHandler.__error("D")

