import {z} from 'zod'
import express, {
  Express,
  Request,
  Response,
  NextFunction,
  IRouter,
  IRoute,
} from "express";
import axios from "axios";

import * as Yaml from 'yaml'

import { crashHandler } from "../../../crashHandler";
import { ClientsideInputError } from "../../../errors/ClientsideInputError";
import { main as interm } from "../../../utils/intermediate";

import { Logger } from "../../../utils/logger";

import * as fwu from '../../../utils/util_lib'
import {EventEmitter} from '../../../utils/util_lib/Events'

const resultMap = new Map<string, any | any[]>();

const logger = new Logger("RelaySockets");

type Req = Request;
type Res = Response;
type Next = NextFunction;

const newMsg = z.object({
    id: z.string(),
    recipient: z.union([z.string(), z.number(), z.literal('global')]),
    data: z.any()
})

const ev = new EventEmitter('')

class RelayRouter_Sockets {
    public router: IRouter;
    public ev = ev
    constructor() {
        // super()
        this.router = express.Router()
        this.router.post('/send', this.newMessage)

        // super.emit("JoeMamaGea", [])
    }

    /**
     * @method newMessage
     * @param {Req} req
     * @param {Res} res
     */

    newMessage(req:Req,res:Res) {
        const b = newMsg.safeParse(req.body);
        if (b.success === false) return res.json(b)
        else return (this.ev.emit('newMsg', b.data)
                .then(r => {
                    return res.json(r)
                })
                .catch(e => {
                    return res.json(e)
                }))
    }
}

const RelayRoutes_Sockets = new RelayRouter_Sockets().router;
export default RelayRoutes_Sockets;