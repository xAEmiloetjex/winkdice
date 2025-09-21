import express, { Express, Request, Response, IRouter, IRoute } from "express";
import path from "node:path"

import axios from 'axios';
import { IServerStats } from "../../../theHive/sharedTypes";

const map = new Map<string, any|IServerStats[]>()

type Req = Request;
type Res = Response;

class APIServices_Router {
    public router: IRouter;
    constructor() {
        this.router = express.Router();
        this.router.all("/mc", this.getMinecraftServers)

        setInterval(Ping, 10000)
    }

    getMinecraftServers(req:Req,res:Res) {
        try {
        const headers: IHeaders = map.get("headers")
        if (headers["x-ishive"]) res.setHeader('x-ishive', headers["x-ishive"])
        } catch(e) {
        } finally {
            res.json(map.get("servers"))
        }
    }
}

const APIRoutes_Services = new APIServices_Router().router
export default APIRoutes_Services

function Ping() {
	try {
		axios({
			url: 'http://localhost:4000/all',
			method: 'GET',
		}).then((resp) => {
            map.set("headers", resp.headers)
			map.set("servers", resp.data)
            console.log(resp.data)
		}).catch(() => {
            map.set("servers", [])
        });
	} catch (e) {
		console.log(e);
	}
}

interface IHeaders {
    'x-ishive'?: 'yes' | 'no'
    [key: string]: string
}