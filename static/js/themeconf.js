import "./_globals.js";
import Utils, { Cookies, Toast, InfoUtils as PageInfo, CONFIG as CFG} from "./lib/Utils.js"
import { html } from "./lib/framework/index.js";
import { applyTheme } from "./lib/theme.js";

const themeSel = new Utils().getDomElement("#theme")
themeSel.addEventListener('change', () => {
    localStorage.setItem("theme_theme", themeSel.value)
    applyTheme()
}, true)
const colorSel = new Utils().getDomElement("#colorscheme")
colorSel.addEventListener('change', () => {
    if (colorSel.value == "rainbowv2") {
        localStorage.setItem("theme_colorscheme", "rainbowv2")
        localStorage.setItem("rainbow_mode", true)
    } else {
        localStorage.setItem("theme_colorscheme", colorSel.value)
        localStorage.setItem("rainbow_mode", false)
    }
    applyTheme()
}, true)

themeSel.value == localStorage.getItem("theme_theme")
colorSel.value == localStorage.getItem("theme_colorscheme")

html(`[value=${localStorage.getItem("theme_theme")}]`).attr("selected").set("")
html(`[value=${localStorage.getItem("theme_colorscheme")}]`).attr("selected").set("")