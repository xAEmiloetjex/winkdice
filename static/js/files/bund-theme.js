import Utils, { Cookies, Toast, InfoUtils as PageInfo, CONFIG as CFG} from "./bund-utils.js"

export async function applyTheme() {
    if (localStorage.getItem("theme_theme") == null) localStorage.setItem("theme_theme", "light")
    if (localStorage.getItem("theme_colorscheme") == null) localStorage.setItem("theme_colorscheme", "blue")
    if (localStorage.getItem("rainbow_mode") == null) localStorage.setItem("rainbow_mode", "false")

    const root = new Utils().getDomElement(":root")
    root.setAttribute("data-theme", localStorage.getItem("theme_theme"))
    root.setAttribute("data-colorscheme", localStorage.getItem("theme_colorscheme"))
    root.setAttribute("rainbow", localStorage.getItem("rainbow_mode"))
}
applyTheme()