import express, {
  Express,
  Request,
  Response,
  NextFunction,
  IRouter,
  IRoute,
} from "express";
import { AppDataSource as db } from "../../../data-source";
import { User } from "../../../entity/User";

import { bodyData } from "../../../types";

import { encrypt, isSame } from "../../../utils/bcrypt";

import { ValidateAuthenticity, getUser } from "../../../utils/validators";
import { removeFromArray } from "../../../utils/common";
import { ValidationStore } from "../../../cache";

type Req = Request;
type Res = Response;

class APIRouter_Users {
  public router: IRouter;
  constructor() {
    this.router = express.Router();
    this.router.get("/", this.Index);
    this.router.post("/create", this.CreateUser);
    this.router.post("/get", this.GetUser);
    this.router.post("/getAll", this.GetAllUsers);
    this.router.post("/validate", this.CheckIdentity);
    this.router.post("/getRawData", this.getData);
    this.router.post("/setRawData", this.setData);
    this.router.get("/deleteAdmin/:id", this.DeletefileAdminG);
    this.router.get("/banAdmin/:id", this.BanAdminG);
  }
  Index(req: Req, res: Res): IRoute {
    res.send("Hello World!");
    return;
  }
  async CreateUser(req: Req, res: Res) {
    const data = req.body.data
      ? req.body.data
      : {
        username: null,
        password: null,
        email: null,
      };
    const Condition_1 = (await getUser({ userName: data.username }))
    const Condition_2 = Condition_1.code == '30100' ? null : Condition_1
    console.log("Condition_1:\t", Condition_1, "\n", "Condition_2:\t", Condition_2)
    const doesExist =
      Condition_2 == null ? false : true;
    if (doesExist)
      return res.send({
        code: "Server:901:UserExistsInDatabase",
        shortcode: 901,
      });
    else {
      const user = new User();
      user.userName = data.username;
      user.displayName = data.username;
      user.userToken = makeid(32);
      user.password = encrypt(data.password);
      user.email = data.email;
      user.roles = ["default"];
      await db.manager.save(user);
      res.send({ code: "Server:101:UserCreated", shortcode: 101 });
    }

    // res.send({doesExist})
    //return res.send(JSON.stringify(data))
  }
  async GetUser(req: Req, res: Res) {
    const data = req.body.data
      ? req.body.data
      : {
        username: null,
        password: null,
        email: null,
      };
    // console.log(
    //   `AWAIT GETUSER:`, await getUser({ userName: data.username }),
    //   `\n---\n`,
    //   `CHECK`, (await getUser({ userName: data.username })) == null ? false : true
    // )
    const Condition_1 = (await getUser({ userName: data.username }))
    const Condition_2 = Condition_1.code == '30100' ? null : Condition_1
    console.log("Condition_1:\t", Condition_1, "\n", "Condition_2:\t", Condition_2)
    const doesExist =
      Condition_2 == null ? false : true;
    if (!doesExist)
      return res.send({ code: "Server:902:UserNotFound", shortcode: 902 });
    else {
      console.log(`In users.ts`, await getUser({ userName: data.username }))
      res.send({
        code: "Server:102:UserFound",
        shortcode: 102,
        data: { ...(await getUser({ userName: data.username })) },
      });
    }

    // res.send({doesExist})
    //return res.send(JSON.stringify(data))
  }
  async GetAllUsers(req: Req, res: Res) {
    const data = req.body.data
      ? req.body.data
      : {
        username: null,
        password: null,
        email: null,
      };

    // // @ts-expect-error 
    const usrs = await db.getRepository(User).find({
      select: {
        id: true,
        userName: true,
        userToken: true,
        roles: true
      }
    })

    let users = []

    for (let i of usrs) {
      i.password = "<REDACTED>";
      users.push(i)
    }

    res.json(users)

    // res.send({doesExist})
    //return res.send(JSON.stringify(data))
  }
  async CheckIdentity(req: Req, res: Res) {
    const data = req.body.data
      ? req.body.data
      : {
        username: null,
        password: null,
        email: null,
        isEmail: false,
      };
    const dataP =
      data.isEmail === true
        ? { email: data.email }
        : { userName: data.username };
    const doesExist = (await getUser(dataP)) == null ? false : true;
    if (!doesExist)
      return res.send({ code: "Server:902:UserNotFound", shortcode: 902 });
    else {
      // res.send({code: "Server:102:UserFound", data: {...await getUser({userName: data.username})}})
      const expectedUser = await getUser(dataP);
      if (expectedUser.password == undefined) return res.send({
        code: "Server:903:UserPasswordDoesntMatch",
        shortcode: 903,
      });
      else if (isSame(data.password, expectedUser.password))
        return res.send({
          code: "Server:103:UserPasswordMatches",
          shortcode: 103,
          userdata: { ...(await getUser(dataP)) },
        });
      else
        return res.send({
          code: "Server:903:UserPasswordDoesntMatch",
          shortcode: 903,
        });
    }

    // res.send({doesExist})
    //return res.send(JSON.stringify(data))
  }

