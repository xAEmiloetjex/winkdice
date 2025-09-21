import express, { Express, Request, Response, NextFunction } from 'express';

import {Logger} from "./utils/logger";
import { errorCodePrefixes } from './namespaces';
import { status2CodeNStr } from './utils/httpCodes';

const logger = new Logger("CrashHandler")

export class crashHandler {
    public static mainFunctionExited(err: Error): CrashHandler {
        logger.error(err);
        return {
            message: "main Function exited with error",
            err,
            code: errorCodePrefixes.mainProcess_std + "100"
        }
    }

    public static RedisClientUnkown(err: Error) {
        logger.error(`[RedisClient_std]: Unknown:\n${err}`)
        return {
            message: "UndocumentedError",
            err,
            code: errorCodePrefixes.RedisClient_std + "100"
        }
    }

    static cache = {
        unAssignable: (err: any) => crashHandler.HandleError(err),
        failed: (err: any) => crashHandler.HandleError(err),
    };

    static HandleError(err) {
      logger.error(err);
    }

    public static DB = {
        general: {
            100: (err: Error) => {
                logger.error(`[DB_Std]: Object could not be located!\n${err}`);
                return {
                    message: "UnknownObjectIdentifier",
                    err,
                    code: errorCodePrefixes.DB_std + "100"
                }
            }
        },
        Users: {
            500: (err: Error) => {
                logger.error(`[UserDb_Std]: User not found!\n${err}`);
                return {
                    message: "UnknownUser",
                    err,
                    code: errorCodePrefixes.userDb_std + "100"
                }
            },
            401: (err: Error) => {
                logger.error(`[UserDb_Std]: UserToken does not match UserName!\n${err}`);
                return {
                    message: "UserTokenDoesNotMatchUserName",
                    err,
                    code: errorCodePrefixes.userDb_std + "101"
                }
            },
            402: (err: Error) => {
                logger.error(`[UserDb_Std]: No Permissions for action!\n${err}`);
                return {
                    message: "NoPermissionsForAction",
                    err,
                    code: errorCodePrefixes.userDb_std + "101"
                }
            }
        },
        Chat: {
            200: (err?: Error) => {
                logger.info(`[ChatDb_Std]: Message Stored!\n${err}`);
                return {
                    message: "MessageStored",
                    err,
                    code: errorCodePrefixes.chatDb_std + "200"
                }
            },
            201: (err?: Error) => {
                logger.info(`[ChatDb_Std]: Fetched messages!\n${err}`);
                return {
                    message: "FetchedMessages",
                    err,
                    code: errorCodePrefixes.chatDb_std + "201"
                }
            },
            202: (err?: Error) => {
                logger.info(`[ChatDb_Std]: Fetched chats!\n${err}`);
                return {
                    message: "FetchedChats",
                    err,
                    code: errorCodePrefixes.chatDb_std + "202"
                }
            },
            400: (err: Error) => {
                logger.error(`[ChatDb_Std]: Message content empty!\n${err}`);
                return {
                    message: "MessageContentEmpty",
                    err,
                    code: errorCodePrefixes.chatDb_std + "100"
                }
            },
            500: (err: Error) => {
                logger.error(`[ChatDb_Std]: No messages found!\n${err}`);
                return {
                    message: "NoMessages",
                    err,
                    code: errorCodePrefixes.chatDb_std + "500"
                }
            }
        }
    }

    public static posts = {
        200: (err?: Error) => {
            logger.info(`[Posts]: Successfully created post!\n${err}`);
            return {
                message: "SuccessfullyCreatesPost",
                err,
                code: errorCodePrefixes.posts + "200"
            }
        },
        400: (err: Error) => {
            logger.error(`[Posts]: Title or content empty!\n${err}`);
            return {
                message: "TitleOrContentEmpty",
                err,
                code: errorCodePrefixes.posts + "400"
            }
        },
        500: (err: Error) => {
            logger.error(`[Posts]: Something unknown went wrong while creating the post!\n${err}`);
            return {
                message: "SomethingWentWrongCreatingPost",
                err,
                code: errorCodePrefixes.posts + "500"
            }
        },
    }

    public static Auth = {
        100: (err: Error) => {
            
        }
    }

    public static webResponseError(returnObject: WebResponse, req: Request, res: Response, next?: NextFunction) {
        const http_type = returnObject.code.startsWith(String(errorCodePrefixes.http_std)) ? "http_std" : "http_cust"
        logger.error(`[${http_type}]: ${returnObject.err}`);
        res.status(returnObject.resCode).json(returnObject);
        return returnObject
    }
    public static webStatus(returnObject: WebStatus, req: Request, res: Response, next?: NextFunction) {
        const http_type = returnObject.code.startsWith(String(errorCodePrefixes.http_std)) ? "http_std" : "http_cust"
        logger.info(`[${http_type}]: ${returnObject.err || `${returnObject.code}: ${returnObject.message}`}`);
        res.status(returnObject.resCode).json(returnObject);
        return returnObject
    }

    public static serverStatusCodes = {
        100: (req: Request, res: Response, next?: NextFunction, err?: Error) => this.webStatus({
            resCode: 200,
            message: "Success",
            err,
            code: errorCodePrefixes.http_std + "100"
        }, req, res, next)
    }

    public static webResponseCodes = {
        auto: (
            req: Request,
            res: Response,
            err?: Error | any
          ) => {
            let code = 500;
            if (err !== undefined && err.code !== undefined) code = Number(err.code);
      
            // this.logger.error(err)
      
            const obj = status2CodeNStr(code);
            // console.log(obj)
            return this.webResponseError(
              {
                resCode: obj.code,
                message: obj.status,
                // @ts-ignore
                err: { err, obj, message: err.message },
                code: errorCodePrefixes.http_std + `${obj.code}`,
              },
              req,
              res
            );
        },
        404: (err: Error, req: Request, res: Response, next?: NextFunction) => this.webResponseError({
            resCode: 404,
            message: "Not Found",
            err,
            code: errorCodePrefixes.http_std + "404"
        }, req, res, next)
    }
}

export interface CrashHandler {
    message: string;
    err: Error;
    code: string;
}
export interface WebResponse {
    resCode: number;
    message: string;
    err: Error;
    code: string;
}
export interface WebStatus {
    resCode: number;
    message: string;
    err?: Error;
    code: string;
}