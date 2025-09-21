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

import "./_globals.js";
import { html } from "./lib/frontend.js/fw.js";

window.console.warn = (e) => cWarn(e, "register.js");
window.console.error = (e) => cError(e, "register.js");

document.onerror = (e) => cError(e, "register.js");
window.onerror = (e) => cError(e, "register.js");

document.onwarn = (e) => cWarn(e, "register.js");
window.onwarn = (e) => cWarn(e, "register.js");

const cookie = new Cookies();
let toast;
const PI = new PageInfo();

const reg = {
  username: new Utils().getDomElement(".username_reg"),
  password: new Utils().getDomElement(".password_reg"),
  email: new Utils().getDomElement(".email_reg"),
};

const log = {
  username: new Utils().getDomElement(".username_log"),
  password: new Utils().getDomElement(".password_log"),
  // email: new Utils().getDomElement(".email_reg"),
};
// Login Event
const submitBtn2 = new Utils().getDomElement(".login-btn");
submitBtn2.innerHTML = "Login";
submitBtn2.addEventListener("click", async () => {
  var emailValidation = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

  const dataP = emailValidation.test(log.username.value) ? {
    username: null,
    password: log.password.value,
    email: log.username.value,
    isEmail: true
  } : {
    username: log.username.value,
    password: log.password.value,
    email: null,
    isEmail: false
  }

  await axios({
    method: "POST",
    url: "/api/users/validate",
    data: {
      data: dataP
    }
  }).then(async resp => {
    if (resp.data.shortcode == 902) return new _utils.c$toast({
      text: "User not found!",
      class: "toastWarn"
    });
    else if (resp.data.shortcode == 903) return new _utils.c$toast({
      text: "Wrong password!",
      class: "toastWarn"
    })
    else if (resp.data.shortcode == 103) {
      console.log(resp)
      _utils.$types.void([
        _utils.$cookies.Set("UsrToken", resp.data.userdata.userToken),
        _utils.$cookies.Set("UsrName", resp.data.userdata.userName),
        _utils.$cookies.Set("SessionToken", _utils.$utils.makeid(6)),
        _utils.$cookies.Set("loggedIn", true)
      ])
      new _utils.c$toast({
        text: "Logged in!",
      })

      setTimeout(() => {window.location.reload()}, 500)
    }
    else return new _utils.c$toast({
      text: "There was an error! please try again!",
      class: "toastWarn"
    })
  })
});

// Register Event
const submitBtn = new Utils().getDomElement(".register-btn");
submitBtn.innerHTML = "Register";
submitBtn.addEventListener("click", async () => {
  if (reg.username.value == "") return new _utils.c$toast({text: "username required!",class: "toastWarn"})
  if (reg.password.value == "") return new _utils.c$toast({text: "password required!",class: "toastWarn"})
  if (reg.email.value == "") return new _utils.c$toast({text: "email required!",class: "toastWarn"})
  var emailValidation = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (emailValidation.test(reg.email.value) == false) return new _utils.c$toast({text: "email is invalid!",class: "toastWarn"})

  await axios({
    method: "POST",
    url: "/api/users/get",
    data: {
      data: {
        username: reg.username.value
      }
    }
  }).then(async resp => {
    console.log(resp)
    if (resp.data.shortcode == 902) {
      await axios({
        method: "POST",
        url: "/api/users/create",
        data: {
          data: {
            username: reg.username.value,
            password: reg.password.value,
            email: reg.email.value
          }
        }
      }).then(resp => {
        console.log(resp)
        log.username.value = reg.username.value
        log.password.value = reg.password.value

        submitBtn2.click()        
      })
    } else if (resp.data.shortcode == 102) {
      new _utils.c$toast({
        text: "user with name of '" + reg.username.value + "' already exists!",
        class: "toastWarn"
      })
    } else {
      new _utils.c$toast({
        text: "There was an error! please try again!",
        class: "toastWarn"
      })
    }
  })
});



// Logout Event
const logoutBtn = new Utils().getDomElement(".logout-btn");
logoutBtn.innerHTML = "Logout";
logoutBtn.addEventListener("click", () => {
  _utils.$types.void([
    _utils.$cookies.Set("UsrToken", ""),
    _utils.$cookies.Set("UsrName", ""),
    _utils.$cookies.Set("SessionToken", ""),
    _utils.$cookies.Set("loggedIn", false)
  ])

  new _utils.c$toast({
    text: "logged out!",
  })
});


// State
let loggedIn = false;
setInterval(() => {
  const data = {
    name: cookie.Get("UsrName"),
    token: cookie.Get("UsrToken")
  }
  if (data.name === "" || data.token === "") loggedIn=false;
  else if(data.name !== "" && data.token !== "") loggedIn=true;
  
  if (loggedIn === false) {
    html('.logout').attr('hidden').set('')
    html('.login').attr('hidden').remove()
    html('.register').attr('hidden').remove()
  } else if (loggedIn === true) {
    html('.logout').attr('hidden').remove()
    html('.login').attr('hidden').set('')
    html('.register').attr('hidden').set('')
  }
}, 100)