import { html } from '../../../framework';
import type { IReturns } from '../framework';
import { CalcPage } from './pages/Calculator';
import { HomePage } from './pages/Home';
import { TestPage } from './pages/Test';

const pageDB: any = {
    home: HomePage,
    test: TestPage,
    calc: CalcPage
}
export function PageHandler(parent: string) {
    const pageContainer = ".page-container"
    const pageState: string | null = localStorage.getItem("page");

    if (pageState == null) {
        localStorage.setItem("page", "home");
        return window.location.reload()
    }

    else {
        pageDB[(pageState as string)](pageContainer)
    }
    // html(parent).env(async ({ set, on, get, add, attr }: IReturns) => {
    //     add(`
    //         <h1>This is the homepage!</h1>
    //     `)
    // })

    return ""
}
