import { socket, reportIncident } from "../_globals.js";
import jsTypes from "./fe-typings/Types.class.js";
import MicroModal from "./MicroModal.js";
export const feTypings = jsTypes;

document.onerror = (e) => cError(e, "lib/Utils.js.js");
window.onerror = (e) => cError(e, "lib/Utils.js.js");

document.onwarn = (e) => cWarn(e, "lib/Utils.js.js");
window.onwarn = (e) => cWarn(e, "lib/Utils.js.js");

/**
 * @type Class
 * @name "Utils"
 * @description "This class defines all utils"
 * @author "xA_Emiloetjex"
 */

export default class Utils {
  constructor() { }
  /**
    * @type Function
    * @name "hexcode"
    * @comment "Generates an random string of characters"
    * @param {Number} length - The length of the string
    * @returns {String} - The random string

    * @author "xA_Emiloetjex"
    */
  hexcode(length) {
    if (!(length % 2 === 0))
      throw new Error("argument of 'length' should be an even number");
    let result = "";
    const characters = "1234567890ABCDEF";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  /**
    * @type Function
    * @name "randomNumber"
    * @comment "Generates a random number"
    * @param {Number} max - The length of the string
    * @returns {Number} - The random number

    * @author "xA_Emiloetjex"
    */
  randomNumber(max) {
    const method = Math.floor(Math.random() * 2);
    if (method == 0) return Math.floor(Math.random() * max);
    if (method == 1) return Math.ceil(Math.random() * max);
  }
  /**
    * @type Function
    * @name "makeid"
    * @comment "Generates an random string of characters"
    * @param {Number} length - The length of the string
    * @returns {String} - The random string

    * @author "xA_Emiloetjex"
    */
  makeid(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
     * @type Function
     * @name "getDomElement"
     * @comment "Returns a DOM element"
     * @params ({String} selector)
     * @returns {HTMLElement}
     
     * @author "xA_Emiloetjex"
     */
  getDomElement(selector) {
    return document.querySelector(selector);
  }

  /**
   * @type Function
   * @name "someFunction"
   * @comment "Just testing something"
   * @param {*} _args
   * @param {(args?: *) => void} callback
   */
  someFunction(_args, callback) {
    pseudoDecorators.deprecate(this.someFunction);
    // this.someFunction
    callback(_args);
  }
  /**
   * @function
   * @type {Function}
   * @name doIf
   * @comment "Just testing something"
   * @param {*} condition
   * @param {() => void} callback
   */
  doIf(condition, callback) {
    pseudoDecorators.deprecate(this.doIf);
    if (condition) return callback();
    else return { code: "condition wasn't true", condition, callback };
  }
  HtmlToText(input) {
    return input
      .toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  URLify(string) {
    const urls = string.match(
      /((((ftp|https?):\/\/)|(w{3}\.))[\-\w@:%_\+.~#?,&\/\/=]+)/g
    );
    if (urls) {
      urls.forEach(function (url) {
        if (
          ["jpg", "jpeg", "webp", "png", "svg", "gif"].includes(
            url.split(".").last()
          )
        )
          return (string = string =
            string.replace(url, '<img src="' + url + '"/>'));
        else
          return (string = string.replace(
            url,
            '<a target="_blank" href="' + url + '">' + url + "</a>"
          ));
      });
    }
    return string; // .replace("(", "<br/>(");
  }

  chatFormat(msg) {
    function formatter(string) {
      return string
    }
    return formatter(this.URLify(this.HtmlToText(msg)));
  }
  convertTimestamp(timestamp) {
    var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
      yyyy = d.getFullYear(),
      mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
      dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
      hh = d.getHours(),
      h = hh,
      min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
      ampm = "AM",
      time;
    if (hh > 12) {
      h = hh - 12;
      ampm = "PM";
    } else if (hh === 12) {
      h = 12;
      ampm = "PM";
    } else if (hh == 0) {
      h = 12;
    }

    // ie: 2014-03-24, 3:00 PM
    time = yyyy + "-" + mm + "-" + dd + ", " + h + ":" + min + " " + ampm;
    return time;
  }
}

const GetDomElement = new Utils().getDomElement;

export class InfoUtils {
  constructor() { }
  displayInfo(where, text) {
    pseudoDecorators.deprecate(this.displayInfo);
    const element = GetDomElement(where);
    element.innerHTML = text;
  }
  getResolution(target) {
    pseudoDecorators.deprecate(this.getResolution);
    if (target == window) {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    } else {
      const element = target;
      const width = element.clientWidth;
      const height = element.clientHeight;
      return {
        width,
        height,
      };
    }
  }
  getTitle() {
    pseudoDecorators.deprecate(this.getTitle);
    return document.title;
  }
}

export class Cookies {

  cookiePrefix = "cookie_"
  clusterPrefix = ""

  /**
   * 
   * @param {String} clusterPrefix
   */
  constructor(clusterPrefix) {
    if (clusterPrefix !== undefined) this.clusterPrefix = clusterPrefix
  }

  State() {
    if (sessionStorage.getItem("cookiesDisabled") == "true") return false
    else return true
  }

  /**
   *
   * @param {string} cname
   * @param {string} cvalue
   * @param {number} exdays
   */
  Set(cname, cvalue, exdays) {

    cname = this.clusterPrefix + cname

    if (this.State() == false) {
      return localStorage.setItem(`${this.cookiePrefix}${cname}`, cvalue)
    }
    else {
      const d = new Date();
      if (exdays == undefined) exdays = 30;

      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      let expires = "expires=" + d.toGMTString();
      return document.cookie =
        cname + "=" + cvalue + ";" + expires + ";path=/;" //+ "secure=true;";
    }
  }
  /**
   *
   * @param {string} cname
   * @returns {string}
   */
  Get(cname) {

    cname = this.clusterPrefix + cname

    if (this.State() == false) {
      return localStorage.getItem(`${this.cookiePrefix}`)
    }
    else {
      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }
  }
  /**
   *
   * @param {string} cname
   * @returns {boolean}
   */
  Check(cname) {
    let cookie = this.Get(cname);
    if (cookie == "" || cookie == undefined || cookie == null) {
      return false;
    } else {
      return true;
    }
  }

  /**
   *
   * @param {string} cname
   * @param {string} cvalue
   * @returns {{state:boolean, meta: {cname:string,cvalue:string}}}
   */
  CheckIf(cname, cvalue) {
    if (this.Get(cname) == cvalue)
      return { state: true, meta: { cname, cvalue } };
    else return { state: false, meta: { cname, cvalue } };
  }
  /**
   *
   * @param {string} cname
   * @param {string} cvalue
   * @param {(state:boolean, meta: {cname:string,cvalue:string}) => void} callback
   */
  CheckIfCB(cname, cvalue, callback) {
    if (this.Get(cname) == cvalue) callback(true, { cname, cvalue });
    else callback(false, { cname, cvalue });
  }
}

export class RemoteControlUtils {
  constructor() { }
  static async doIfSession(id, cb) {
    if (typeof id === "string") {
      if (id == sessionStorage.getItem("sessionId")) return await cb();
      else return;
    } else if (Array.isArray(id)) {
      if (id.includes(sessionStorage.getItem("sessionId"))) return await cb();
      else return;
    } else return;
  }
  static async doIfUser(name, cb) {
    const cookie = new Cookies()
    if (typeof name === "string") {
      if (name == cookie.Get("UsrName")) return await cb();
      else return;
    } else if (Array.isArray(name)) {
      if (name.includes(cookie.Get("UsrName"))) return await cb();
      else return;
    } else return;
  }
  /**
   * @description "doIfUser except for the specified sessions"
   */
  static async doIfUser_Exc(name, cb, sessions) {
    if (
      Array.isArray(sessions) &&
      sessions.includes(sessionStorage.getItem("sessionId"))
    )
      return;
    if (
      typeof sessions == "string" &&
      sessions.includes(sessionStorage.getItem("sessionId"))
    )
      return;
    else this.doIfUser(name, cb);
  }
  static inputWriter(input, value) {
    input = new Utils().getDomElement(input);

    var i = 0;
    var txt = value; /* The text */
    var speed = 50; /* The speed/duration of the effect in milliseconds */

    function typeWriter() {
      if (i < txt.length) {
        input.value += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }
    }

    typeWriter();
  }
}


const DEFAULT_OPTIONS = {
  autoClose: 5000,
  position: "top-right",
  onClose: () => { },
  canClose: true,
  showProgress: true,
};

export class Toast {
  #toastElem;
  #autoCloseInterval;
  #progressInterval;
  #removeBinded;
  #timeVisible = 0;
  #autoClose;
  #isPaused = false;
  #unpause;
  #pause;
  #visibilityChange;
  #shouldUnPause;

  constructor(options) {
    // console.log("Joost eet Toast is called", options)
    this.#toastElem = document.createElement("div");
    this.#toastElem.classList.add("toast");
    requestAnimationFrame(() => {
      this.#toastElem.classList.add("show");
      // this.#toastElem.classList.add("animate__animated")
    });
    this.#removeBinded = this.remove.bind(this);
    this.#unpause = () => (this.#isPaused = false);
    this.#pause = () => (this.#isPaused = true);
    this.#visibilityChange = () => {
      this.#shouldUnPause = document.visibilityState === "visible";
    };
    this.update({ ...DEFAULT_OPTIONS, ...options });

    // console.log(this.#toastElem)
  }

  set autoClose(value) {
    this.#autoClose = value;
    this.#timeVisible = 0;
    if (value === false) return;

    let lastTime;
    const func = (time) => {
      if (this.#shouldUnPause) {
        lastTime = null;
        this.#shouldUnPause = false;
      }
      if (lastTime == null) {
        lastTime = time;
        this.#autoCloseInterval = requestAnimationFrame(func);
        return;
      }
      if (!this.#isPaused) {
        this.#timeVisible += time - lastTime;
        if (this.#timeVisible >= this.#autoClose) {
          this.remove();
          return;
        }
      }

      lastTime = time;
      this.#autoCloseInterval = requestAnimationFrame(func);
    };

    this.#autoCloseInterval = requestAnimationFrame(func);
  }

  set position(value) {
    const currentContainer = this.#toastElem.parentElement;
    const selector = `.toast-container[data-position="${value}"]`;
    const container =
      document.querySelector(selector) || createContainer(value);
    container.append(this.#toastElem);
    if (currentContainer == null || currentContainer.hasChildNodes()) return;
    currentContainer.remove();
  }

  set text(value) {
    this.#toastElem.innerHTML = value;
  }

  set canClose(value) {
    this.#toastElem.classList.toggle("can-close", value);
    if (value) {
      this.#toastElem.addEventListener("click", this.#removeBinded);
    } else {
      this.#toastElem.removeEventListener("click", this.#removeBinded);
    }
  }

  set showProgress(value) {
    this.#toastElem.classList.toggle("progress", value);
    this.#toastElem.style.setProperty("--progress", 1);

    if (value) {
      const func = () => {
        if (!this.#isPaused) {
          this.#toastElem.style.setProperty(
            "--progress",
            1 - this.#timeVisible / this.#autoClose
          );
        }
        this.#progressInterval = requestAnimationFrame(func);
      };

      this.#progressInterval = requestAnimationFrame(func);
    }
  }

  set pauseOnHover(value) {
    if (value) {
      this.#toastElem.addEventListener("mouseover", this.#pause);
      this.#toastElem.addEventListener("mouseleave", this.#unpause);
    } else {
      this.#toastElem.removeEventListener("mouseover", this.#pause);
      this.#toastElem.removeEventListener("mouseleave", this.#unpause);
    }
  }

  set pauseOnFocusLoss(value) {
    if (value) {
      document.addEventListener("visibilitychange", this.#visibilityChange);
    } else {
      document.removeEventListener("visibilitychange", this.#visibilityChange);
    }
  }

  set class(value) {
    this.#toastElem.classList.add(value);
  }

  update(options) {
    Object.entries(options).forEach(([key, value]) => {
      this[key] = value;
    });
  }

  remove() {
    cancelAnimationFrame(this.#autoCloseInterval);
    cancelAnimationFrame(this.#progressInterval);
    const container = this.#toastElem.parentElement;
    this.#toastElem.classList.remove("show");
    this.#toastElem.addEventListener("transitionend", () => {
      this.#toastElem.remove();
      if (container.hasChildNodes()) return;
      container.remove();
    });
    this.onClose();
  }
}

function createContainer(position) {
  const container = document.createElement("div");
  container.classList.add("toast-container");
  container.dataset.position = position;
  document.body.append(container);
  return container;
}

export const CONFIG = {
  root_url: window.location.origin + "/",
  maintenance: false,
  Themes: {
    light: {
      backgroundColor: "#FFF9",
      backgroundColor2: "#FFF",
      foregroundColor: "#000F",
      accentColor1: "#ff1d56",
    },
    dark: {
      backgroundColor: "#0009",
      backgroundColor2: "#0F0F0F",
      foregroundColor: "#FFFF",
      accentColor1: "#c92a87",
    },
    defaultName: "light",
  },
};

export class Notifications {
  constructor() { }
  send(message) {
    new Notification(...message);
  }
  askPermission(notificationBtn) {
    // function to actually ask the permissions
    function handlePermission(permission) {
      // set the button to shown or hidden, depending on what the user answers
      notificationBtn.style.display =
        Notification.permission === "granted" ? "none" : "block";
    }

    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
    } else {
      Notification.requestPermission().then((permission) => {
        handlePermission(permission);
      });
    }
  }
}

const cookie = new Cookies()

export function cError(e, file) {
  reportIncident("error", e, {
    file,
    userId: JSON.stringify({
      token: cookie.Get("UsrToken"),
      name: cookie.Get("UsrName")
    }),
    sessionId: sessionStorage.getItem("sessionId"),
    socketId: socket.id,
    timestamp: Date.now(),
  });
  new Toast({
    text: `${e}<br><hr><span style="font-size:10px;color:#0000009F;font-family:monospace;">this incident will be reported! (Admins may contact you!)</span>`,
    position: "top-center",
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    class: "toastErr",
  });
  console.debug(`[ERROR] \n\n`, e, ``);
  void (e, file)
}
export function cWarn(e, file) {
  reportIncident("warn", e, {
    file,
    userId: JSON.stringify({
      token: cookie.Get("UsrToken"),
      name: cookie.Get("UsrName")
    }),
    sessionId: sessionStorage.getItem("sessionId"),
    socketId: socket.id,
    timestamp: Date.now(),
  });
  new Toast({
    text: `${e}<br><hr><span style="font-size:10px;color:#0000009F;font-family:monospace;">this incident will be reported! (Admins may contact you!)</span>`,
    position: "top-center",
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    class: "toastWarn",
  });
  console.debug(`[WARNING] \n\n`, e, ``);
  void (e, file)

}

/**
 * @class
 */
export class pseudoDecorators {
  /**
   * @pseudoDecorator
   * @decorator
   * @function
   * @param {Function} $function
   * @returns
   * @description Used to mark things as deprecated!
   */
  static async deprecate($function) {
    if ($function == undefined)
      $function = {
        name: this.deprecate.caller.name,
      };
    const message = `'${$function.name}' is deprecated!`;
    console.warn(message, { stack: { $function } });
    return message;
  }
}


/**
 * 
 * @returns {_utils}
 */
function getAll() {
  return _utils
}

/**
 * @class
 */
class _proto {
  constructor() { }
  $utils = new Utils();
  $rcu = new RemoteControlUtils();
  $infoutils = new InfoUtils();
  $cookies = new Cookies();
  $notify = new Notifications();
  $types = new jsTypes();
  c$toast = Toast;
  modal = MicroModal;
  _cerror = cError;
  _cwarn = cWarn;
  config = CONFIG;
}


/**
 * @title MicroModal-Extended
 */

window["mmext_ids"] = 0

export class mmext extends _proto {
  // ids = 0;
  idPrefix = ""
  client = {
    create: (cim, fullyCustom = false, extraClass) => this.create(cim, fullyCustom, extraClass),
    delete: (id, isPrefixed) => this.delete(id, isPrefixed),
    edit: (obj, idSel, isPrefixed) => this.edit(obj, idSel, isPrefixed),
    show: (obj, idSel, isPrefixed) => this.show(obj, idSel, isPrefixed),
    close: (obj, idSel, isPrefixed) => this.close(obj, idSel, isPrefixed),

    editAndShow: (obj, idSel, isPrefixed) => this.EditNShow(obj, idSel, isPrefixed)
  }

  get ids() {
    return window.mmext_ids
  }
  set ids(param) {
    window.mmext_ids = param
  }

  /**
   * 
   * @param {string} prefix 
   */
  constructor(prefix) {
    super()

    let prfx = "a_";
    if (prefix !== undefined) prfx = prefix
    this.idPrefix = prfx

    this.modal.init({
      onShow: (modal) => console.info(`${modal.id} is shown`), // [1]
      onClose: (modal) => console.info(`${modal.id} is hidden`), // [2]
      openTrigger: "data-custom-open", // [3]
      closeTrigger: "data-custom-close", // [4]
      openClass: "is-open", // [5]
      disableScroll: true, // [6]
      disableFocus: false, // [7]
      awaitOpenAnimation: false, // [8]
      awaitCloseAnimation: false, // [9]
      debugMode: true, // [10]
    });
  }
  create(customInnerMarkup, fullyCustom, extrclass) {
    if(customInnerMarkup == undefined || customInnerMarkup == null || customInnerMarkup == "") customInnerMarkup = ""
    const cim = customInnerMarkup
    const id = `${this.idPrefix}${this.ids}`
    const idObj = {
      id,
      idOnly: this.ids
    }
    document.body.innerHTML += `
<div class="modal micromodal-slide" id="modal-${id}" aria-hidden="true" data-wdjs-hidden>
    <div class="modal__overlay" tabindex="-1">
        <div class="modal__container ${extrclass}" role="dialog" aria-modal="true" aria-labelledby="modal-${id}-title">
            <header class="modal__header ${cim !== "" ? `hidden` : ""}">
                <h2 class="modal__title" id="modal-${id}-title">
                </h2>
                <button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
            </header>
            <main class="modal__content ${extrclass}" id="modal-${id}-content">
                ${cim}
            </main>
            <footer class="modal__footer ${extrclass}">
                <button class="modal__btn" data-micromodal-close aria-label="Close this dialog window">Close</button>
            </footer>
        </div>
    </div>
</div>
`;
    this.ids++
    return idObj
  }
  
  /**
   * 
   * @param {string} id 
   * @param {boolean} isPrefixed 
   */
  delete(id, isPrefixed) {
    let idSelec = id;
    if (isPrefixed != true) idSelec = `${this.idPrefix}${this.ids}`
    document.querySelector(`[id=modal-${idSelec}]`).remove()
    this.ids--
  }
  /**
   * 
 * @param {object} obj 
 * @param {string} obj.title,
 * @param {string} obj.content,
 * @param {string[]} obj.targets
 * @param {string} id 
 * @param {boolean} isPrefixed 
 */
  EditNShow(obj, idSel, isPrefixed) {
    let id = idSel;
    if (isPrefixed != true) id = `${this.idPrefix}${this.ids}`

    if (typeof obj["title"] !== "string") obj["title"] = ""
    if (typeof obj["content"] !== "string") obj["content"] = ""
    if (!Array.isArray(obj["targets"])) obj["targets"] = ["global"]

    sessionStorage.setItem(`${id}_targets`, JSON.stringify(obj.targets))

    const { title, content, targets } = obj;
    const titleID = `#modal-${id}-title`;
    const contentID = `#modal-${id}-content`;

    if (!Array.isArray(targets)) return;
    if (targets.includes("global")) return _(this);
    else if (
      targets.includes(this.$cookies.Get("UsrName")) ||
      targets.includes(this.$cookies.Get("SessionToken"))) return _(this);
    else return;

    function _(that) {
      that.$utils.getDomElement(titleID).innerHTML = title;
      that.$utils.getDomElement(contentID).innerHTML = content;
      that.$utils.getDomElement(`#modal-${id}`).removeAttribute(`data-wdjs-hidden`)
      that.modal.show(`modal-${id}`);
    }
  }

  /**
   * 
 * @param {object} obj 
 * @param {string} obj.title,
 * @param {string} obj.content,
 * @param {string[]} obj.targets
 * @param {string} id 
 * @param {boolean} isPrefixed 
 */

  edit(obj, idSel, isPrefixed) {
    let id = idSel;
    if (isPrefixed != true) id = `${this.idPrefix}${this.ids}`

    if (typeof obj["title"] !== "string") obj["title"] = ""
    if (typeof obj["content"] !== "string") obj["content"] = ""
    if (!Array.isArray(obj["targets"])) obj["targets"] = ["global"]

    sessionStorage.setItem(`${id}_targets`, JSON.stringify(obj.targets))

    
    const { title, content, targets } = obj;
    const titleID = `#modal-${id}-title`;
    const contentID = `#modal-${id}-content`;

    if (!Array.isArray(targets)) return;
    if (targets.includes("global")) return _(this);
    else if (
      targets.includes(this.$cookies.Get("UsrName")) ||
      targets.includes(this.$cookies.Get("SessionToken"))) return _(this);
    else return;

    function _(that) {
      console.log(that)
      that.$utils.getDomElement(titleID).innerHTML = title;
      that.$utils.getDomElement(contentID).innerHTML = content;
      // this.modal.show(`modal-${id}`);
    }
  }
  /**
   * 
 * @param {object} obj
 * @param {string[]} obj.targets
 * @param {string} id 
 * @param {boolean} isPrefixed 
 */
  show(obj, idSel, isPrefixed) {
    let id = idSel;
    if (isPrefixed != true) id = `${this.idPrefix}${this.ids}`

    if (typeof obj["title"] !== "string") obj["title"] = ""
    if (typeof obj["content"] !== "string") obj["content"] = ""
    if (obj["targets"] == "storage") obj["targets"] = JSON.parse(sessionStorage.getItem(`${id}_targets`))
    if (!Array.isArray(obj["targets"])) obj["targets"] = ["global"]

    const { targets } = obj;


    if (!Array.isArray(targets)) return;
    if (targets.includes("global")) return _(this);
    else if (
      targets.includes(this.$cookies.Get("UsrName")) ||
      targets.includes(this.$cookies.Get("SessionToken"))) return _(this);
    else return;

    function _(that) {
      that.$utils.getDomElement(`#modal-${id}`).removeAttribute(`data-wdjs-hidden`)
      that.modal.show(`modal-${id}`);
    }
  }
  /**
   * 
 * @param {object} obj
 * @param {string[]} obj.targets
 * @param {string} id 
 * @param {boolean} isPrefixed 
 */
  close(obj, idSel, isPrefixed) {
    // console.log("lobe")
    let id = idSel;
    if (isPrefixed != true) id = `${this.idPrefix}${this.ids}`

    if (typeof obj["title"] !== "string") obj["title"] = ""
    if (typeof obj["content"] !== "string") obj["content"] = ""
    if (obj["targets"] == "storage") obj["targets"] = JSON.parse(sessionStorage.getItem(`${id}_targets`))
    if (!Array.isArray(obj["targets"])) obj["targets"] = ["global"]
    
    const { targets } = obj;

    if (!Array.isArray(targets)) return;
    if (targets.includes("global")) return _(this);
    else if (
      targets.includes(this.$cookies.Get("UsrName")) ||
      targets.includes(this.$cookies.Get("SessionToken"))) return _(this);
    else return;

    function _(that) {
      // console.log("ebol")
      // that.$utils.getDomElement(`#modal-${id}`).setAttribute(`data-wdjs-hidden`, 1)
      that.modal.close(`modal-${id}`);
    }
  }

}

/**
 * @class
 */
class _ {
  constructor() { }
  $utils = new Utils();
  $rcu = new RemoteControlUtils();
  $infoutils = new InfoUtils();
  $cookies = new Cookies();
  $notify = new Notifications();
  $types = new jsTypes();
  $mmext = new mmext();
  c$toast = Toast;
  modal = MicroModal;
  _cerror = cError;
  _cwarn = cWarn;
  config = CONFIG;
}


export const _utils = new (class extends _ {
  constructor() {
    super();
  }
})();
