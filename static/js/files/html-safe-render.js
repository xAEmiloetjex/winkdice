// import Utils, {
//   Cookies,
//   Toast,
//   InfoUtils as PageInfo,
//   CONFIG as CFG,
//   cError,
//   cWarn,
//   _utils,
// } from "../lib/Utils.js";
import { html } from "../lib/framework/index.js";
// import "../_globals.js";

import './bund-theme.js'

const body = html("body")
let cho = ""
const HaTeeEmEl = body.get().innerHTML;
cho = HaTeeEmEl

let ignore = false

body.set(`
    <!--<p class="url"></p>-->
    <main class="warning" id="main" style="">
        <h1>Content is hidden because the frame height is too small</h1>
        <p>There may be some content still visible is you scroll down on this frame,</p>
        <p>But it may not look like the way it was intended.</p>
        <p>But you can try opening the post in a new tab if you are on the home page!</p>
        <p>if you are already in a new tab with the post covereing the whole page... then try resizing your window!</p>
        <a class="idgaf" href="idgaf">Or click this button to still open the content</a>
    </main>
    <main class="content" id="main" style="">
    ${cho}
    </main>
`)

html("button.idgaf").on("click", () => {return ignore = true})

const hidecss = "display:hidden;height:0;"

setInterval(() => {
    const height = window.innerHeight;
    // html(".url").set(document.URL)
    if (height <= 424 && ignore == false) {
        html("main.warning").attr("style").set("")
        html("main.warning").attr("hidden").remove("")
        html("main.warning").attr("aria-hidden").remove("")
        html("main.content").attr("style").set(hidecss)
        html("main.content").attr("hidden").set("")
        html("main.content").attr("aria-hidden").set("")
    } else {
        html("main.warning").attr("style").set(hidecss)
        html("main.warning").attr("hidden").set("")
        html("main.Warning").attr("aria-hidden").set("")
        html("main.content").attr("style").set("")
        html("main.content").attr("hidden").remove("")
        html("main.content").attr("aria-hidden").remove("")
    }
}, 500)

// // body.env(({ set, on, get, add, attr }) => {

// // })

// body.get()

