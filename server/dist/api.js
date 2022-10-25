"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.userId = exports.token = exports.api = void 0;
const express_1 = require("express");
const typescript_is_1 = require("typescript-is");
const util_1 = require("./util");
const client_1 = require("./client");
const body_parser_1 = require("body-parser");
const events_1 = require("./events");
const http_status_codes_1 = require("http-status-codes");
const node_fetch_1 = __importDefault(require("node-fetch"));
const env_1 = require("./env");
const qs_1 = __importDefault(require("qs"));
const i18n = __importStar(require("./i18n/i18n"));
const metadata_1 = require("./metadata");
const api = (config) => {
    const api = (0, express_1.Router)();
    api.use((0, body_parser_1.json)());
    api.use(i18n.middleware(config));
    api.post("/login", (0, util_1.handler)(async (req, res) => {
        const { username, password } = (0, util_1.validate)(() => (0, typescript_is_1.assertType)(req.body, object => { var path = ["$"]; function _string(object) { ; if (typeof object !== "string")
            return { message: "validation failed at " + path.join(".") + ": expected a string", path: path.slice(), reason: { type: "string" } };
        else
            return null; } function _3337(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
            return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; {
            if ("username" in object) {
                path.push("username");
                var error = _string(object["username"]);
                path.pop();
                if (error)
                    return error;
            }
            else
                return { message: "validation failed at " + path.join(".") + ": expected 'username' in object", path: path.slice(), reason: { type: "missing-property", property: "username" } };
        } {
            if ("password" in object) {
                path.push("password");
                var error = _string(object["password"]);
                path.pop();
                if (error)
                    return error;
            }
            else
                return { message: "validation failed at " + path.join(".") + ": expected 'password' in object", path: path.slice(), reason: { type: "missing-property", property: "password" } };
        } return null; } var error = _3337(object); return error; }));
        const v = await (0, client_1.authenticate)(username, password);
        req.session.authentication = v;
        req.session.save(() => {
            res.json({});
            events_1.Auth.dispatch({ sid: req.sessionID, username: v.username });
        });
    }));
    api.post("/logout", (0, util_1.handler)(async (req, res) => {
        req.session.authentication = null;
        req.session.save(() => {
            res.json({});
            events_1.Auth.dispatch({ sid: req.sessionID, username: null });
        });
    }));
    api.get("/auth", (0, util_1.handler)(async (req, res) => {
        var _a;
        res.type("text/event-stream");
        const send = (data) => {
            try {
                res.write("data: " + JSON.stringify(data) + "\n\n", () => { });
            }
            catch (e) { }
        };
        send({ username: ((_a = req.session.authentication) === null || _a === void 0 ? void 0 : _a.username) || null });
        const off = events_1.Auth.on(event => {
            if (event.sid === req.sessionID) {
                send({ username: event.username });
            }
        });
        let keepalive = setInterval(() => {
            try {
                res.write(": keepalive\n\n", () => { });
            }
            catch (e) { }
        }, 5000);
        req.on("close", () => {
            clearInterval(keepalive);
            off();
        });
    }));
    api.get("/updates", (0, util_1.handler)(async (req, res) => {
        const stream = await (0, client_1.watch)((0, exports.userId)(req), (0, exports.token)(req));
        res.type("text/event-stream");
        stream.pipe(res);
    }));
    api.put("/me", (0, util_1.handler)(async (req, res) => {
        const json = await (0, client_1.put)(`/users/${(0, exports.userId)(req)}`, (0, exports.token)(req), req.body);
        res.json(json);
    }));
    api.put("/signature", (0, util_1.handler)(async (req, res) => {
        const { html } = (0, typescript_is_1.assertType)(req.body, object => { var path = ["$"]; function _string(object) { ; if (typeof object !== "string")
            return { message: "validation failed at " + path.join(".") + ": expected a string", path: path.slice(), reason: { type: "string" } };
        else
            return null; } function _3831(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
            return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; {
            if ("html" in object) {
                path.push("html");
                var error = _string(object["html"]);
                path.pop();
                if (error)
                    return error;
            }
            else
                return { message: "validation failed at " + path.join(".") + ": expected 'html' in object", path: path.slice(), reason: { type: "missing-property", property: "html" } };
        } return null; } var error = _3831(object); return error; });
        const body = { metaData: { [metadata_1.RAVEN_SIGNATURE_META_KEY]: html } };
        const json = await (0, client_1.put)(`/users/${(0, exports.userId)(req)}`, (0, exports.token)(req), body);
        res.json(json);
    }));
    api.get("/mailboxes", (0, util_1.handler)(async (req, res) => {
        const json = await (0, client_1.get)(`/users/${(0, exports.userId)(req)}/mailboxes?counters=true`, (0, exports.token)(req));
        res.json(json);
    }));
    api.post("/mailboxes", (0, util_1.handler)(async (req, res) => {
        var _a, _b;
        const path = String(((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.path) === null || _b === void 0 ? void 0 : _b.trim()) || "");
        if (!path)
            throw new util_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, "'path' is required");
        const json = await (0, client_1.post)(`/users/${(0, exports.userId)(req)}/mailboxes`, (0, exports.token)(req), { path });
        res.json(json);
    }));
    api.delete("/mailboxes/:mailbox", (0, util_1.handler)(async (req, res) => {
        await (0, client_1.del)(`/users/${(0, exports.userId)(req)}/mailboxes/${req.params.mailbox}`, (0, exports.token)(req));
        res.json({});
    }));
    api.put("/mailboxes/:mailbox", (0, util_1.handler)(async (req, res) => {
        const json = await (0, client_1.put)(`/users/${(0, exports.userId)(req)}/mailboxes/${req.params.mailbox}`, (0, exports.token)(req), req.body);
        res.json(json);
    }));
    api.get("/mailboxes/:mailbox/messages", (0, util_1.handler)(async (req, res) => {
        const body = await (0, client_1.get)(`/users/${(0, exports.userId)(req)}/mailboxes/${req.params.mailbox}/messages${(0, exports.query)(req)}`, (0, exports.token)(req));
        res.json(body);
    }));
    api.put("/mailboxes/:mailbox/messages", (0, util_1.handler)(async (req, res) => {
        const json = await (0, client_1.put)(`/users/${(0, exports.userId)(req)}/mailboxes/${req.params.mailbox}/messages`, (0, exports.token)(req), req.body);
        res.json(json);
    }));
    api.post("/mailboxes/:mailbox/messages", (0, util_1.handler)(async (req, res) => {
        const json = await (0, client_1.post)(`/users/${(0, exports.userId)(req)}/mailboxes/${req.params.mailbox}/messages`, (0, exports.token)(req), req.body);
        res.json(json);
    }));
    api.delete("/mailboxes/:mailbox/messages", (0, util_1.handler)(async (req, res) => {
        await (0, client_1.del)(`/users/${(0, exports.userId)(req)}/mailboxes/${req.params.mailbox}/messages`, (0, exports.token)(req));
        res.json({});
    }));
    api.get("/mailboxes/:mailbox/messages/:message", (0, util_1.handler)(async (req, res) => {
        const body = await (0, client_1.get)(`/users/${(0, exports.userId)(req)}/mailboxes/${req.params.mailbox}/messages/${req.params.message}`, (0, exports.token)(req));
        res.json(body);
    }));
    api.delete("/mailboxes/:mailbox/messages/:message", (0, util_1.handler)(async (req, res) => {
        const body = await (0, client_1.del)(`/users/${(0, exports.userId)(req)}/mailboxes/${req.params.mailbox}/messages/${req.params.message}`, (0, exports.token)(req));
        res.json(body);
    }));
    api.put("/mailboxes/:mailbox/messages/:message/flag", (0, util_1.handler)(async (req, res) => {
        const value = !!req.body.value;
        const body = await (0, client_1.put)(`/users/${(0, exports.userId)(req)}/mailboxes/${req.params.mailbox}/messages`, (0, exports.token)(req), {
            message: req.params.message,
            flagged: value,
        });
        res.json(body);
    }));
    api.post("/mailboxes/:mailbox/messages/:message/submit", (0, util_1.handler)(async (req, res) => {
        const body = await (0, client_1.post)(`/users/${(0, exports.userId)(req)}/mailboxes/${req.params.mailbox}/messages/${req.params.message}/submit`, (0, exports.token)(req), req.body);
        res.json(body);
    }));
    api.get("/mailboxes/:mailbox/messages/:message/attachments/:attachment", (0, util_1.handler)(async (req, res) => {
        const back = await (0, node_fetch_1.default)((0, client_1.url)(`/users/${(0, exports.userId)(req)}/mailboxes/${req.params.mailbox}/messages/${req.params.message}/attachments/${req.params.attachment}`), {
            headers: { "x-access-token": (0, exports.token)(req) }
        }).catch(e => {
            throw new util_1.ApiError(502, env_1.DISPLAY_ERRORS ? String(e === null || e === void 0 ? void 0 : e.message) : "Bad Gateway");
        });
        if (back.ok) {
            const contentType = back.headers.get("content-type");
            const contentLength = back.headers.get("content-length");
            if (contentType)
                res.setHeader("content-type", contentType);
            if (contentLength)
                res.setHeader("content-length", contentLength);
            back.body.pipe(res);
        }
        else {
            res.status(back.status);
            res.end("Cannot GET attachment");
        }
    }));
    api.get("/search", (0, util_1.pageHandler)(async (req, res) => {
        const query = Object.assign(Object.assign({}, req.query), { limit: req.query.limit || "50" });
        const json = await (0, client_1.get)(`/users/${(0, exports.userId)(req)}/search?${qs_1.default.stringify(query)}`, (0, exports.token)(req));
        res.json(json);
    }));
    api.post("/storage", (0, util_1.handler)(async (req, res) => {
        const contentType = String(req.headers["content-type"] || "");
        const contentLength = String(req.headers["content-length"] || "");
        let headers = {
            "x-access-token": (0, exports.token)(req),
        };
        contentType && (headers["content-type"] = contentType);
        contentLength && (headers["content-length"] = contentLength);
        const back = await (0, node_fetch_1.default)((0, client_1.url)(`/users/${(0, exports.userId)(req)}/storage${(0, exports.query)(req)}`), {
            method: "POST",
            headers: headers,
            body: req,
        }).catch(e => {
            throw new util_1.ApiError(502, env_1.DISPLAY_ERRORS ? String(e === null || e === void 0 ? void 0 : e.message) : "Bad Gateway");
        });
        const json = await back.json().catch(e => {
            throw new util_1.ApiError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Invalid JSON from backend");
        });
        if (json === null || json === void 0 ? void 0 : json.error) {
            throw new util_1.ApiError(back.ok ? 500 : back.status, String(json.error));
        }
        res.status(back.status).json(json);
    }));
    const pages = (0, express_1.Router)();
    api.use("/pages", pages);
    pages.get("/layout", (0, util_1.pageHandler)(async (req, res) => {
        const [user, boxes] = await Promise.all([
            (0, client_1.get)(`/users/${(0, exports.userId)(req)}`, (0, exports.token)(req)),
            (0, client_1.get)(`/users/${(0, exports.userId)(req)}/mailboxes?counters=true`, (0, exports.token)(req))
        ]);
        return res.json({
            props: {
                user,
                mailboxes: boxes.results,
                username: req.session.authentication.username
            },
            stuff: {
                user,
                mailboxes: boxes.results,
            }
        });
    }));
    pages.get("/me", (0, util_1.pageHandler)(async (req, res) => {
        const user = await (0, client_1.get)(`/users/${(0, exports.userId)(req)}`, (0, exports.token)(req));
        res.json({ props: { user } });
    }));
    pages.get("/signature", (0, util_1.pageHandler)(async (req, res) => {
        const user = await (0, client_1.get)(`/users/${(0, exports.userId)(req)}`, (0, exports.token)(req));
        res.json({ props: { user } });
    }));
    pages.get("/search", (0, util_1.pageHandler)(async (req, res) => {
        const query = Object.assign(Object.assign({}, req.query), { limit: req.query.limit || "50" });
        const props = await (0, client_1.get)(`/users/${(0, exports.userId)(req)}/search?${qs_1.default.stringify(query)}`, (0, exports.token)(req));
        res.json({ props });
    }));
    pages.get("/mailbox/:mailbox", (0, util_1.pageHandler)(async (req, res) => {
        const { limit = "50" } = req.query;
        const [mailbox, messages] = await Promise.all([
            (0, client_1.get)(`/users/${(0, exports.userId)(req)}/mailboxes/${req.params.mailbox}`, (0, exports.token)(req)),
            (0, client_1.get)(`/users/${(0, exports.userId)(req)}/mailboxes/${req.params.mailbox}/messages?${qs_1.default.stringify({ limit })}`, (0, exports.token)(req))
        ]);
        res.json({ props: { mailbox, messages } });
    }));
    pages.get("/mailbox/:mailbox/message/:message", (0, util_1.pageHandler)(async (req, res) => {
        const [mailbox, message] = await Promise.all([
            (0, client_1.get)(`/users/${(0, exports.userId)(req)}/mailboxes/${req.params.mailbox}`, (0, exports.token)(req)),
            (0, client_1.get)(`/users/${(0, exports.userId)(req)}/mailboxes/${req.params.mailbox}/messages/${req.params.message}?markAsSeen=true`, (0, exports.token)(req))
        ]);
        res.json({ props: { message, mailbox } });
    }));
    return api;
};
exports.api = api;
const token = (req) => {
    if (req.session.authentication == null) {
        throw new util_1.ApiError(http_status_codes_1.StatusCodes.FORBIDDEN, "Forbidden");
    }
    return req.session.authentication.token;
};
exports.token = token;
const userId = (req) => {
    if (req.session.authentication == null) {
        throw new util_1.ApiError(http_status_codes_1.StatusCodes.FORBIDDEN, "Forbidden");
    }
    return req.session.authentication.id;
};
exports.userId = userId;
const query = (req) => {
    const i = req.url.indexOf("?");
    if (i === -1) {
        return "";
    }
    else {
        return req.url.slice(i);
    }
};
exports.query = query;
//# sourceMappingURL=api.js.map