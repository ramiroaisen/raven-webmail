"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const client_1 = require("./client/client");
const Store = connect_mongodb_session_1.default(express_session_1.default);
exports.session = (config) => {
    const mid = express_session_1.default({
        secret: config.secret_token,
        saveUninitialized: false,
        resave: true,
        cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
        store: new Store({
            uri: config.mongodb_url,
            collection: "sessions"
        })
    });
    return (req, res, next) => {
        mid(req, res, async (e) => {
            if (e)
                return next(e);
            if (req.session.accessToken) {
                const client = new client_1.Client({
                    host: config.wildduck_api_url,
                    accessToken: req.session.accessToken,
                    apiToken: config.wildduck_api_token
                });
                try {
                    req.user = await client.get("/users/me");
                    next();
                }
                catch (e) {
                    next(e);
                }
            }
            else {
                next();
            }
        });
    };
};
