import Utils, {
    RemoteControlUtils as RCU,
    Cookies,
    Toast,
    InfoUtils as PageInfo,
    CONFIG as CFG,
    feTypings,
    cError,
    cWarn,
    _utils
  }  from "../../lib/Utils.js";
import { html } from "../../lib/framework/index.js";
import { components, PageHandler, Navbar } from "./components/index.js";

const {Button} = components

const navLinks = [
    {
        path: "home",
        label: "Home",
        type: "button"
    },
    {
        path: "test",
        label: "Test",
        type: "button"
    }
]

html(`main#main`).env(async ({ set, on, get, add, attr }) => {
    // set(`${Button(
    //         "some button", 
    //         {
    //             othrProps:"style='background:var(--red_1);'"
    //         }, 
    //         () => {alert(`UwU`)}
    //     )}
    // `);
    set(`
        <div class="nav-container"></div>
        <hr/>
        <br/>
        <div class="page-container"></div>
    `)
    Navbar(navLinks, ".nav-container")
    PageHandler("")

});