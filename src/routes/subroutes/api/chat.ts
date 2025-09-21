import express, {
	Express,
	Request,
	Response,
	NextFunction,
	IRouter,
	IRoute,
} from 'express';
import { AppDataSource as db } from '../../../data-source';
import { ChatmessageCH } from '../../../entity/ChatChannelmessage';
import { ChatChannel } from '../../../entity/ChatChannel';
import { User } from '../../../entity/User';
import { addWScache } from '../../../sockets';

import { getUser, getStore } from '../../../utils/validators';

import { crashHandler } from '../../../crashHandler';
import { cache } from '../../../cache';
import { Caches } from '../../../namespaces';

import { bodyData } from '../../../types';

const queryRunner = db.createQueryRunner();

const Chatmessage = ChatmessageCH;

type Req = Request;
type Res = Response;

const Chats = db.getRepository(ChatChannel);
const Messages = db.getRepository(ChatmessageCH);

class APIRouter_Chat {
	public router: IRouter;
	constructor() {
		this.router = express.Router();
		
		this.router.use((req, res, next) => {
			console.log(req.url, req.body, req.query, req.params)
			next()
		})

		this.router.get('/', this.Index);
		this.router.post('/send', this.sendChat);
		this.router.post('/getMessages', this.getMessages);
		this.router.post('/getChats', this.getChats);
		this.router.post('/getChatByID', this.getChatByID);
		this.router.post('/delete', this.delete);
	}
	Index(req: Req, res: Res): IRoute {
		res.send('Hello World!');
		return;
	}

