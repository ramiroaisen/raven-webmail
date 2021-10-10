"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = exports.authenticate = exports.put = exports.post = exports.del = exports.get = exports.url = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const util_1 = require("./util");
const http_status_codes_1 = require("http-status-codes");
const env_1 = require("./env");
const url = (u) => {
    return __RAVEN__.config.wildduck_api_url.replace(/\/$/, "") + u;
};
exports.url = url;
const Requester = (method) => {
    return async (u, accessToken, body) => {
        const init = { method };
        if (body != null) {
            init.headers = {
                "x-access-token": accessToken,
                "content-type": "application/json",
            };
            init.body = JSON.stringify(body);
        }
        else {
            init.headers = { "x-access-token": accessToken };
        }
        const res = await (0, node_fetch_1.default)((0, exports.url)(u), init).catch(e => {
            throw new util_1.ApiError(http_status_codes_1.StatusCodes.BAD_GATEWAY, env_1.DISPLAY_ERRORS ? String(e === null || e === void 0 ? void 0 : e.message) : "Bad Gateway");
        });
        if (res.status === http_status_codes_1.StatusCodes.FORBIDDEN) {
            throw new util_1.ApiError(http_status_codes_1.StatusCodes.FORBIDDEN, "The session has expired");
        }
        const json = await res.json().catch(e => {
            throw new util_1.ApiError(http_status_codes_1.StatusCodes.BAD_GATEWAY, "Invalid JSON from backend");
        });
        if (json === null || json === void 0 ? void 0 : json.error) {
            throw new util_1.ApiError(res.ok ? http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR : res.status, String(json.error));
        }
        return json;
    };
};
exports.get = Requester("GET");
exports.del = Requester("DELETE");
exports.post = Requester("POST");
exports.put = Requester("PUT");
const authenticate = async (username, password) => {
    const res = await (0, node_fetch_1.default)((0, exports.url)("/authenticate"), {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-access-token": __RAVEN__.config.wildduck_api_token,
        },
        body: JSON.stringify({
            token: true,
            scope: "master",
            username,
            password,
        })
    }).catch(e => {
        throw new util_1.ApiError(http_status_codes_1.StatusCodes.BAD_GATEWAY, env_1.DISPLAY_ERRORS ? String(e === null || e === void 0 ? void 0 : e.message) : "Bad Gateway");
    });
    const json = await res.json().catch(e => {
        throw new util_1.ApiError(http_status_codes_1.StatusCodes.BAD_GATEWAY, "Invalid JSON body from backend");
    });
    if (json === null || json === void 0 ? void 0 : json.error) {
        throw new util_1.ApiError(res.ok ? http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR : res.status, String(json.error));
    }
    return json;
};
exports.authenticate = authenticate;
const watch = async (userId, accessToken) => {
    const res = await (0, node_fetch_1.default)((0, exports.url)(`/users/${userId}/updates`), {
        headers: { "x-access-token": accessToken },
    }).catch(e => {
        throw new util_1.ApiError(502, env_1.DISPLAY_ERRORS ? String(e === null || e === void 0 ? void 0 : e.message) : "Bad Gateway");
    });
    if (res.ok) {
        return res.body;
    }
    if (res.status === http_status_codes_1.StatusCodes.FORBIDDEN) {
        throw new util_1.ApiError(http_status_codes_1.StatusCodes.FORBIDDEN, "Session has expired");
    }
    const json = await res.json().catch(() => {
        throw new util_1.ApiError(502, "Invalid JSON body from backend");
    });
    throw new util_1.ApiError(res.status, String((json === null || json === void 0 ? void 0 : json.error) || "JSON error without message"));
};
exports.watch = watch;
//# sourceMappingURL=client.js.map