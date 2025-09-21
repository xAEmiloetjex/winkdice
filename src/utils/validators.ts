import { bodyData } from "../types";

// import { redisClient } from "../main";
import { AppDataSource } from "../data-source";
import { crashHandler } from "../crashHandler";

import { Caches } from "../namespaces";
import { cache, ValidationStore } from "../cache";

import { User } from "../entity/User";
import { Repository } from "typeorm";
import { ChatChannel } from "../entity/ChatChannel";
import { Post } from "../entity/Post";
import { Chat } from "../entity/Chat";


const db = AppDataSource;
const Users = db.getRepository(User)

export async function getStore(dbRepo:Repository<User|ChatChannel|Post|Chat>,cacheName: Caches, options): Promise<{
    status: string;
    data: any;
}> {
    let result;
    let isCached = false;
    try {
        const cacheResult = await cache.get(`${cacheName}__${JSON.stringify(options)}`);
        if (cacheResult) {
            isCached = true;
            result = JSON.parse(cacheResult);
        } else {
            result = await dbRepo.findOneBy(options);
            if (result.length === 0) {
                throw `object by data '${options}' not found`
            }
            await cache.set(`${cacheName}__${JSON.stringify(options)}`, JSON.stringify(result))
        }

        // console.log(await result, cacheResult)

        return {
            status: "success",
            data: result
        }
    } catch (e) {
        return {
            status: "failed",
            data: crashHandler.DB.general[100](e)
        }
    }
}

export async function ValidateAuthenticity(data: bodyData): Promise<boolean> {
    if (data.user.name == "" || data.user.token == "") {
        ValidationStore.set(data.user, {
            matches: false,
            isBanned: false
        })
        return false
    };;
    const senderMeta = await getStore(Users, Caches.userName, { userName: data.user.name });
    const sender     = await senderMeta.data;

    // console.log(`passed data:`, data, '\n\n\n', `processed data:`, senderMeta)

    if (senderMeta.status == "failed") {
        ValidationStore.set(data.user, {
            matches: false,
            isBanned: false
        })
        return false
    };

    const matches    = sender.userToken == data.user.token;
    
    if (matches && sender.roles.includes("banned")) {
        ValidationStore.set(data.user, {
            matches,
            isBanned: true
        })
        return false
    };

    ValidationStore.set(data.user, {
        matches,
        isBanned: false
    })

    return matches
}

export async function ValidateAuthenticityAdmin(data: bodyData): Promise<boolean> {
    if (data.user.name == "" || data.user.token == "") return false;
    const senderMeta = await getStore(Users, Caches.userName, { userName: data.user.name });
    const sender     = await senderMeta.data;

    // console.log(`passed data:`, data, '\n\n\n', `processed data:`, senderMeta)

    if (senderMeta.status == "failed") return false;

    const matches    = sender.userToken == data.user.token;
    
    if (matches && sender.roles.includes("banned")) return false;
    if (matches && !sender.roles.includes("admin")) return false;

    return matches
}

export const getUser = async (options) => (await getStore(Users, Caches.userName, options)).data


