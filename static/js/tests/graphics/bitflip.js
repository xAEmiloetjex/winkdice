import axios from "/js/lib/axios.min.js";
// import { QuickDB } from "./lib/QuickDB/index.js";

import Utils, {
  Cookies,
  Toast,
  InfoUtils as PageInfo,
  CONFIG as CFG,
  cError,
  cWarn,
  _utils,
} from "/js/lib/Utils.js";
import { html } from "/js/lib/framework/index.js";

import { CheckIfAdminSync, CheckIfLoggedIn, RejectPageRequest } from "/js/lib/admin.js";

import "/js/_globals.js";
import { socket } from "/js/_globals.js";

let state = {
  count: 0,
};

const display = {
    height: 32,
    width: 32,
    drawSpeed: 1
}

let pixelList = []

html(`:root`).env(async ({ set, on, get, add, attr }) => {
  // attr("data-theme").set("light");
  // attr("data-colorscheme").set("blue");
  // // attr("style").set("transition: all 0.1s;")
  // setInterval(() => {
  //   // attr("data-theme").set(nextTheme());
  //   attr("data-colorscheme").set(nextColor());
  // }, 150);
});
html("main.main2").env(async ({ set, on, get, add, attr }) => {
  set(`
    <h3 class="page-title"></h3>
    <section class="page-container">

    </section>
  `);
  html(".page-title").set("Display")
  regenDisplay()

});


function regenDisplay() {
    let temp = []
    html(".page-container").set(`
    <table class="display">
    ${(() => {
        // console.log("rfhdfhfd")
        let str = "";
        for (let i = 0; i <= display.height; i++) {
            let str2 = ""
            for (let j = 0; j <= display.width; j++) {
                str2 += `<td class=\"display-r${i}-c${j}\">0</td>`
                temp.push(`display-r${i}-c${j}`)
            }
            str += `<tr class=\"display-r${i}\">` + str2 + "</tr>"
            // console.log(str)
        }
        return str;
    })()}
</table>
`)

flipOn()

return pixelList = temp
}

// function animateFill() {
//     let ind = 0
//     const interv = setInterval(() => {
//         if (Array.isArray(fill())) clearInterval(interv);
//     }, display.drawSpeed)

//     function fill() {
//         if (ind == pixelList.length) return regenDisplay()
//         if (html(`.${pixelList[ind]}`).attr("class").get() == null) return
//         html(`.${pixelList[ind]}`).set(1)
//         html(`.${pixelList[ind]}`).attr("id").set("activated")
//         ind++
//     }
// }

function flipOn() {
    let ind = 0
    const interv = setInterval(() => {
        if (Array.isArray(fill())) clearInterval(interv);
    }, display.drawSpeed)

    function fill() {
        if (ind == pixelList.length) {
            flipOff()
            return [0,1,2,3,4]
        } 
        if (html(`.${pixelList[ind]}`).attr("class").get() == null) return
        html(`.${pixelList[ind]}`).set(1)
        html(`.${pixelList[ind]}`).attr("id").set("activated")
        ind++
    }
}

function flipOff() {
    let ind = 0
    const interv = setInterval(() => {
        if (Array.isArray(fill())) clearInterval(interv);
    }, display.drawSpeed)

    function fill() {
        if (ind == pixelList.length) {
            flipOn()
            return [0,1,2,3,4]
        } 
        if (html(`.${pixelList[ind]}`).attr("class").get() == null) return
        html(`.${pixelList[ind]}`).set(0)
        html(`.${pixelList[ind]}`).attr("id").remove()
        ind++
    }
}