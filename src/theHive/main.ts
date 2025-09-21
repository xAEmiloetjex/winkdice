import * as http from 'node:http';

import axios from 'axios';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

import logger, { morganMiddleware } from '../utils/logger';
import { crashHandler, type CrashHandler } from '../crashHandler';
import { IServerStats, EServStat } from './sharedTypes';

const ip = process.env.IP || '127.0.0.1';
const port = process.env.PORT || 4000;

const app: Express = express();
const server = http.createServer(app);

app.disable('x-powered-by')

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

const map = new Map<string, IServerStats>();

export async function hiveMain(): Promise<CrashHandler> {
	return new Promise(async (resolve, reject) => {
		try {
			logger.info(`Starting server on port http://${ip}:${port}`);

			app.use(cors(corsOptionsDelegate));
			app.use(express.json());
			app.use(morganMiddleware);

            app.all("*", (req: Request, res: Response, next: NextFunction) => {
                res.setHeader("x-powered-by", "Bigus Dickus")
								res.setHeader("x-isHive", "yes")
                next();
            })

			app.all('/node1', (req: Request, res: Response, next: NextFunction) => {
				res.json(map.get('node1'));
			});
			app.all('/node2', (req: Request, res: Response, next: NextFunction) => {
				res.json(map.get('node2'));
			});
			app.all('/node3', (req: Request, res: Response, next: NextFunction) => {
				res.json(map.get('node3'));
			});

			app.all('/all', (req: Request, res: Response, next: NextFunction) => {
				res.json([
					map.get('node1'),
					map.get('node2'),
					map.get('node3'),
				]);
			});

            setInterval(Ping, 3000)

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

function Ping() {
	try {
		axios({
			url: 'http://localhost:4001/',
			method: 'GET',
		}).then((resp) => {
			map.set("node1", resp.data)
            console.log(resp.data)
		}).catch(() => {
            map.set("node1", UnavailibleServer("Velocity", "127.0.0.1", 25577))
        });
        
        axios({
			url: 'http://localhost:4002/',
			method: 'GET',
		}).then((resp) => {
			map.set("node2", resp.data)
            console.log(resp.data)
		}).catch(() => {
            map.set("node2", UnavailibleServer("LifestealSMP", "127.0.0.1", 25565))
        });

        axios({
			url: 'http://localhost:4003/',
			method: 'GET',
		}).then((resp) => {
			map.set("node3", resp.data)
            console.log(resp.data)
		}).catch(() => {
            map.set("node3", UnavailibleServer("Kingdoms", "127.0.0.1", 25566))
        });
	} catch (e) {
		console.log(e);
	}
}

function UnavailibleServer(name: string, ip: string, port: number): IServerStats {
    return {
        servername: name,
        status: EServStat.unavailable,
        players: [],
        playercount: 0,
        max_playercount: 0,
        software: 'unknown',
        ip: ip,
        port: port,
        ping: -1,
        version: '',
		isBehindProxy:false
    };
}

hiveMain()