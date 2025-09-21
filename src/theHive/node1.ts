import * as http from 'node:http';

import axios from 'axios';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

import logger, { morganMiddleware } from '../utils/logger';
import { crashHandler, type CrashHandler } from '../crashHandler';
import { EGamemodes, EServStat, IServerStats } from './sharedTypes';
import { node1 } from './data';

const ip = process.env.IP || '127.0.0.1';
const port = process.env.PORT || 4001;

const app: Express = express();
const server = http.createServer(app);

const allowlist = ['*'];
const corsOptionsDelegate = function (req: Request, callback) {
	let corsOptions = { origin: true };
	// if (allowlist.indexOf(req.header('Origin')) !== -1) {
	// 	corsOptions = { origin: true };
	// } else {
	// 	corsOptions = { origin: false };
	// }
	callback(null, corsOptions);
};


export async function hiveNode1(): Promise<CrashHandler> {
	return new Promise(async (resolve, reject) => {
		try {
			logger.info(`Starting server on port http://${ip}:${port}`);

			app.use(cors(corsOptionsDelegate));
			app.use(express.json());
			app.use(morganMiddleware);

			app.all('/', (req: Request, res: Response, next: NextFunction) => {
			const info: IServerStats = node1();

				res.json(info);
			});

			app.all('*', (req: Request, res: Response, next: NextFunction) => {
				try {
					throw 'Could not find the page you were looking for';
				} catch (err) {
					return crashHandler.webResponseCodes[404](err, req, res);
				}
			});

			server.listen(Number(port), ip, () => {
				logger.info(`Server listening on port ${port}`);
				// addWScache({
				// 	id: 'sendAimedMesg',
				// 	args: {
				// 		target: 'global',
				// 		message: {
				// 			text: `Server re-started successfully`,
				// 			position: 'top-center',
				// 			pauseOnHover: true,
				// 			pauseOnFocusLoss: true,
				// 		},
				// 	},
				// });
			});
		} catch (e) {
			resolve(crashHandler.mainFunctionExited(e));
		}
	});
}


hiveNode1()