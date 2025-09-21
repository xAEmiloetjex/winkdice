import express, {
	Express,
	Request,
	Response,
	NextFunction,
	IRouter,
	IRoute,
} from 'express';
import DOMPurify from 'dompurify';
import * as mfm from 'mfm-js';
import { marked } from 'marked';

import { AppDataSource as db } from '../../../data-source';
import { User } from '../../../entity/User';
import { Post } from '../../../entity/Post';

const queryRunner = db.createQueryRunner();

import { addWScache } from '../../../sockets';

import { bodyData } from '../../../types';

import { db as mdb } from '../../../..';

import { ValidateAuthenticity, getUser } from '../../../utils/validators';
import { queueNames, Caches } from '../../../namespaces';
import { cache } from '../../../cache';
import { crashHandler } from '../../../crashHandler';

// import {} from "quickmongo"

let sjex = {
	likes: [],
};

type Req = Request;
type Res = Response;

// QuickMongo Table
const table = async () => {
	const tbl = await mdb.get('posts');
	if (tbl == null) return [];
	else return tbl;
};
// QuickMongo Table.END

const Users = db.getRepository(User);
const Posts = db.getRepository(Post);

class APIRouter_Files {
	public router: IRouter;
	constructor() {
		this.router = express.Router();
		this.router.get('/', this.index);
		this.router.post('/create', this.create);
		this.router.post('/get', (req, res, next) =>
			this.getPosts(req, res, next, false)
		);
		this.router.post('/getSpec', this.getPostSpec);
		this.router.post('/delete', this.delete);
		this.router.post('/like', this.toggleLike);
		this.router.get('/likes', this.getLikes);
	}

	index(req: Req, res: Res): IRoute {
		res.send('hello, world!');
		return;
	}

	async getLikes(req: Req, res: Res): Promise<IRoute | any> {
		const data: bodyData = req.body.data;

		console.log(await table());

		res.send({ posts: await table() });
	}

	async toggleLike(req: Req, res: Res): Promise<IRoute | any> {
		const data: bodyData = req.body.data;

		console.log(data);
		if ((await ValidateAuthenticity(data)) == false)
			return res.send({
				code: 'Server:913:UserTokenDoesNotMatchUserName',
				shortcode: 913,
			});
		else {
			const exists = await getData('post_id', data.post.id);
			if (exists == null)
				(await setData('', {
					post_id: data.post.id,
					likes: [data.user.name],
				})) && console.log('YOEEEPPPP');
			else {
				let existing: string[] = exists['likes'];
				if (data.filter == 'remove') {
					console.log(
						`--------------------------------------------\n`,
						'Changed:',
						removeFromArray(existing, data.user.name),
						'\nOriginal:',
						existing,
						'\n--------------------------------------------\n'
					);

					// sjex.likes = removeFromArray(existing, data.user.name)
					if (existing.length == 1) await setMap(data.post.id, 'likes', []);
					else
						await setMap(
							data.post.id,
							'likes',
							removeFromArray(existing, data.user.name)
						);

					console.log(await getData('post_id', data.post.id));
				} else {
					await existing.push(data.user.name);
					await setMap(data.post.id, 'likes', existing);
					// sjex.likes.push(data.user.name)
				}
				console.log('YUPPPPP');
			}
			return res.send({
				code: 'Server:100:Success',
				shortcode: 100,
			});
		}
	}

