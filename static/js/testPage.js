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

import { CheckIfAdminSync, CheckIfLoggedIn, RejectPageRequest } from "./lib/admin.js";

import "./_globals.js";
import { socket } from "./_globals.js";
import { winkdice_logo } from "./lib/svg_icons/winkdice-logo.js";
import { EventEmitter } from "./lib/frontend.js/Events_alt.js";
import { EventEmitter as EVEM2 } from "./lib/frontend.js/Events.js";
import { Logger } from "./lib/frontend.js/logger.js";
import $ from "./lib/frontend.js/fw2.js";
import { Observable, Subscriber } from "./lib/frontend.js/rxjs/observable/index.js";
import { mkRandStr2, UniqueGen } from "./lib/frontend.js/core/utils/common.js";
import { HEX_CHAR_LIST } from "./lib/frontend.js/core/types/constants_1.js";

const container = html('.main2')

const apps = {
  clock: {
    id: 'nl.daydrm.os.clock-app',
    name: 'Clock',
    icons: {
      main: {
        uri: 'https://cdn0.iconfinder.com/data/icons/mobile-apps-settings-linear-white-with-black-backg/2048/443_-_Clock-256.png'
      }
    }
  },
  wa_business: {
    id: 'com.whatsapp.business',
    name: 'WA Business',
    icons: {
      main: {
        uri: '/img/WAB.jpg'
      }
    }
  },
  unknown: {
    id: 'nl.daydrm.os.unknown',
    name: 'Unknown',
    icons: {
      main: {
        uri: 'https://cdn3.iconfinder.com/data/icons/mobile-web-browsing/64/_Question_Webpage-512.png'
      }
    }
  }
}

function notif_card(opts/*: {
  appname:string,
  icon:string,
  title:string,
  desc:string
}*/) {
  const _ = {
    id: UniqueGen((length)=>mkRandStr2(length,HEX_CHAR_LIST), 16),
    app: opts.app
  }
  return {
    content: `
    <div class="notification" data-uid="${_.id}">
    <div class="icon">
      ${
        opts.icon_type === 'code' 
          ? `${opts.icon}`
          : `<img src="${opts.icon}"/>`
      }
    </div>
    <div class="content">
      <div class="title">
        <span proto-class="name roboto-bold">${opts.appname}:</span>
        <span class="rest">${opts.title}</span>
      </div>
      <div class="desc">
          ${opts.desc}
      </div>
    </div>
  </div>
  `,
  _
}
}

function notificate(_app/*:string*/, opts/*: {
  title:string,
  desc:string,
  appCustom?: {
    id?: string,
    name?: string,
    icons?: {
      [key:string]: {
        uri: string
      }
    }
  }
}*/) {
  // const container = document.querySelector('.notification-box')
  let app = apps[_app]
  let icon = '';
  let appname = '';
  let isCodeIcon = false
  if (app == undefined) app = apps.unknown
  if(
    opts.appCustom !== undefined &&
    opts.appCustom.icons !== undefined &&
    opts.appCustom.icons.main !== undefined &&
    opts.appCustom.icons.main.uri !== undefined
  ) icon = opts.appCustom.icons.main.uri;
  else icon = app.icons.main.uri
  if(
    opts.appCustom !== undefined &&
    opts.appCustom.name !== undefined
  ) appname = opts.appCustom.name;
  else appname = app.name

  // if (opts.code_icon !== false) isCodeIcon = true
  
  // if (isCodeIcon === true) icon = opts.code_icon

  const _ = notif_card({
    appname,
    icon,
    title:opts.title,
    desc:opts.desc,
    icon_type: (isCodeIcon === true ? 'code' : 'uri'),
    app
  })
  container.add(_.content)
  return _._
}

// notificate('clock', {
//   title: 'ebola',
//   desc: 'cholera'
// })
// notificate('unknown', {
//   title: '',
//   desc: '',
//   appCustom: {
//     name: 'Sex',
//     icons: {
//       main: {
//         // uri: ''
//       }
//     }
//   }
// })

const EV = new EventEmitter()
let _n = []

EV.on('notificate', (id, data) => {
  _n.push(notificate(id,data))
})

EV.emit('notificate', 'wa_business', {
  title: 'Mom',
  desc: 'Dinner is ready!',
})
for(let i = 0; i <= 10; i++) {
  EV.emit('notificate', 'clock', {
    title: i,
    desc: i,
  })
  EV.emit('notificate', 'wa_business', {
    title: i,
    desc: i,
  })
}



console.log(_n)
// EV.emit('notificate', 'wa_business', {
//   title: 'Winkdice:',
//   desc: 'Your account has been suspended!',

//   code_icon: winkdice_logo(80,80)
// })