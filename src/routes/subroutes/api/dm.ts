import express, {
  Express,
  Request,
  Response,
  NextFunction,
  IRouter,
  IRoute,
} from "express";
import { AppDataSource as db } from "../../../data-source";
import { Chatmessage } from "../../../entity/Chatmessage";
import { Chat } from "../../../entity/Chat";
import { User } from "../../../entity/User";
import { addWScache } from "../../../sockets";

import { bodyData } from "../../../types";

import { getUser } from "../../../utils/validators";

const Chats = db.getRepository(Chat);
const Messages = db.getRepository(Chatmessage);


const queryRunner = db.createQueryRunner();



type Req = Request;
type Res = Response;

class APIRouter_Chat {
  public router: IRouter;
  constructor() {
    this.router = express.Router();
    this.router.get("/", this.Index);
    this.router.post("/send", this.sendChat);
    this.router.post("/getMessages", this.getMessages);
    this.router.post("/getChats", this.getChats);
    this.router.post("/getChatByID", this.getChatByID);
    this.router.post("/delete", this.delete);
  }
  Index(req: Req, res: Res): IRoute {
    res.send("Hello World!");
    return;
  }

  async sendChat(req: Req, res: Res) {
    const data = req.body.data;
    if (data.content == "")
      return res.send({
        code: "Server:5001:MessageContentEmpty",
        shortcode: 5001,
      });
    if (data.target === global) {
    } else {
      // First validate that the user has the right token!

      if (await ValidateAuthenticity(data) == false)
        return res.send({
          code: "Server:913:UserTokenDoesNotMatchUserName",
          shortcode: 913,
        });
      else {
        // Now you can go on and send message!
        const doesExist =
          (await getChat(data.target, data.sender)) == null ? false : true;
        // console.log(doesExist)
        if (!doesExist) {
          const chat = new Chat();
          chat.user1 = data.sender;
          chat.user2 = data.target;
          await db.manager.save(chat);
        }
        console.log(await getChat(data.target, data.sender));
        const chatMessage = new Chatmessage();
        chatMessage.chatId = (await getChat(data.target, data.sender)).id;
        chatMessage.sendBy = data.sender;
        chatMessage.content = data.content;
        await db.manager.save(chatMessage);
        addWScache({ id: "newMessage", args: { target: data.target } });
        return res.send({
          code: "Server:1002:MessageStored",
          shortcode: 1002,
        });
      }
    }
  }
  async getMessages(req: Req, res: Res) {
    const data = req.body.data;
    const doesExist =
      (await getChat(data.target, data.sender)) == null ? false : true;
    if (!doesExist)
      return res.send({
        code: "Server:9001:NoMessages",
        shortcode: 9001,
        messages: [
          {
            id: 0,
            chatId: 0,
            sendBy: "[SERVER]",
            content: "There are no messages here!",
            createdAt: "0000-00-00T00:00:00.0000Z",
          },
        ],
      });
    const Messages = db.getRepository(Chatmessage);
    const FetchedMesgs = await Messages.findBy({
      chatId: (await getChat(data.target, data.sender)).id,
    });
    if (data.onlyLast == true)
      return res.send({
        code: "Server:1001:FetchedMessages",
        shortcode: 1001,
        messages: [FetchedMesgs[FetchedMesgs.length - 1]],
      });
    else
      return res.send({
        code: "Server:1001:FetchedMessages",
        shortcode: 1001,
        messages: FetchedMesgs,
      });
  }
  async getChatByID(req: Req, res: Res) {
    const data = req.body.data;
    const Chats = db.getRepository(Chat);

    const datar =
      data.singleProp == true
        ? (await Chats.findOneBy({ id: data.id }))[data.prop]
        : await Chats.findOneBy({ id: data.id });
    res.send({ ...datar });
  }
  async getChats(req: Req, res: Res) {
    const data = req.body.data;
    async function getChats(target) {
      const method1 = Chats.findBy({ user1: target });
      const method2 = Chats.findBy({ user2: target });
      return [...(await method1), ...(await method2)];
    }
    return res.send({
      code: "Server:1004:FetchedChats",
      shortcode: 1004,
      chats: await getChats(data.user),
    });
  }
  async delete(req: Req, res: Res) {
    const data: bodyData = req.body.data;

    console.log(data);
    if ((await ValidateAuthenticity({sender: data.user.name, authToken: data.user.token})) == false)
      return res.send({
        code: "Server:913:UserTokenDoesNotMatchUserName",
        shortcode: 913,
      });
    else {
      // // take a connection from the connection pool
      // await queryRunner.connect();
      // const posts = await queryRunner.manager.find(Post);

      await db
        .createQueryBuilder(queryRunner)
        .delete()
        .from(Chat)
        .where("id = :id", { id: data.chat.id })
        .execute();
      console.log(data.chat)

      const msgs = Messages.findBy({ chatId: data.chat.id });
      (await msgs).forEach(async msg => {
        await db
        .createQueryBuilder(queryRunner)
        .delete()
        .from(Chatmessage)
        .where("id = :id", { id: msg.id })
        .execute();

      console.log(msg)
      })
      // await queryRunner.release();

      // addWScache({ id: "homeReloadPosts", args: {} });
    }
  }
}

const APIRoutes_DM = new APIRouter_Chat().router;
export default APIRoutes_DM;


async function getChat(target, sender) {
  const method1 = Chats.findOneBy({ user1: target, user2: sender });
  const method2 = Chats.findOneBy({ user1: sender, user2: target });
  return (await method1) == null ? method2 : method1;
}

async function ValidateAuthenticity(data: any) {

  const sender = await getUser({userName: data.sender})
  const matches = (sender.userToken == data.authToken)

  if (matches && sender.roles.includes("banned")) return false 

  return matches;
}
