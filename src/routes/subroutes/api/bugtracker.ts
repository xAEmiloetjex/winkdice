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

class APIRouter_Bugtracker {
	public router: IRouter;
	constructor() {
		this.router = express.Router();
		this.router.get('/', this.index);
		this.router.post('/new', this.AddReport);
		this.router.post('/newForm', this.AddReportForm);
		this.router.all('/fullTable', this.fullTable);
		this.router.all('/getFiltered/:type/:search_param', this.getFiltered)
		this.router.all('/getTable/:index', this.getTable);
		this.router.all('/getReport/:index_A/:index_B', this.getReport);
		this.router.all('/edit/:id', this.EditReport);
		this.router.all('/delete/:id', this.DeleteReport);
		// this.router.get("/files", this.files)
	}

	index(req: Req, res: Res): IRoute {
		res.render('bugtracker/index', {
			title: ``,
			chatTarget: req.params.usrname,
		});
		return;
	}

	async EditReport(req: Req, res: Res): Promise<IRoute | any> {
		const par = req.params;

		const data = req.body.data;

		console.log(data);

		// db.set()
		// res.send(data)

		const pars = {
			id: req.params.id,
		};

		const neoData = {
			user: {
				name: req.cookies.UsrName,
				token: req.cookies.UsrToken,
			},
		};

		if ((await ValidateAuthenticity(neoData)) == false)
			return res.send({
				code: 'Server:913:UserTokenDoesNotMatchUserName',
				shortcode: 913,
			});
		else {
			const Arr: IBugReport[] = await db.get('bigArray.bugs');
			const getReport = await findMap(Arr, 'id', pars.id);
			const report = Arr[getReport];
			const sender = await getUser({ userName: neoData.user.name });

			const DELETE = async () => {
				const report: IBugReport = data;
				if (
					report.platform == undefined ||
					report.user == undefined ||
					report.severity == undefined ||
					report.title == undefined ||
					report.description == undefined
				) {
					res.send({ msg: 'Invalid Data', code: '01' });
					return;
				} else {
					const Report: IBugReport = {
						id: await newId(),
						platform: report.platform,
						user: report.user,
						severity: report.severity,
						title: report.title,
						description: report.description,
					};

					let db__ = Arr;
					db__[getReport] = Report;
					await db.set('bigArray.bugs', db__);
					return res.send(
						`<h1>Edited bug #${pars.id}, redirecting... (it may take up to 10 seconds before it is actually changed)</h1><script>setTimeout(() => {window.location.href = "/bugs"},1000)</script>`
					);

					// db.push("bigArray.bugs", )
					// res.send({...(await db.get("bigArray.bugs") as object)})

					// TEMPORARY //
					// splitTable()
					// ///////// //
				}
			};

			if (report.user == sender.userName) DELETE();
			else if (sender.roles.includes('admin')) DELETE();
			else
				return res.status(403).send({
					msg: 'You are not allowed to delete this',
					code: 'Server:910:NoPermissionsForAction',
					shortcode: 910,
				});

			// let filesDB: any[] = await mdb.get("files");
			// filesDB.splice(fileData.index, fileData.index);
			// await mdb.set("files", filesDB);
		}

		return;
	}

	async DeleteReport(req: Req, res: Res): Promise<IRoute | any> {
		const par = req.params;

		const pars = {
			id: req.params.id,
		};

		const neoData = {
			user: {
				name: req.cookies.UsrName,
				token: req.cookies.UsrToken,
			},
		};

		if ((await ValidateAuthenticity(neoData)) == false)
			return res.send({
				code: 'Server:913:UserTokenDoesNotMatchUserName',
				shortcode: 913,
			});
		else {
			const Arr: IBugReport[] = await db.get('bigArray.bugs');
			const getReport = await findMap(Arr, 'id', pars.id);
			const report = Arr[getReport];
			const sender = await getUser({ userName: neoData.user.name });

			const DELETE = async () => {
				let db__ = Arr;
				await db__.splice(getReport, getReport);
				await db.set('bigArray.bugs', db__);
				return res.send(
					`<h1>Deleted bug #${pars.id}, redirecting... (it may take up to 10 seconds before it is actually removed)</h1><script>setTimeout(() => {window.location.href = "/bugs"},1000)</script>`
				);
			};

			if (report.user == sender.userName) DELETE();
			else if (sender.roles.includes('admin')) DELETE();
			else
				return res.status(403).send({
					msg: 'You are not allowed to delete this',
					code: 'Server:910:NoPermissionsForAction',
					shortcode: 910,
				});

			// let filesDB: any[] = await mdb.get("files");
			// filesDB.splice(fileData.index, fileData.index);
			// await mdb.set("files", filesDB);
		}

		return;
	}

