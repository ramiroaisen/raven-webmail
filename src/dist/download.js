"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
exports.download = async (config) => {
    const mod = (config.wildduck_api_url.startsWith("https") ? require("https") : require("http"));
    const agent = new mod.Agent({ keepAlive: true });
    return async (req, res) => {
        const accessToken = req.session.accessToken;
        if (!accessToken) {
            return res.send("You are not logged in :(");
        }
        const url = config.wildduck_api_url + `/users/me/mailboxes/${req.params.mailbox}/messages/${req.params.message}/attachments/${req.params.attachment}`;
        node_fetch_1.default(url, {
            agent,
            headers: {
                "x-access-token": accessToken,
                "accept-encoding": ""
            }
        }).then(inc => {
            res.writeHead(inc.status, inc.statusText, {
                ...Object.fromEntries(inc.headers.entries()),
                "content-disposition": `attachment; filename=${JSON.stringify(req.query.filename || "unnamed")}`
            });
            inc.body.pipe(res);
        }).catch(err => {
            try {
                res.writeHead(500, { "content-type": "text/plain" });
                res.write("500 Internal server error\n" + err.message);
                res.end();
            }
            catch (e) { }
        });
    };
};
