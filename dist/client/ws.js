"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const client_1 = require("./client");
const typescript_is_1 = require("typescript-is");
let _uid = 0;
const uid = () => ++_uid;
exports.ws = (srv, config, session) => {
    srv.on("upgrade", (req, socket, head) => {
        session(req, {}, () => {
            server.handleUpgrade(req, socket, head, (ws) => {
                server.emit("connection", ws, req, req.session);
            });
        });
    });
    const server = new ws_1.default.Server({ noServer: true });
    server.on("connection", (ws, req, session) => {
        const client = new client_1.Client({
            host: config.wildduck_api_url,
            accessToken: session.accessToken,
            apiToken: config.wildduck_api_token
        });
        const send = (msg) => {
            ws.send(JSON.stringify(msg));
        };
        if (session.accessToken) {
            client.get("/users/me").then(user => {
                ws.send(JSON.stringify({ user }));
            }).catch(e => {
                ws.send(JSON.stringify({ user: null }));
            });
        }
        else {
            ws.send(JSON.stringify({ user: null }));
        }
        ws.on("message", async (m) => {
            try {
                const json = JSON.parse(m.toString());
                const msg = typescript_is_1.assertType(json, object => { var path = ["json"]; function _2634(object) { ; if (object !== "login")
                    return { message: "validation failed at " + path.join(".") + ": expected string 'login'", path: path.slice(), reason: { type: "string-literal", value: "login" } };
                else
                    return null; } function _string(object) { ; if (typeof object !== "string")
                    return { message: "validation failed at " + path.join(".") + ": expected a string", path: path.slice(), reason: { type: "string" } };
                else
                    return null; } function _number(object) { ; if (typeof object !== "number")
                    return { message: "validation failed at " + path.join(".") + ": expected a number", path: path.slice(), reason: { type: "number" } };
                else
                    return null; } function _2624(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
                    return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; {
                    if ("type" in object) {
                        path.push("type");
                        var error = _2634(object["type"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'type' in object", path: path.slice(), reason: { type: "missing-property", property: "type" } };
                } {
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
                } {
                    if ("id" in object) {
                        path.push("id");
                        var error = _number(object["id"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'id' in object", path: path.slice(), reason: { type: "missing-property", property: "id" } };
                } return null; } function _1027(object) { ; if (object !== "get")
                    return { message: "validation failed at " + path.join(".") + ": expected string 'get'", path: path.slice(), reason: { type: "string-literal", value: "get" } };
                else
                    return null; } function _2626(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
                    return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; {
                    if ("type" in object) {
                        path.push("type");
                        var error = _1027(object["type"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'type' in object", path: path.slice(), reason: { type: "missing-property", property: "type" } };
                } {
                    if ("path" in object) {
                        path.push("path");
                        var error = _string(object["path"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'path' in object", path: path.slice(), reason: { type: "missing-property", property: "path" } };
                } {
                    if ("id" in object) {
                        path.push("id");
                        var error = _number(object["id"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'id' in object", path: path.slice(), reason: { type: "missing-property", property: "id" } };
                } return null; } function _2107(object) { ; if (object !== "post")
                    return { message: "validation failed at " + path.join(".") + ": expected string 'post'", path: path.slice(), reason: { type: "string-literal", value: "post" } };
                else
                    return null; } function _any() { return null; } function _2636(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
                    return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; for (const key of Object.keys(object)) {
                    path.push(key);
                    var error = _any(object[key]);
                    path.pop();
                    if (error)
                        return error;
                } return null; } function _2627(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
                    return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; {
                    if ("type" in object) {
                        path.push("type");
                        var error = _2107(object["type"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'type' in object", path: path.slice(), reason: { type: "missing-property", property: "type" } };
                } {
                    if ("path" in object) {
                        path.push("path");
                        var error = _string(object["path"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'path' in object", path: path.slice(), reason: { type: "missing-property", property: "path" } };
                } {
                    if ("body" in object) {
                        path.push("body");
                        var error = _2636(object["body"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'body' in object", path: path.slice(), reason: { type: "missing-property", property: "body" } };
                } {
                    if ("id" in object) {
                        path.push("id");
                        var error = _number(object["id"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'id' in object", path: path.slice(), reason: { type: "missing-property", property: "id" } };
                } return null; } function _2638(object) { ; if (object !== "put")
                    return { message: "validation failed at " + path.join(".") + ": expected string 'put'", path: path.slice(), reason: { type: "string-literal", value: "put" } };
                else
                    return null; } function _2628(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
                    return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; {
                    if ("type" in object) {
                        path.push("type");
                        var error = _2638(object["type"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'type' in object", path: path.slice(), reason: { type: "missing-property", property: "type" } };
                } {
                    if ("path" in object) {
                        path.push("path");
                        var error = _string(object["path"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'path' in object", path: path.slice(), reason: { type: "missing-property", property: "path" } };
                } {
                    if ("body" in object) {
                        path.push("body");
                        var error = _2636(object["body"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'body' in object", path: path.slice(), reason: { type: "missing-property", property: "body" } };
                } {
                    if ("id" in object) {
                        path.push("id");
                        var error = _number(object["id"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'id' in object", path: path.slice(), reason: { type: "missing-property", property: "id" } };
                } return null; } function _2640(object) { ; if (object !== "del")
                    return { message: "validation failed at " + path.join(".") + ": expected string 'del'", path: path.slice(), reason: { type: "string-literal", value: "del" } };
                else
                    return null; } function _2629(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
                    return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; {
                    if ("type" in object) {
                        path.push("type");
                        var error = _2640(object["type"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'type' in object", path: path.slice(), reason: { type: "missing-property", property: "type" } };
                } {
                    if ("path" in object) {
                        path.push("path");
                        var error = _string(object["path"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'path' in object", path: path.slice(), reason: { type: "missing-property", property: "path" } };
                } {
                    if ("id" in object) {
                        path.push("id");
                        var error = _number(object["id"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'id' in object", path: path.slice(), reason: { type: "missing-property", property: "id" } };
                } return null; } function _2642(object) { ; if (object !== "ping")
                    return { message: "validation failed at " + path.join(".") + ": expected string 'ping'", path: path.slice(), reason: { type: "string-literal", value: "ping" } };
                else
                    return null; } function _2630(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
                    return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; {
                    if ("type" in object) {
                        path.push("type");
                        var error = _2642(object["type"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'type' in object", path: path.slice(), reason: { type: "missing-property", property: "type" } };
                } {
                    if ("id" in object) {
                        path.push("id");
                        var error = _number(object["id"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'id' in object", path: path.slice(), reason: { type: "missing-property", property: "id" } };
                } return null; } function _2644(object) { ; if (object !== "pong")
                    return { message: "validation failed at " + path.join(".") + ": expected string 'pong'", path: path.slice(), reason: { type: "string-literal", value: "pong" } };
                else
                    return null; } function _2631(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
                    return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; {
                    if ("type" in object) {
                        path.push("type");
                        var error = _2644(object["type"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'type' in object", path: path.slice(), reason: { type: "missing-property", property: "type" } };
                } {
                    if ("replyTo" in object) {
                        path.push("replyTo");
                        var error = _number(object["replyTo"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'replyTo' in object", path: path.slice(), reason: { type: "missing-property", property: "replyTo" } };
                } {
                    if ("id" in object) {
                        path.push("id");
                        var error = _number(object["id"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'id' in object", path: path.slice(), reason: { type: "missing-property", property: "id" } };
                } return null; } function _2646(object) { ; if (object !== "watch")
                    return { message: "validation failed at " + path.join(".") + ": expected string 'watch'", path: path.slice(), reason: { type: "string-literal", value: "watch" } };
                else
                    return null; } function _2632(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
                    return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; {
                    if ("type" in object) {
                        path.push("type");
                        var error = _2646(object["type"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'type' in object", path: path.slice(), reason: { type: "missing-property", property: "type" } };
                } {
                    if ("callbackId" in object) {
                        path.push("callbackId");
                        var error = _number(object["callbackId"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'callbackId' in object", path: path.slice(), reason: { type: "missing-property", property: "callbackId" } };
                } {
                    if ("id" in object) {
                        path.push("id");
                        var error = _number(object["id"]);
                        path.pop();
                        if (error)
                            return error;
                    }
                    else
                        return { message: "validation failed at " + path.join(".") + ": expected 'id' in object", path: path.slice(), reason: { type: "missing-property", property: "id" } };
                } return null; } function su__2624__2626__2627__2628__2629__2630__2631__2632_eu(object) { var conditions = [_2624, _2626, _2627, _2628, _2629, _2630, _2631, _2632]; for (const condition of conditions) {
                    var error = condition(object);
                    if (!error)
                        return null;
                } return { message: "validation failed at " + path.join(".") + ": there are no valid alternatives", path: path.slice(), reason: { type: "union" } }; } var error = su__2624__2626__2627__2628__2629__2630__2631__2632_eu(object); return error; });
                try {
                    switch (msg.type) {
                        case "login":
                            const token = await client.login(msg.username, msg.password);
                            const user = await client.get("/users/me");
                            session.accessToken = token;
                            send({
                                id: uid(),
                                replyTo: msg.id,
                                type: "resolve",
                                arg: user
                            });
                            break;
                        case "get":
                            send({
                                id: uid(),
                                replyTo: msg.id,
                                type: "resolve",
                                arg: await client.get(msg.path)
                            });
                            break;
                        case "post":
                            send({
                                id: uid(),
                                replyTo: msg.id,
                                type: "resolve",
                                arg: await client.post(msg.path, msg.body)
                            });
                            break;
                        case "put":
                            send({
                                id: uid(),
                                replyTo: msg.id,
                                type: "resolve",
                                arg: await client.put(msg.path, msg.body)
                            });
                            break;
                        case "del":
                            send({
                                id: uid(),
                                replyTo: msg.id,
                                type: "resolve",
                                arg: await client.del(msg.path)
                            });
                            break;
                        case "ping":
                            send({
                                id: uid(),
                                replyTo: msg.id,
                                type: "pong"
                            });
                            break;
                        case "watch":
                            const unwatch = client.watch(data => {
                                send({ id: uid(), type: "call", callId: msg.callbackId, arg: data });
                            });
                            // send watcher id here
                            send({ id: uid(), type: "resolve", replyTo: msg.id, arg: {} });
                            ws.on("close", unwatch);
                            break;
                    }
                }
                catch (e) {
                    send({ id: uid(), replyTo: msg.id, type: "reject", message: e.message });
                    return;
                }
            }
            catch (e) {
                send({ id: uid(), type: "error", message: e.message });
                return;
            }
        });
    });
};
