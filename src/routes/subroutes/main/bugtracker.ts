import express, { Express, Request, Response, IRouter, IRoute } from "express";

type Req = Request;
type Res = Response;

class MainRouter_Bugtracker {
    public router: IRouter;
    constructor() {
        this.router = express.Router();
        this.router.get("/", this.index)
        this.router.get("/page/:num", this.index_)
        this.router.get("/page/:num/:rep", this.report)
        this.router.get("/new", this.new)
        this.router.get("/edit/:num/:rep", this.edit)
        // this.router.get("/files", this.files)
    }

    index(req: Req, res: Res): IRoute {
        res.redirect("/bugs/page/0")
        return
    }
    index_(req: Req, res: Res): IRoute {
        res.render("bugtracker/index", {
            title: ``,
            chatTarget: req.params.usrname,
            pagenum: req.params.num
        })
        return
    }
    report(req: Req, res: Res): IRoute {
        res.render("bugtracker/report", {
            title: ``,
            chatTarget: req.params.usrname,
            pagenum: req.params.num,
            reportnum: req.params.rep
        })
        return
    }
    new(req: Req, res: Res): IRoute {
        res.render("bugtracker/new", {
            title: ``,
            chatTarget: req.params.usrname,
            pagenum: req.params.num,
            reportnum: req.params.rep
        })
        return
    }
    edit(req: Req, res: Res): IRoute {
        res.render("bugtracker/edit", {
            title: ``,
            chatTarget: req.params.usrname,
            pagenum: req.params.num,
            reportnum: req.params.rep
        })
        return
    }
}

const MainRoutes_Bugtracker = new MainRouter_Bugtracker().router
export default MainRoutes_Bugtracker