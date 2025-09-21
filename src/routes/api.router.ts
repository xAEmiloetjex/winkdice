import express, { Express, Request, Response, IRouter, IRoute } from 'express';
import axios from 'axios';

import APIRoutes_DM from './subroutes/api/dm';
import APIRoutes_Chat from './subroutes/api/chat';
import APIRoutes_Users from './subroutes/api/users';
import APIRoutes_Posts from './subroutes/api/posts';
import APIRoutes_Files from './subroutes/api/files';
import APIRoutes_Gen from './subroutes/api/gen';
// import APIRoutes_OAuth from "./subroutes/api/OAuth";
import APIRoutes_Bugtracker from './subroutes/api/bugtracker';
import APIRoutes_OAth from './subroutes/api/OAuth';
import APIRoutes_Services from './subroutes/api/otherServices';
import APIRoutes_Challanges from './subroutes/api/challanges';

import { addWScache, env } from '../sockets';
import { AppDataSource as db } from '../data-source';

import { db as mdb } from '../..';
import { Logger } from '../utils/logger';

const logger = new Logger('API')

// import { challenges, findMap as findChallenge } from "../data/challenges";

type Req = Request;
type Res = Response;

const allowedWSTokens = ['qnHfAh0q2t7xU2BkIkVdQShx4Y4DVGvd', 'VSEAtvSOOvo4aDuARuBWQxa0Ym87NWwf', 'st0LdkDHhLAPx0cB6CQESXvEYaraqf8k'];

export class APIRouter {
	public router: IRouter;
	constructor() {
		this.router = express.Router();
		this.router.get('/', this.Index);
		this.router.get('/tables', this.GP$Tables);
		this.router.post('/getEnv', this.getEnv);
		this.router.post('/addWSCache', this.sendWs);
		this.router.post('/execOnBackend', this.eval);
		this.router.post('/result/:id', this.GP$Result);
		this.router.post('/tables', this.GP$Tables);
		this.router.post('/telemetry', this.P$Telem);
		this.router.use('/users', APIRoutes_Users);
		this.router.use('/dm', APIRoutes_DM);
		this.router.use('/chat', APIRoutes_Chat);
		this.router.use('/posts', APIRoutes_Posts);
		this.router.use('/files', APIRoutes_Files);
		this.router.use('/gen', APIRoutes_Gen);
		this.router.use('/bug', APIRoutes_Bugtracker);
		this.router.use('/auth', APIRoutes_OAth)
		this.router.use('/services', APIRoutes_Services)
		this.router.use('/challanges', APIRoutes_Challanges)

		logger.info('API Routes loaded')
	}
	Index(req: Req, res: Res) {
		res.json({});
	}
	async getEnv(req: Req, res: Res) {
		return res.send({ ...(await env()) });
	}
	async sendWs(req: Req, res: Res) {
		const data = req.body.data;
		const body = req.body;
		let response = {}

		if (allowedWSTokens.includes(data.authToken)) {
			addWScache({ ...data.wsIn });
			response = { msg: '[SUCCESS] added stuff to the cache' };
		} else {
			response = {
				msg: "[ERROR] user isn't allowed to use the Websocket endpoint",
			};
		}

		if (body.data.result_to) {
			try {
				axios({
					url: body.data.result_to,
					method: "post",
					data: response,
				});
			} catch (e) {
				logger.warn("Failed to send the response back to the commander");
			}
			// console.log("result_to == true", body);
		}

		return res.send(response)
	}
	async eval(req: Req, res: Res) {
		const data = req.body.data;
		// if(allowedWSTokens.includes(data.authToken)) {
		try {
			return res.send(eval(data));
		} catch (e) {
			console.log(e);
			return res.send(e);
		}
		// return res.send({ msg: "[SUCCESS] added stuff to the cache"})
		// }
		// else {
		//   return res.send({
		//     msg: "[ERROR] user isn't allowed to use the Websocket endpoint"
		//   })
		// }
	}

	/**
	 * @Database
	 * @type =
	 * @param {MongoDB} db
	 * @start
	 */
	async GP$Tables(req, res) {
		res.send({ ids: /*listEntries(await db.all(), 'id')*/ await mdb.all() });
	}

	async GP$Result(req, res) {
		const id = req.params.id;
		res.send({ id: id, post: await mdb.get(id) });
	}
	/**
	 * @Database
	 * @end
	 */

	async P$Telem(req: Req, res: Res) {
		const data = req.body;
		if (data.type == undefined || data.type == null)
			return res.send({ t: 'err', msg: 'no valid type is defined' });
		if (data.type == 'test') {
			console.log('Received telem data:', data.type);
			return res.send({ t: 'res', msg: '', data });
		}
		if (data.type == 'tracker') {
		} else return res.send({ t: 'err', msg: 'no valid type is defined' });
	}
}

/**
 * @implements sessionAuthKeyStore
 */

let sessionAuthKeyStore: sessionAuthKey[] = [];

function findAuthKeyMap(sessionToken: string) {
	let by = 'sessionToken';
	let id = sessionToken;

	let Target = 0;
	sessionAuthKeyStore.forEach((item, index) => {
		if (item[by] == id) return (Target = index);
		else return;
	});
	return Target;
}

export function getAuthKeyMap(data: sessionAuthKey | string) {
	let searchParam = '';
	if (typeof data == 'string') searchParam = data;
	else searchParam = data.sessionToken;

	return sessionAuthKeyStore[findAuthKeyMap(searchParam)];
}

export function addAuthKeyMap(data: sessionAuthBase) {
	let _data: sessionAuthKey;
	if (data.type == undefined || data.type == null) _data.type = 'GET';
	if (data.body == undefined || data.body == null) _data.body = {};
	_data.endpoint = data.endpoint;
	_data.sessionToken = data.sessionToken;
	_data.key = makeKey(16);
	sessionAuthKeyStore.push(_data);
}

interface sessionAuthBase {
	sessionToken: string;
	endpoint: string;
	type?: 'POST' | 'GET' | 'post' | 'get';
	body?: object;
}

interface sessionAuthKey extends sessionAuthBase {
	key: string;
}

function makeKey(length) {
	let result = '';
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-_';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

export const APIRoutes = new APIRouter().router;
