"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const express_1 = __importDefault(require("express"));
const api_1 = require("./api");
const session_1 = require("./session");
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const fs_1 = require("fs");
const chalk_1 = __importDefault(require("chalk"));
const env_1 = require("./env");
const sveltekit_dev_proxy_1 = require("./sveltekit-dev-proxy");
const compression_1 = __importDefault(require("compression"));
const createServer = (config, app) => {
    if (config.ssl) {
        let cert;
        let key;
        try {
            cert = (0, fs_1.readFileSync)(config.ssl_certificate);
            key = (0, fs_1.readFileSync)(config.ssl_certificate_key);
        }
        catch (e) {
            console.warn(`Error loading ssl key and cert: ${chalk_1.default.yellow(e.message)}`);
            process.exit(1);
        }
        return https_1.default.createServer({
            key,
            cert,
        }, app);
    }
    else {
        return http_1.default.createServer(app);
    }
};
const start = async (config) => {
    // @ts-ignore
    // We have to do this this way for sveltekit server
    global.__RAVEN__ = { config };
    const app = (0, express_1.default)();
    config.compression && app.use((0, compression_1.default)());
    app.use("/api", (0, session_1.session)(config), (0, api_1.api)(config));
    if (env_1.SVELTEKIT_DEV) {
        app.use((0, sveltekit_dev_proxy_1.sveltekitDevProxy)(env_1.SVELTEKIT_PORT));
    }
    else {
        const kit = await __RAVEN_IMPORT_SVELTEKIT__();
        app.use(kit.assetsMiddleware);
        app.use(kit.kitMiddleware);
    }
    const server = createServer(config, app);
    server.listen(config.port);
    console.log(`> ${chalk_1.default.yellow(config.ssl ? "https" : "http")} server listening at port ${chalk_1.default.yellow(config.port)}`);
};
exports.start = start;
//# sourceMappingURL=server.js.map