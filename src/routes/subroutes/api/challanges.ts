import express, { Express, Request, Response, IRouter, IRoute } from "express";
import path from "node:path"
import { Cache } from "../../../utils/cache_helper";
import { crashHandler } from "../../../crashHandler";
import { InputNotUsableError } from "../../../errors/InputNotUsableError";

import { db as mdb } from "../../../../index";

type Req = Request;
type Res = Response;

const chalTable = mdb

const __store = {
  get:    (id:number)           => mdb.get(`chalTable.${id}`),
  set:    (id:number, val: any) => mdb.set(`chalTable.${id}`, val),
  delete: (id:number)           => mdb.delete(`chalTable.${id}`),
  all: () => mdb.get("chalTable")
  // forEach:async (
  //   cb: (val,key)=>void
  // )                             => {
  //   const ret = await chalTable.all()
  //   const keys = ret.keys
  //   const values = ret.values
  //   // @ts-ignore
  //   (keys).forEach((key:string, index) => {
  //     if(key.startsWith("chalTable_")) return cb(values[index], key)
  //     else return
  //   })
  // }
}

const _store = {
  get: async (id:number) => await Cache(`challange_by_id_${id}`, () => __store.get(id)),
  set: (id:number, val: any) => __store.set(id, val),
  delete: (id:number) => __store.delete(id)
}

class APIRouter_Challanges {
    public router: IRouter;
    constructor() {
        this.router = express.Router();
        this.router.get("/getAll", this.getAll)
        this.router.get("/get/:id", this.get_)
        this.router.get("/delete/:id", this.delete_)
        this.router.post("/set/:id", this.set_)
        this.router.all("*", this.index)

        // __store.set(0, {
        //   timeBoundaries: {
        //     start: '2024-06-13 00:00:01',
        //     end: '2025-01-01 00:00:01'
        //   },
        //   question: 'Why are you gay?',
        //   answers: ['because yes', 'yes']
        // })
        // __store.set(1, {
        //   timeBoundaries: {
        //     start: '2024-06-13 00:00:01',
        //     end: '2025-01-01 00:00:01'
        //   },
        //   question: 'Why are you amy?',
        //   answers: ['because yes', 'yes']
        // })
        // __store.set(2, {
        //   timeBoundaries: {
        //     start: '2024-06-13 00:00:01',
        //     end: '2025-01-01 00:00:01'
        //   },
        //   question: 'Why are you?',
        //   answers: ['because yes', 'yes']
        // })
    }

    async getAll(req:Req, res:Res) {
      let arr__ = []
      const inp: {[key: number|string]:any} = await __store.all()
      for (const obj_ in inp) {
        arr__.push(inp[obj_])
      }
      res.send(arr__)
    }

    async delete_(req:Req,res:Res) {
      const {id} = req.params
      res.send(await _store.delete(Number(id)))
    }

    async set_(req:Req, res:Res) {
      const data: IChalBody = req.body
      let checked = {}
      // Do Checks
      checked["timeBoundaries"]       = (data.timeBoundaries && typeof data.timeBoundaries == "object")
      checked["timeBoundaries.start"] = (data.timeBoundaries.start && (new Date(data.timeBoundaries.start)).toString() != "Invalid Date")
      checked["timeBoundaries.end"]   = (data.timeBoundaries.end && (new Date(data.timeBoundaries.end)).toString() != "Invalid Date")
      checked["question"]             = (data.question && typeof data.question == "string")
      checked["answers"]              = (data.answers && Array.isArray(data.answers) && (data.answers.filter((val) => typeof val == "string")).length > 0)

      let boolList = [
        checked["timeBoundaries"],      
        checked["timeBoundaries.start"],
        checked["timeBoundaries.end"],  
        checked["question"],          
        checked["answers"], 
      ]

      if (boolList.includes(false) == true) return crashHandler.webResponseCodes.auto(
        req,
        res,
        new InputNotUsableError(
          `Not all entries have the desired types`,
          {
            isAllTrue: !(boolList.includes(false)),
            isCorrect: checked,
            data
          }
        )
      )

      _store.set(Number(req.params.id), data)

      res.send({
        id: req.params.id,
        data: __store.get(Number(req.params.id))
      })
    }

    async get_(req:Req, res:Res) {
      res.send(await _store.get(Number(req.params.id)))
    }

    index(req: Req, res: Res) {
      res.send({
        req: {
          body: req.body,
          query: req.query
        }
      })
    }
}

const APIRoutes_Challanges = new APIRouter_Challanges().router
export default APIRoutes_Challanges

interface IChalBody {
  timeBoundaries: {
    start: string | Date
    end: string | Date
  }
  question: string
  answers: string[]
}