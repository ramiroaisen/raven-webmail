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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sveltekitDevProxy = void 0;
const express_1 = require("express");
const node_fetch_1 = __importStar(require("node-fetch"));
const sveltekitDevProxy = (port) => {
    const proxy = (0, express_1.Router)();
    proxy.use(async (req, res, next) => {
        try {
            const reqHeaders = new node_fetch_1.Headers();
            for (const [key, value] of Object.entries(req.headers)) {
                if (typeof value === "string") {
                    reqHeaders.append(key, value);
                }
                else if (value) {
                    for (const item of value) {
                        reqHeaders.append(key, item);
                    }
                }
            }
            let back;
            const url = `http://127.0.0.1:${port}${req.url}`;
            if (req.method === "GET" || req.method === "HEAD" || req.method === "DELETE") {
                back = await (0, node_fetch_1.default)(url, {
                    method: req.method,
                    headers: reqHeaders
                });
            }
            else {
                back = await (0, node_fetch_1.default)(url, {
                    method: req.method,
                    headers: reqHeaders,
                    body: req
                });
            }
            const resHeaders = {};
            for (const [key, value] of back.headers) {
                if (value.includes(",")) {
                    resHeaders[key] = value.split(",");
                }
                else {
                    resHeaders[key] = value;
                }
            }
            res.writeHead(back.status, resHeaders);
            back.body.pipe(res);
        }
        catch (e) {
            next(e);
        }
    });
    return proxy;
};
exports.sveltekitDevProxy = sveltekitDevProxy;
//# sourceMappingURL=sveltekit-dev-proxy.js.map