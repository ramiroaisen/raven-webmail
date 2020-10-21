import Session from "express-session";
import MongoSession from "connect-mongodb-session";
import { NextFunction, Request, Response } from "express";
import { Client } from "./client/client";
import {Config} from "./config";

const Store = MongoSession(Session);

export type User = {}

declare module "express" {
  interface Request {
    user?: User | null
  }
}

export const session = (config: Config) => {
  const mid = Session({
    secret: config.secret_token,
    saveUninitialized: false,
    resave: true,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    store: new Store({
      uri: config.mongodb_url,
      collection: "sessions"
    })
  });

  return (req: Request, res: Response, next: NextFunction) => {
    mid(req, res, async (e) => {
      if (e)
        return next(e);

      if (req.session!.accessToken) {
        
        const client = new Client({
          host: config.wildduck_api_url,
          accessToken: req.session!.accessToken,
          apiToken: config.wildduck_api_token
        });

        try {
          req.user = await client.get("/users/me");
          next();

        } catch(e){
          // ignore invalidated access tokens
          // next(e)
          next();
        }
      } else {
        next();
      }
    })
  }
}
