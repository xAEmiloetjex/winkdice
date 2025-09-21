import express, { Express, Request, Response, IRouter, IRoute } from "express";

import MainRoutes_Admin from "./subroutes/main/admin";
import MainRoutes_glb from "./subroutes/main/glb-resources";
import MainRoutes_Bugtracker from "./subroutes/main/bugtracker";
import MainRoutes_McServ from "./subroutes/main/mcserv";

import { Logger } from '../utils/logger';

const logger = new Logger('Front-End')

type Req = Request;
type Res = Response;

export class PageRouter {
    public router: IRouter;
    constructor() {
        this.router = express.Router();
        this.router.get("/", this.Index)
        this.router.get("/blank", this.blank)
        this.router.get("/login", this.login)

        this.router.get("/post", this.Index)
        this.router.get("/post/:id", this.Post)

        // this.router.get("/chat", this.chat)
        this.router.get("/chat/:channel", this.chat)
        this.router.get("/dm/:usrname", this.chatPriv)
        this.router.get("/dms", this.chats)

        this.router.get("/calculator", this.calc)
        this.router.get("/calc", this.calc)

        this.router.get("/theme", this.theme)

        this.router.get("/test", this.test)
        this.router.get("/test/:test", this.tests)

        this.router.get("/changelogs", this.chnglgs)
        this.router.get("/changelogs/:version", this.chnglg)

        this.router.get("/license", this.license)

        this.router.use("/admin", MainRoutes_Admin)
        this.router.use("/glb-src", MainRoutes_glb)
        this.router.use("/bugs", MainRoutes_Bugtracker)
        this.router.use("/mcserv", MainRoutes_McServ)

		logger.info('Front-End Routes loaded')
    }
    Index(req:Req, res: Res) {
        res.render("index", {
            title: `Home`,
            postTarget: "latest"
        })
    }
    blank(req: Req, res: Res): IRoute {
        res.render("base", {
            title: "blank",
            head: ``
        })
        return
    }
    login(req: Req, res: Res): IRoute {
        res.render("login", {
            title: `Login`
        })
        return
    }
    chat(req: Req, res: Res): IRoute {
        res.render("ChatChannel", {
            title: ``,
            chatTarget: req.params.channel
        })
        return
    }
    chats(req: Req, res: Res): IRoute {
        res.render("chats", {
            title: ``,
            chatTarget: "global"
        })
        return
    }
    chatPriv(req: Req, res: Res): IRoute {
        res.render("chat", {
            title: ``,
            chatTarget: req.params.usrname
        })
        return
    }
    theme(req: Req, res: Res): IRoute {
        res.render("theme", {
            title: `Theme`,
            chatTarget: req.params.usrname
        })
        return
    }
    test(req: Req, res: Res): IRoute {
        res.render("test", {
            title: ``,
            chatTarget: req.params.usrname
        })
        return
    }
    tests(req: Req, res: Res): IRoute {
        const test = req.params.test
        res.render(`tests/${test}`, {
            title: `tests | ${test}`,
            chatTarget: req.params.usrname
        })
        return
    }
    chnglgs(req: Req, res: Res): IRoute {
        res.render("changelogs/index", {
            title: ``,
            chatTarget: req.params.usrname,
            layout: "layouts/special"
        })
        return
    }
    chnglg(req: Req, res: Res): IRoute {
        const test = req.params.version
        res.render(`changelogs/${test}`, {
            title: `Changelog | ${test}`,
            chatTarget: req.params.usrname,
            layout: "layouts/special"
        })
        return
    }
    Post(req: Req, res: Res): IRoute {
        res.render("index", {
            title: ``,
            postTarget: "id:"+req.params.id
        })
        return
    }

    calc(req: Req, res: Res): IRoute {
        res.render("calculator", {
            title: `Caclulator`
        })
        return
    }
    license(req: Req, res: Res): IRoute {
        res.render("license", {
            title: `license`
        })
        return
    }
}

export const PageRoutes = new PageRouter().router