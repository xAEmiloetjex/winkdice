import express, { Express, Request, Response, IRouter, IRoute } from "express";
import path from "node:path"

type Req = Request;
type Res = Response;

class MainRouter_glb {
    public router: IRouter;
    constructor() {
        this.router = express.Router();
        this.router.get("/", this.index)
        this.router.get("/utils/fe-typings.js", this.feTypings)
    }

    index(req: Req, res: Res): IRoute {
        res.send({msg: "Hi!", dir: __dirname})
        return
    }    
    feTypings(req: Req, res: Res): IRoute {
        res.sendFile(path.join(__dirname,"../../../../utils/fe-typings/dist/fet/Types.class.js"))
        return
    }
}

const MainRoutes_glb = new MainRouter_glb().router
export default MainRoutes_glb