import { CalcPage } from './pages/Calculator.js';
import { HomePage } from './pages/Home.js';
import { TestPage } from './pages/Test.js';
const pageDB = {
    home: HomePage,
    test: TestPage,
    calc: CalcPage
};
export function PageHandler(parent) {
    const pageContainer = ".page-container";
    const pageState = localStorage.getItem("page");
    if (pageState == null) {
        localStorage.setItem("page", "home");
        return window.location.reload();
    }
    else {
        pageDB[pageState](pageContainer);
    }
    // html(parent).env(async ({ set, on, get, add, attr }: IReturns) => {
    //     add(`
    //         <h1>This is the homepage!</h1>
    //     `)
    // })
    return "";
}
