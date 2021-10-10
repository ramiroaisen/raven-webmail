"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.session = void 0;
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const MongoStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
const session = (config) => (0, express_session_1.default)({
    name: "raven.sid",
    secret: config.secret_token,
    saveUninitialized: false,
    resave: true,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    store: new MongoStore({
        uri: config.mongodb_url,
        collection: "sessions-v2"
    })
});
exports.session = session;
//# sourceMappingURL=session.js.map