import ExpressSession from "express-session";
import MongoSession from "connect-mongodb-session";
import { Config } from "./config";

const MongoStore = MongoSession(ExpressSession);

export const session = (config: Config) => ExpressSession({
  name: "raven.sid",
  secret: config.secret_token,
  saveUninitialized: false,
  resave: true,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
  store: new MongoStore({
    uri: config.mongodb_url,
    collection: "sessions-v2"
  })
})