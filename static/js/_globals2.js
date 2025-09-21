import axios from "/js/lib/axios.min.js";
// import { QuickDB } from "./lib/QuickDB/index.js";

import Utils, {
  Cookies,
  Toast,
  InfoUtils as PageInfo,
  CONFIG as CFG,
  cError,
  cWarn,
  mmext,
  _utils,
} from "./lib/Utils.js";
import { html } from "./lib/framework/index.js";

import $ from "./lib/frontend.js/fw2.js";
import { EventEmitter } from "./lib/frontend.js/Events.js";

import {
  CheckIfAdminSync,
  CheckIfLoggedIn,
  RejectPageRequest,
} from "./lib/admin.js";

import "./_globals.js";
import { socket } from "./_globals.js";
import { winkdice_logo } from "./lib/svg_icons/winkdice-logo.js";

import { init } from "./_globals2-init.js";

export const val = true;

const modals = new mmext("mmext_aab_").client;
// Anti Ad Block

let _this_ = {};
_this_["platform"] = {
  name: "WinkDice",
};

let aab = {};
aab["message_extra"] = `Adblockers are not allowed on ${_this_.platform.name}!`;
aab["message_markup"] = `
<div class="form adblock_mesg" data-aab>
  <div class="title-container" data-aab>
    <div class="logo" data-aab>
      ${winkdice_logo(64, 64)} <span class="logo-title" data-aab>WinkDice</span>
    </div>
    <br data-aab/>
    <span class="title" data-aab data-aab-title>${aab["message_extra"]}</span>
  </div>
  <div class="content-container" data-aab>
    <ul class="list" data-aab>
      <li class="item" data-aab>It looks like you may be using an adblocker.</li>
      <li class="item" data-aab>Ads allow ${
        _this_.platform.name
      } to stay free for billions of users worldwide.</li>
      <li class="item" data-aab>You can go ad-free with ${
        _this_.platform.name
      } Premium, and creators can still get paid from
        your subscribtion.</li>
    </ul>
    <br data-aab/>
    <br data-aab/>
  </div>
  <div class="footer-container" data-aab>
    <button class="modal__btn allow aab_btn" data-micromodal-close aria-label="" data-aab onclick="sessionStorage.setItem('aelb_ev:click:_allowAds', 'true')">Allow ${
      _this_.platform.name
    } Ads</button>
    <!-- <button class="modal__btn subscribe aab_btn" data-micromodal-close aria-label="" data-aab>Try ${
      _this_.platform.name
    } Premium</button> -->
  </div>
</div>
`;

// console.log(aab.message_markup)
aab["id"] = modals.create(aab.message_markup, false, "aab").id;

// console.log(aab)

export function startAAB_Stuff() {
  if (_utils.$cookies.Get("aab_enabled") === "true") {
    setInterval(() => {
      if (sessionStorage.getItem("allowAds") == "true") return;
      if (document.URL.includes("/admin")) return;
      /**
       *  @type {HTMLElement[]}
       */
      const advertList = [
        html(".ad_container_1").get(),
        html(".advert_id_001").get(),
        html(".ad_banner_001").get(),
      ];

      for (const item of advertList) {
        const comp = window.getComputedStyle(item);
        // console.log(item.nodeName)
        // console.log(comp.getPropertyValue("display"))
        if (
          item.nodeName == "BODY" ||
          comp.getPropertyValue("display") == "none"
        )
          modals.show({ targets: "storage" }, aab.id, true);
      }

      if (
        window.canRunAds == undefined ||
        window.adsEnabled == undefined ||
        window.fdfhhfdhojfdjhoifjADS == undefined
      ) {
        modals.show({ targets: "storage" }, aab.id, true);
      }

      document.querySelectorAll("[data-aab]").forEach((item) => {
        const comp = window.getComputedStyle(item);
        // console.log(item.nodeName)
        // console.log(comp.getPropertyValue("display"))
        if (
          item.nodeName == "BODY" ||
          comp.getPropertyValue("display") == "none"
        )
          CompletelyBlock();
      });
    }, 1000);

    // modals.edit({
    //   title: "warning!",
    //   content: "Please disable your adblocker",
    //   targets: ["global"]
    // }, aab.id, true)

    // modals.show({ targets: "storage" }, aab.id, true)
    // modals.close({ targets: "storage" }, aab.id, true)

    // html(".aab_btn.allow").on("click", ({ set, on, get, add, attr }) => {
    //   // modals.close({ targets: ["global"] }, aab.id, true)
    //   console.log("KLIEKEDIEKLIEK")

    // })

    setInterval(() => {
      // sessionStorage.setItem("antiEventListenerBypass", )
      if (sessionStorage.getItem("aelb_ev:click:_allowAds") == "true") {
        sessionStorage.setItem("aelb_ev:click:_allowAds", "");
        console.log("AntiBypass is triggered");
        HandleAllowEVENT();
      }
    }, 100);
  } else {
    const arr = [
      html(".ad_container_1"),
      html(".advert_id_001"),
      html(".ad_banner_001"),
    ];
    for (const item of arr) {
      if((item.get()).nodeName == "BODY") return
      item.attr("data-wdjs-hidden").set("");
    }
  }
}

async function CompletelyBlock() {
  void alert(
    "[FATAL_ERROR: HARDBLOCK INITIATED]\nPlease disable your adblocker to continue using this website!"
  );
  try {
    await html("body").set("");
  } catch (e) {
    void e;
  }
}

function attach(num) {
  console.log("Trying to attach", num);
  // sessionStorage.setItem("allowAds", "false")
  document.querySelector(".aab_btn.allow").addEventListener(
    "click",
    function () {
      HandleAllowEVENT();
    },
    false
  );
}

function HandleAllowEVENT() {
  const { set, on, get, add, attr, env } = html(".aab_btn.allow");
  sessionStorage.setItem("allowAds", "true");
  setTimeout(() => {
    init();
    sessionStorage.setItem("allowAds", "false");
  }, 10000);
  aab["message_extra"] = `You still have your Adblocker enabled :(`;
  html("[data-aab-title]").set(aab["message_extra"]);
  set("Pwease disabwle the adbwocker");
  return aab["message_extra"];
}

// $.events.on('internal:error', (error) => {
//   console.log('[INTERNAL:ERROR]', error)
// })

// $.action("RIDE IT", "ev:ride_it", () => {
//   console.log('Ride it, all on my cock, ride it, so fucking hard, ride it, Suck on my balls before it falls')
// })

// $.events.emit("ev:ride_it")

// window.addEventListener("load", function() {attach(1)})
// window.onload = function() {attach(2)}
// attach(3)