	async sendChat(req: Req, res: Res) {
		const data = req.body.data;
		if (data.content == '')
			return res.send({
				code: 'Server:5001:MessageContentEmpty',
				shortcode: 5001,
			});
		if (data.target === 'global') {
		} else {
			// First validate that the user has the right token!

			if ((await ValidateAuthenticity(data)) == false)
				return res.send({
					code: 'Server:913:UserTokenDoesNotMatchUserName',
					shortcode: 913,
				});
			else {
				const channel = await getChat({ name: data.target });

				// console.log("fdhfdhfdophkldsfhjkfdjhoijfghjfdoijhio", channel)
				// process.exit(1)

				// Now you can go on and send message!
				const doesExist = (channel == null || channel.code == '30100') ? false : true;
				// console.log(doesExist)
				if (!doesExist) {
					const chat = new ChatChannel();
					chat.owner = data.sender;
					chat.name = data.target;
					chat.participants = [];
					chat.muted = [];
					await db.manager.save(chat);
				}

				const chat = channel;

				if (chat.muted && chat.muted.includes(data.sender) && !(chat.owner == data.sender))
					return addWScache({
						id: 'sendAimedMesg',
						args: {
							target: data.sender,
							message: {
								text: `You have been muted by the channel owner! please contact '${chat.owner}' for information (as they are the channel owner)`,
								position: 'bottom-center',
								autoClose: false,
								class: 'toastWarn',
							},
						},
					});

				if (String(data.content).startsWith('>>')) Command(data);
				else StoreMessage(data);

				// console.log(channel);

				return res.send({
					code: 'Server:1002:MessageStored',
					shortcode: 1002,
					data
				});
			}
		}
	}
	async getMessages(req: Req, res: Res) {
		const data = req.body.data;
		const channel = await getChat({ name: data.target });

		const doesExist = channel == null ? false : true;
		if (!doesExist)
			return res.send({
				code: 'Server:9001:NoMessages',
				shortcode: 9001,
				messages: [
					{
						id: 0,
						chatId: 0,
						sendBy: '[SERVER]',
						content: 'There are no messages here!',
						createdAt: '0000-00-00T00:00:00.0000Z',
					},
				],
			});
		const FetchedMesgs_ = async function () {
      let result;
      let isCached = false;
      try {
				const cacheResult = cache.get(`${Caches.chatMessages}__channel.id`);
				// console.log(cacheResult);
				if (cacheResult) {
					isCached = true;
					result = JSON.parse(cacheResult);
				} else {
					result = await Messages.findBy({
            chatId: channel.id,
          });
					if (result.length === 0) {
						throw `cache not found and could not be constructed`;
					}
					cache.set(`${Caches.chatMessages}__${channel.id}`, JSON.stringify(result));
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
		const FetchedMesgs = (await FetchedMesgs_()).data;
		console.log("FETCHEDMSGS::", FetchedMesgs)
		if (data.onlyLast == true)
			return res.send({
				code: 'Server:1001:FetchedMessages',
				shortcode: 1001,
				messages: [FetchedMesgs[FetchedMesgs.length - 1]],
			});
		else
			return res.send({
				code: 'Server:1001:FetchedMessages',
				shortcode: 1001,
				messages: FetchedMesgs,
			});
	}
	async getChatByID(req: Req, res: Res) {
		const data = req.body.data;
		// console.log(data)
		const Chats = db.getRepository(ChatChannel);

		const datar =
			data.singleProp == true
				? (await Chats.findOneBy({ id: data.id }))[data.prop]
				: await Chats.findOneBy({ id: data.id });
		// console.log(datar)

		res.send({ ...datar });
	}
	async getChats(req: Req, res: Res) {
		const data = req.body.data;
		async function getChats(target) {
			const method1 = Chats.findBy({ owner: target });
			return [...(await method1)];
		}
		return res.send({
			code: 'Server:1004:FetchedChats',
			shortcode: 1004,
			chats: await getChats(data.user),
		});
	}

	async delete(req: Req, res: Res) {
		const data: bodyData = req.body.data;

		console.log(data);
		if (
			(await ValidateAuthenticity({
				sender: data.user.name,
				authToken: data.user.token,
			})) == false
		)
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
				.from(ChatChannel)
				.where('id = :id', { id: data.chat.id })
				.execute();
			console.log(data.chat);
			const msgs = Messages.findBy({ chatId: data.chat.id });
			(await msgs).forEach(async (msg) => {
				await db
					.createQueryBuilder(queryRunner)
					.delete()
					.from(ChatmessageCH)
					.where('id = :id', { id: msg.id })
					.execute();
				console.log(msg);
			});
			// await queryRunner.release();

			// addWScache({ id: "homeReloadPosts", args: {} });
		}
	}
}

const APIRoutes_Chat = new APIRouter_Chat().router;
export default APIRoutes_Chat;

async function getChat(options) {
	const store = (await getStore(Chats, Caches.chatChannel, options))
	// console.log("Function[getChat(options: any) => Store.data]", store)
	return store.data;
}

async function ValidateAuthenticity(data: any) {
	const sender = await getUser({ userName: data.sender });
	const matches = sender.userToken == data.authToken;

	if (matches && sender.roles.includes('banned')) return false;

	return matches;
}

export async function StoreMessage(data) {
	const isBot = data.isBot == true ? data.cmdSender : data.sender;

	const chatMessage = new Chatmessage();
	chatMessage.chatId = (await getChat({ name: data.target })).id;
	chatMessage.target = data.target;
	chatMessage.sendBy = data.sender;
	chatMessage.content = data.content;
	db.manager.save(chatMessage);
	// console.log(chatMessage)
	addWScache({
		id: 'newMessageOnChannel',
		args: { target: isBot, msg: chatMessage },
	});
}

async function Command(data) {
	const msg: string = data.content.replace('>>', '>> ');
	const _ = msg.split(' ');
	const store = _.slice(1, _.length);
	const cmd = store[0];
	const args = store.slice(1, store.length);

	console.log({
		msg,
		store,
		cmd,
		args,
	});

	StoreMessage(data);

	if (cmd == 'notify') {
		const sender = await getUser({ userToken: data.authToken });
		const chat = await getChat({ name: data.target });
		console.log(sender, chat);
		if (sender.roles.includes('admin')) {
			addWScache({
				id: 'notification_send',
				args: {
					msg: `${args.join(' ')}`,
					data,
				},
			});
		}
	}

	if (cmd == 'clear') {
		const sender = await getUser({ userToken: data.authToken });
		const chat = await getChat({ name: data.target });
		console.log(sender, chat);
		if (sender.userName == chat.owner) {
			const msgs = Messages.findBy({
				chatId: (await getChat({ name: data.target })).id,
			});
			const prom = new Promise(async (res, rej) => {
				const countInit = (await msgs).length;
				let count = 0;
				count += countInit;
				(await msgs).forEach(async (msg) => {
					await db
						.createQueryBuilder(queryRunner)
						.delete()
						.from(ChatmessageCH)
						.where('id = :id', { id: msg.id })
						.execute();
					console.log(msg);
					count--;
				});
				res(count);
			});
			prom.then((count) => {
				addWScache({
					id: 'sendAimedMesg',
					args: {
						target: sender.userName,
						message: {
							text: `Cleared your chat`,
							position: 'top-right',
							pauseOnHover: true,
							pauseOnFocusLoss: true,
						},
					},
				});
				StoreMessage({
					target: data.target,
					sender: '[SERVER BOT]',
					content: 'The chat has been cleared!',
					isBot: true,
					cmdSender: data.sender,
				});
				addWScache({
					id: 'reloadChat',
					args: {
						cname: data.target,
					},
				});
			});
		} else return;
	}

	if (cmd == 'hello') {
		const sender = await getUser({ userToken: data.authToken });
		const chat = await getChat({ name: data.target });
		console.log(sender, chat);
		if (sender.userName == chat.owner) {
			StoreMessage({
				target: data.target,
				sender: '[SERVER BOT]',
				content: 'Hello, World!',
				isBot: true,
				cmdSender: data.sender,
			});
		} else return;
	}

	if (cmd == 'mute') {
		const sender = await getUser({ userToken: data.authToken });
		const chat = await getChat({ name: data.target });
		console.log(sender, chat);
		if (sender.userName == chat.owner) {
			if (chat.muted.includes(args[0])) {
				chat.muted = removeFromArray(chat.muted, args[0]);
				db.manager.save(chat);
				StoreMessage({
					target: data.target,
					sender: '[SERVER BOT]',
					content: "Unmuted '" + args[0] + "'!",
					isBot: true,
					cmdSender: data.sender,
				});
			} else {
				chat.muted.push(args[0]);
				db.manager.save(chat);
				StoreMessage({
					target: data.target,
					sender: '[SERVER BOT]',
					content: "Muted '" + args[0] + "'!",
					isBot: true,
					cmdSender: data.sender,
				});
			}
		} else return;
	}

	if (cmd == 'invitebot') {
		const sender = await getUser({ userToken: data.authToken });
		const chat = await getChat({ name: data.target });
		console.log(sender, chat);
		if (sender.userName == chat.owner) {
			addWScache({ id: 'inviteBot', args: { chat, bot: args[0] } });
		} else return;
	} else {
		void 0;
	}
}

function removeFromArray(Arr, Str) {
	let WorkFlow;
	WorkFlow = Arr.join(',');
	WorkFlow = WorkFlow.replace(',' + Str, '');
	WorkFlow = WorkFlow.split(',');
	return WorkFlow;
}