	async getPostSpec(req: Req, res: Res) {
		const data: bodyData = req.body.data;
		// const passedID = req.params.id;
		const Posts = await db.getRepository(Post);
		let requestedPost = await Posts.findOneBy({ id: data.post.id });
		let likes = [];
		const exists = await getData('post_id', data.post.id);
		if (exists == null) likes = [];
		else likes = exists['likes'];

		requestedPost['likes'] = likes;

		// console.log(passedID, Number(passedID))
		res.send({ post: requestedPost });
	}
	async getPosts(
		req: Req,
		res: Res,
		next?: NextFunction,
		isForRecache?: boolean
	) {
		const data: bodyData = req.body.data;
		const posts = async function (): Promise<any> {
			let result;
			let isCached = false;

			try {
				const cacheResult = cache.get(`${Caches.posts}__general`);
				console.log(cacheResult);
				if (cacheResult) {
					isCached = true;
					result = JSON.parse(cacheResult);
				} else {
					result = await db.getRepository(Post).find({
						select: {
							id: true,
							poster: true,
							title: true,
							content: true,
							views: true,
						},
					});
					if (result.length === 0) {
						throw `cache not found and could not be constructed`;
					}
					cache.set(`${Caches.posts}__general`, JSON.stringify(result));
				}

				return {
					status: 'success',
					data: result,
				};
			} catch (e) {
				console.log(e);
				return {
					status: 'failed',
					data: crashHandler.DB.general[100](e),
				};
			}
		};
		if (isForRecache === true) return posts();
		if (isForRecache === false) {
			try {
				return res.send({ posts: [...(await posts()).data].reverse() });
			} catch(e) {
				void(e);
				return res.send({ posts: [] })
			}
		}
	}
	async create(req: Req, res: Res, next: NextFunction) {
		const data: bodyData = req.body.data;

		console.log(data);
		if ((await ValidateAuthenticity(data)) == false)
			return res.send({
				code: 'Server:913:UserTokenDoesNotMatchUserName',
				shortcode: 913,
			});
		else if (data.post.content == '' || data.post.title == '')
			return res.send({
				code: 'Server:5016:TitleOrContentEmpty',
				shortcode: 5016,
			});
		else {
			try {
				console.log('PARSIIH');

				const post = new Post();
				post.poster = data.user.name;
				post.title = data.post.title;
				post.content = PARSE(data.post.content);
				post.views = 0;
				post.likes = [];
				const savedPost = await db.manager.save(post);

				await (() => {
					const cacheResult = cache.get(`${Caches.posts}__general`);
					if (cacheResult) {
						let cacheName = `${Caches.posts}__general`;
						let cached: any[] = JSON.parse(cache.get(cacheName));
						cached.push({
							id: savedPost.id,
							poster: data.user.name,
							title: data.post.title,
							content: PARSE(data.post.content),
							views: 0,
							likes: [],
						});
						cache.set(cacheName, JSON.stringify(cached));
						// cache.delete(cacheName)
					}
				})();
				// await this.getPosts(req, res, next, true)

				addWScache({ id: 'homeReloadPosts', args: {} });

				return res.send({
					code: 'Server:1016:SuccessfullyCreatedPost',
					shortcode: 1016,
				});
			} catch (e) {
				console.log(e);
				return res.send({
					code: 'Server:9016:SomethingWentWrongCreatingPost',
					shortcode: 9016,
				});
			}
		}
		// return
	}
	async delete(req: Req, res: Res) {
		const data: bodyData = req.body.data;

		console.log(data);
		if ((await ValidateAuthenticity(data)) == false)
			return res.send({
				code: 'Server:913:UserTokenDoesNotMatchUserName',
				shortcode: 913,
			});
		else {
			// // take a connection from the connection pool
			// await queryRunner.connect();
			// const posts = await queryRunner.manager.find(Post);

			await db
				.createQueryBuilder(queryRunner)
				.delete()
				.from(Post)
				.where('id = :id', { id: data.post.id })
				.execute();

			await (() => {
				const cacheResult = cache.get(`${Caches.posts}__general`);

				if (cacheResult) {
					let cacheName = `${Caches.posts}__general`;
					let cached: any[] = JSON.parse(cache.get(cacheName));
					let removed: any[] = [];

					cached.forEach((item, index) => {
						if (item.id != data.post.id) removed.push(item);
					});

					console.log(`cached`, cached, '\n\n\n', 'removed', removed);

					cache.set(cacheName, JSON.stringify(removed));
					// cache.delete(cacheName)
				}
			})();
			// await queryRunner.release();

			addWScache({ id: 'homeReloadPosts', args: {} });
		}
	}
}

const APIRoutes_Posts = new APIRouter_Files().router;
export default APIRoutes_Posts;

function PARSE(input) {
	// const stage1 = DOMPurify.sanitize(input);
	const stage2 = marked.parse(input);
	// const stage3 = mfm.parse(stage2);

	return stage2;
}

// MongoDB-QuickMongo / Quick.DB stuff

export async function init() {
	if (!(await mdb.has('posts')))
		await mdb.set('posts', [{ post_id: '', likes: [] }]);
}

export async function getData(platform, platId) {
	const map = await findMap(platform, platId);
	console.log('Map:', map);
	if (map == 0) return null;
	else {
		const mapObj = (await table())[map];
		return mapObj;
	}
}

export async function setData(profileID, object): Promise<boolean | null> {
	const map = await findMap('post_id', profileID);
	// if (map == 0) return null;
	// const mapObj = (await table())[map]
	// if(map!=0) await db.set("profiles", removeFromArray((await table() as any[]), mapObj))
	// mapObj[platform] = platformID
	await mdb.push('posts', object);
	return true;
}

export async function deleteData(profileID): Promise<boolean | null> {
	const map = await findMap('post_id', profileID);
	if (map == 0) return null;
	const mapObj = (await table())[map];
	if (map != 0)
		await mdb.set('posts', removeFromArray((await table()) as any[], mapObj));
	return true;
}

export async function setMap(
	profileID,
	platform,
	platformID
): Promise<boolean | null> {
	const map = await findMap('prof_id', profileID);
	if (map == 0) return null;
	const mapObj = (await table())[map];
	if (map != 0)
		await mdb.set('posts', removeFromArray((await table()) as any[], mapObj));
	mapObj[platform] = platformID;
	await mdb.push('posts', mapObj);
	return true;
}

export async function findMap(client, id) {
	let Target = 0;
	((await table()) as unknown as any[]).forEach((item, index) => {
		if (item[client] == id) return (Target = index);
		else return;
	});
	return Target;
}

export function removeFromArray(Arr: any[], Str: any): any[] {
	console.log(
		'==============================\n',
		'| Arr:',
		Arr,
		'\n | Str:',
		Str,
		'\n+-----------------------------\n'
	);
	let WorkFlow;
	if (Arr.length != 1 || Arr.length >= 2) {
		console.log('| WorkFlow (0):', WorkFlow);
		WorkFlow = Arr.join(',');
		console.log('| WorkFlow (1):', WorkFlow);
		WorkFlow = WorkFlow.replace(',' + Str, '');
		console.log('| WorkFlow (2):', WorkFlow);
		WorkFlow = WorkFlow.split(',');
		console.log('| WorkFlow (3):', WorkFlow);
		console.log('==============================\n');
		return WorkFlow;
	} else return [];
}
export function getFromArray(Arr: any[], ID: number): any {
	let temp_1;

	Arr.forEach((item, index) => {
		item.index = index;
		if (item.ID == ID) return (temp_1 = item);
		else return;
	});

	return temp_1;
}
