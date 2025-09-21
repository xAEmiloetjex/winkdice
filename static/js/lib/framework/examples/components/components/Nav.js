import { html } from '../../../index.js';
import { PageHandler } from './PageHandler.js';
export function Navbar(items, parent) {
    function construct() {
        html(parent).env(({ set, on, get, add, attr }) => {
            add(`
            <div class="topnav">

            </div>
            <style>
                .topnav {
                  overflow: hidden;
                  background-color: #333;
                }
                .topnav a, .topnav button {
                  float: left;
                  color: #f2f2f2;
                  text-align: center;
                  padding: 14px 16px;
                  text-decoration: none;
                  font-size: 17px;
                }
                .topnav a:hover, .topnav button:hover {
                  background-color: #ddd;
                  color: black;
                }
                .topnav a.active {
                  background-color: #04AA6D;
                  color: white;
                }
            </style>
            `);
            items.forEach(async (ite, ind) => {
                if (ite.type == "anchor")
                    return html(".topnav").add(`<a href="${ite.path}">${ite.label}</a>`);
                if (ite.type == "button") {
                    await html(".topnav").add(`<button id="btn_${ind}" class="btn">${ite.label}</a>`);
                    addListenerToNavBTN(ite, ind);
                }
            });
        });
    }
    construct();
    return "";
}
function addListenerToNavBTN(ite, ind) {
    html(`#btn_${ind}`).on("click", ({ set, on, get, add, attr }) => {
        localStorage.setItem("page", ite.path);
        PageHandler("");
    });
}
