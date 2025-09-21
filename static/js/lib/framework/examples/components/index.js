/**
 * This file is just a silly example to show everything working in the browser.
 * When you're ready to start on your site, clear the file. Happy hacking!
 **/
// import './global.module.scss'
import { html } from '../../index.js';
import { Navbar, PageHandler } from './components/index.js';
const nav = [
    {
        label: "homePage",
        path: "home",
        type: "button"
    },
    {
        label: "testPage",
        path: "test",
        type: "button"
    },
    {
        label: "calcPage",
        path: "calc",
        type: "button"
    }
];
// html(":root").attr("data-theme").set("dark");
// html(":root").attr("data-colorscheme").set("purple");
html(`main#main`).env(({ set, on, get, add, attr }) => {
    set(`
    <div class="root-container">
      <div class="nav-container"></div>
      <div class="page-container"></div>
    </div>
  `);
    html(".root-container").add(`
  ${Navbar(nav, "div.nav-container")}
  ${PageHandler("div.root-container")}
  `);
});
