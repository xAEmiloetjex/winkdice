import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Chat } from "./entity/Chat";
import { ChatChannel } from "./entity/ChatChannel";
import { Chatmessage } from "./entity/Chatmessage";
import { ChatmessageCH } from "./entity/ChatChannelmessage";
import { Env } from "./entity/Env";
import { Post } from "./entity/Post";
import { File } from "./entity/File";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "test",
  password: "pswd123",
  database: "test",
//   database: "test",
  synchronize: true,
  logging: true,
  entities: [User, Post, File, ChatChannel, ChatmessageCH, Chat, Chatmessage, Env],
  // entities: ['src/enyiy']
  migrations: [],
  subscribers: [],
});
