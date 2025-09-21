import express, { Express, Request, Response, IRouter, IRoute } from "express";
import path from "node:path"

type Req = Request;
type Res = Response;

class MainRouter_McServ {
    public router: IRouter;
    constructor() {
        this.router = express.Router();
        this.router.get("/", this.index)
    }

    index(req: Req, res: Res): IRoute {
        res.render("minecraftServer/index", {
            title: ``,
            chatTarget: req.params.usrname,
            pagenum: req.params.num
        })
        return
    }
}

const MainRoutes_McServ = new MainRouter_McServ().router
export default MainRoutes_McServ