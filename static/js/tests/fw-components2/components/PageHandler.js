import { html } from "../../../lib/framework/index.js"
import * as pages from "./pages/index.js"

const pageDB = {
    home: pages.HomePage,
    test: pages.TestPage
}

export function PageHandler(parent) {
    const pageContainer = ".page-container";
    const pageState = localStorage.getItem("page");
    if (pageState == null) {
        localStorage.setItem("page", "home");
        return window.location.reload();
    }
    else {
        // pageDB[pageState](pageContainer);
        html(pageContainer).set(pageDB[pageState]())
    }
    return "";
}
