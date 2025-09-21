import express, { Express, Request, Response, IRouter, IRoute } from 'express';
import { db } from '../../../..';
import { AppDataSource } from '../../../data-source';
import { User } from '../../../entity/User';

import { decimalToHexString, ArrayManipulation } from '../../../utils/common';

import type { bodyData } from '../../../types';

import { ValidateAuthenticity, getUser } from '../../../utils/validators';

const { splitArray, findMap, removeFromArray, getFromArray } =
    ArrayManipulation;

type Req = Request;
type Res = Response;

class APIRouter_UserWarnings {
    public router: IRouter;
    constructor() {
        this.router = express.Router()
        this.router.all('*', this.index);
    }
    index(req:Req,res:Res) {
        res.json({})
    }
}