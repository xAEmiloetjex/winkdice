import { checkerboard, heart, smiley } from "./images.js";

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

let render = {
    img: "loop"
}

const display = {
    height: 16,
    width: 16,
    drawSpeed: 1 / 1000000000,
    mode: "matrix",
    image: "checkerboard"
}

let currentImg = "checkerboard"

const images = {
    checkerboard,
    smiley,
    heart
}

let pixelList = []

html(`:root`).env(async ({ set, on, get, add, attr }) => {
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
        for (let i = 0; i <= display.height -1; i++) {
            let str2 = ""
            for (let j = 0; j <= display.width -1; j++) {
                str2 += `<td class=\"display-r${i}-c${j}\">0x000000</td>`
                temp.push(`display-r${i}-c${j}`)
            }
            str += `<tr class=\"display-r${i}\">` + str2 + `<td class="indicator ind-r${i}"></td>` + "</tr>"
            // console.log(str)
        }
        return str;
    })()}
</table>
<div class="buttons">
    <button class="setrender-loop">loop images</button>
    <button class="setrender-checkerboard">checkerboard</button>
    <button class="setrender-smiley">smiley</button>
    <button class="setrender-heart">heart</button>
</div>
`)

html(`.setrender-loop`).on("click", ({ set, on, get, add, attr, env, ev}) => render.img = "loop")
html(`.setrender-checkerboard`).on("click", ({ set, on, get, add, attr, env, ev}) => render.img = "checkerboard")
html(`.setrender-smiley`).on("click", ({ set, on, get, add, attr, env, ev}) => render.img = "smiley")
html(`.setrender-heart`).on("click", ({ set, on, get, add, attr, env, ev}) => render.img = "heart")

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
            if (render.img == "loop") nextImg();
            else setImg(render.img)
            flipOn()
            return [0,1,2,3,4]
        }
        if (html(`.${pixelList[ind]}`).attr("class").get() == null) return
        const color = getColor(ind)
        html(`.${pixelList[ind]}`).set(`${String(color).replace("#","0x")}`)
        // html(`.${pixelList[ind]}`).attr("id").set("activated")
        html(`.${pixelList[ind]}`).attr("style").set("background:" + color + ";")
        setIndicator(ind)
        ind++
    }
}

let last = 0

function getColor(indx) {
    const indxx = String(pixelList[indx]).split("-");
    const row = Number(indxx[1].replace("r", ""));
    const column = Number(indxx[2].replace("c", ""));
    return images[currentImg][row][column]
}

async function setIndicator(indx) {
    const current = Number(String(pixelList[indx]).split("-")[1].replace("r",""))
    html(`.ind-r${last}`).attr("id").remove()
    html(`.ind-r${current}`).attr("id").set("activated")
    return last = current
} 

function nextImg() {
    if (currentImg == "checkerboard") return currentImg = "smiley";
    else if (currentImg == "smiley") return currentImg = "heart";
    else if (currentImg == "heart") return currentImg = "checkerboard";
}

function setImg(img) {
    return currentImg = img 
}

// function flipOff() {
//     let ind = 0
//     const interv = setInterval(() => {
//         if (Array.isArray(fill())) clearInterval(interv);
//     }, display.drawSpeed)

//     function fill() {
//         if (ind == pixelList.length) {
//             flipOn()
//             return [0,1,2,3,4]
//         } 
//         if (html(`.${pixelList[ind]}`).attr("class").get() == null) return
//         html(`.${pixelList[ind]}`).set(0)
//         html(`.${pixelList[ind]}`).attr("id").remove()
//         ind++
//     }
// }
