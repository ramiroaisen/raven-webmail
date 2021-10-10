"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = exports.handler = exports.pageHandler = exports.validate = void 0;
const http_status_codes_1 = require("http-status-codes");
const env_1 = require("./env");
const validate = (fn) => {
    try {
        return fn();
    }
    catch (e) {
        throw new ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, String((e === null || e === void 0 ? void 0 : e.message) || "Bad request"));
    }
};
exports.validate = validate;
const pageHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === http_status_codes_1.StatusCodes.FORBIDDEN) {
                    return res.json({
                        status: 302,
                        redirect: "/login"
                    });
                }
                else {
                    return res.status(e.status).json({
                        status: e.status,
                        error: e.message,
                    });
                }
            }
            const status = Number(e === null || e === void 0 ? void 0 : e.status) || 500;
            const message = env_1.DISPLAY_ERRORS ? String(e === null || e === void 0 ? void 0 : e.message) : "Internal server error";
            return res.status(status).json({
                status,
                error: message,
            });
        }
    };
};
exports.pageHandler = pageHandler;
const handler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (e) {
            if (e instanceof ApiError) {
                return res
                    .status(e.status)
                    .json({
                    error: {
                        status: e.status,
                        message: e.message
                    }
                });
            }
            const status = Number(e === null || e === void 0 ? void 0 : e.status) || 500;
            const message = env_1.DISPLAY_ERRORS ? String(e === null || e === void 0 ? void 0 : e.message) : "Internal server error";
            return res
                .status(status)
                .json({ error: { status, message } });
        }
    };
};
exports.handler = handler;
class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=util.js.map