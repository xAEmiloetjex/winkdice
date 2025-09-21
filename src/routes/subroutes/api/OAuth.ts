import express, { Express, Request, Response, IRouter, IRoute } from "express";
import path from "node:path"

const OAuth_Conf: IOAuth_Conf = {
    clientId: "617261487613804545",
    clientSecret: "7-60RAt3SMKvdOArAAt6aiyssvfS8oEl"
}

type Req = Request;
type Res = Response;

class API_OAuth {
    public router: IRouter;
    constructor() {
        this.router = express.Router();
        // this.router.get("/", this.index)
    }

}

export const APIRoutes_OAth = new API_OAuth().router
export default APIRoutes_OAth

interface IOAuth_Conf {
    clientId: string;
    clientSecret: string;
}