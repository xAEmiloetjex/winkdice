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
import { CheckIfLoggedIn } from "./lib/admin.js";

import "./_globals.js";
import { socket } from "./_globals.js";

window.console.warn = (e) => cWarn(e, "createPost.js");
window.console.error = (e) => cError(e, "createPost.js");
document.onerror = (e) => cError(e, "createPost.js");
window.onerror = (e) => cError(e, "createPost.js");
document.onwarn = (e) => cWarn(e, "createPost.js");
window.onwarn = (e) => cWarn(e, "createPost.js");

_utils.modal.init({
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

document.body.innerHTML += `
<div class="modal micromodal-slide" id="modal-1" aria-hidden="true">
<div class="modal__overlay" tabindex="-1">
  <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
    <header class="modal__header">
      <h2 class="modal__title" id="modal-1-title">
        Create Post
      </h2>
      <button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
    </header>
    <main class="modal__content form" id="modal-1-content">
      <input type="text" name="title" id="title" class="postTitleIN">
      <hr />
      <textarea name="content" id="content" class="postContentIN" cols="30" rows="10"></textarea>

      <!--<input type="file" name="file" id="file" class="postContentF">-->
    </main>
    <footer class="modal__footer">
      <button class="modal__btn modal__btn-primary postSend">Continue</button>
      <button class="modal__btn" data-micromodal-close aria-label="Close this dialog window">Cancel</button>
    </footer>
  </div>
</div>
</div>
`;

_utils.$utils.getDomElement(".createPostBTN-1").addEventListener("click", () => {
  _utils.modal.show("modal-1");
});
_utils.$utils.getDomElement(".createPostBTN-0").addEventListener("click", () => {
  _utils.modal.show("modal-1");
});
_utils.$utils.getDomElement(".postSend").addEventListener("click", () => {
  axios({
    method: "POST",
    url: "/api/posts/create",
    data: {
      data: {
        user: {
          name: _utils.$cookies.Get("UsrName"),
          token: _utils.$cookies.Get("UsrToken"),
        },
        post: {
          title: _utils.$utils.getDomElement(".postTitleIN").value,
          content: _utils.$utils.getDomElement(".postContentIN").value,
        },
      },
    },
  }).then((resp) => {
    const res = resp.data;
    console.log(res);
    if (!CheckIfLoggedIn()) {
      _utils.modal.close("modal-1");
      new Toast({
        text: "Your Username doesn't match your token! this means either that one of the values has been changed manually on the client side (by you or someone using your device) or it means that one of the values has been changed on the server side!<hr/>Anyways we redirect you in 5 seconds to the login page!",
        class: "toastWarn",
      });
      setTimeout(() => window.location.replace("/login"), 5000);
      return;
    }
    if (res.shortcode == 913) {
      _utils.modal.close("modal-1");
      new Toast({
        text: "Your Username doesn't match your token! this means either that one of the values has been changed manually on the client side (by you or someone using your device) or it means that one of the values has been changed on the server side!<hr/>Anyways we redirect you in 5 seconds to the login page!",
        class: "toastWarn",
      });
      setTimeout(() => window.location.replace("/login"), 5000);
    } else if (res.shortcode == 1016) {
      _utils.modal.close("modal-1");
      new Toast({
        text: "created your post successfully",
      });
    } else if (res.shortcode == 5016) {
      // _utils.modal.close("modal-1");
      new Toast({
        text: "The server reads content or title as empty, because of this we couldn't store your post!",
        class: "toastWarn"
      });
    } else if (res.shortcode == 9016)
      new Toast({
        text: "something went wrong and we are certain it was on the server-side! please try again!",
        class: "toastWarn",
      });
    else
      new Toast({
        text: "something went wrong, please try again!",
        class: "toastWarn",
      });
  });
});