	async AddReport(req: Req, res: Res): Promise<IRoute> {
		const data = req.body.data;

		console.log(data);

		const report: IBugReport = data;
		if (
			report.platform == undefined ||
			report.user == undefined ||
			report.severity == undefined ||
			report.title == undefined ||
			report.description == undefined
		) {
			res.send({ msg: 'Invalid Data', code: '01' });
			return;
		} else {
			const Report: IBugReport = {
				id: await newId(),
				platform: report.platform,
				user: report.user,
				severity: report.severity,
				title: report.title,
				description: report.description,
			};

			db.push('bigArray.bugs', Report);
			res.send({ ...((await db.get('bigArray.bugs')) as object) });

			// TEMPORARY //
			// splitTable()
			// ///////// //
		}
		// db.set()
		// res.send(data)
		return;
	}
	async AddReportForm(req: Req, res: Res): Promise<IRoute> {
		const data = req.body.data;

		console.log(data);

		// const report: IBugReport = data;
		// if (report.platform == undefined ||
		//     report.user == undefined ||
		//     report.severity == undefined ||
		//     report.title == undefined ||
		//     report.description == undefined
		// ) {
		//     res.send({ msg: "Invalid Data", code: "01" })
		//     return
		// } else {

		//     const Report: IBugReport = {
		//         id: await newId(),
		//         platform: report.platform,
		//         user: report.user,
		//         severity: report.severity,
		//         title: report.title,
		//         description: report.description
		//     }

		//     db.push("bigArray.bugs", Report)
		//     res.send({...(await db.get("bigArray.bugs") as object)})

		//     // TEMPORARY //
		//     // splitTable()
		//     // ///////// //
		// }
		// db.set()
		// res.send(data)
		return;
	}

	async fullTable(req: Req, res: Res) {
		res.send({ ...((await db.get('bigArray')) as object) });
	}

	async getFiltered(req:Req,res:Res) {
		// Todo: Add this functionality (Hard cache it tho... its my own term for storing it in mdb for 10 days or something)
		// * searchParam filter.state 					'bigArray.filtered.by_state.minor'
		// * searchParam filter.uploader 				'bigArray.filtered.by_uploader.xA_E'
		// * searchParam filter.uploader_strict 'bigArray.filtered.by_uploader_strict.xA_Emiloetjex'
		// * searchParam filter.title 					'bigArray.filtered.by_title.Chat'
		// *-----------------------------------------------------------------------------------------
		// * exampleOf 	 filter.title 					'Chat BlaBlaBla'.toLowerCase().split(' ').join("_")
		const baseTable = (await db.get('bigArray.bugs')) as any[]
		res.send({})
	}

	async getTable(req: Req, res: Res) {
		const indx = req.params.index;
		
		const table = (await db.get('bigArray.bugsSplit')) as any[];
		const isNull = table == null ? [] : table;

		if (indx == null || indx == "null") return res.send({
			table: [],
			pagesLength: 0
		})

		res.send({ table: [...table[indx]], pagesLength: table.length });
	}
	async getReport(req: Req, res: Res) {
		const indx_a = req.params.index_A;
		const indx_b = req.params.index_B;
		const table = (await db.get('bigArray.bugsSplit')) as any[];
		const isNull = table == null ? [] : table;

		res.send({ table: [...table[indx_a]][indx_b], pagesLength: table.length });
	}
}

const APIRoutes_Bugtracker = new APIRouter_Bugtracker().router;
export default APIRoutes_Bugtracker;

interface IBugReport {
	id: string;
	platform?: string;
	user?: string;
	severity?: string;
	title?: string;
	description?: string;
}

async function newId(): Promise<string> {
	const table = (await db.get('bigArray.bugs')) as any[];
	const isNull = table == null ? 0 : table.length;
	const length: number = isNull;
	const newIdInt = length + 1;

	return decimalToHexString(newIdInt);
}

async function splitTable(size: number = 20) {
	const table = (await db.get('bigArray.bugs')) as any[];
	const isNull = table == null ? [] : table;

	await db.set('bigArray.bugsSplit', await splitArray(table, size));
}

// _.chunk(<ARRAY>, <CHUNK SIZE>)

setInterval(splitTable, 10000);