  async getData(req: Req, res: Res) {
    const data = req.body.data;

    const neoData = {
      user: {
        name: req.cookies.UsrName,
        token: req.cookies.UsrToken,
      },
    };


    if ((await ValidateAuthenticity(neoData)) == false)
      return res.send({
        meta: ValidationStore.get(neoData.user),
        code: "Server:913:UserTokenDoesNotMatchUserName",
        shortcode: 913,
      });
    else {
      const retData = await getUser({ ...data });
      console.log(retData);
      return res.send(retData);
    }
  }
  async setData(req: Req, res: Res) {
    const data = req.body.data;
    console.log(data);
    const usrdat = JSON.parse(data);
    // const usrdat:any = data

    const usr = new User();
    usr.id = usrdat.id;
    usr.userToken = usrdat.userToken;
    usr.userName = usrdat.userName;
    usr.displayName = usrdat.displayName;
    usr.password = usrdat.password;
    usr.email = usrdat.email;
    usr.roles = usrdat.roles;
    usr.createdAt = usrdat.createdAt;
    await db.manager.save(usr);
    return res.send(await getUser({ userToken: usrdat.userToken }));
  }

  async DeletefileAdminG(req, res) {
    const id = req.params.id;

    const neoData = {
      user: {
        name: req.cookies.UsrName,
        token: req.cookies.UsrToken,
      },
    };

    if ((await ValidateAuthenticity(neoData)) == false)
      return res.send({
        code: "Server:913:UserTokenDoesNotMatchUserName",
        shortcode: 913,
      });
    else {
      const sender = await getUser({
        userName: neoData.user.name,
        userToken: neoData.user.token,
      });

      if (!sender.roles.includes("admin"))
        return res.send({ msg: "UNAUTHORIZED" });
      else {
        try {
          await db
            .createQueryBuilder()
            .delete()
            .from(User)
            .where("userToken = :token", { token: id })
            .execute()
          res.redirect("/admin/users")
        } catch (e) { }
      }
    }
  }
  async BanAdminG(req, res) {
    const id = req.params.id;

    const neoData = {
      user: {
        name: req.cookies.UsrName,
        token: req.cookies.UsrToken,
      },
    };

    if ((await ValidateAuthenticity(neoData)) == false)
      return res.send({
        code: "Server:913:UserTokenDoesNotMatchUserName",
        shortcode: 913,
      });
    else {
      const sender = await getUser({
        userName: neoData.user.name,
        userToken: neoData.user.token,
      });

      if (!sender.roles.includes("admin"))
        return res.send({ msg: "UNAUTHORIZED" });
      else {
        try {

          let usrdat: IUsrdat = await getUser({
            userToken: id
          });
          // const usrdat:any = data
      
          if (usrdat.roles.includes("banned")) usrdat.roles = removeFromArray(usrdat.roles, "banned")
          else usrdat.roles.push("banned")

          const usr = new User();
          usr.id = usrdat.id;
          usr.userToken = usrdat.userToken;
          usr.userName = usrdat.userName;
          usr.displayName = usrdat.displayName;
          usr.password = usrdat.password;
          usr.email = usrdat.email;
          usr.roles = usrdat.roles;
          usr.createdAt = usrdat.createdAt;
          await db.manager.save(usr);

          // if(sender.roles.includes("banned")) {}
          // else {}
          res.redirect("/admin/users")

        } catch (e) { }
      }
    }
  }
}


const APIRoutes_Users = new APIRouter_Users().router;
export default APIRoutes_Users;

function makeid(length: number): string {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


interface IUsrdat {
  id: number;
  userToken: string;
  userName: string;
  displayName: string;
  password: string;
  email: string;
  roles: string[];
  createdAt: Date|string;
}