"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const chalk_1 = __importDefault(require("chalk"));
const express_1 = __importDefault(require("express"));
const serve_static_1 = __importDefault(require("serve-static"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const ws_1 = require("./client/ws");
const auth_1 = require("./auth");
const i18n_1 = require("./i18n/i18n");
const session_1 = require("./session");
const upload_1 = require("./upload");
const fs_1 = require("fs");
const compression_1 = __importDefault(require("compression"));
const download_1 = require("./download");
exports.start = async (config) => {
    const dev = process.env.NODE_ENV === 'development';
    const app = express_1.default();
    let server;
    if (config.ssl) {
        try {
            const cert = fs_1.readFileSync(config.ssl_certificate);
            const key = fs_1.readFileSync(config.ssl_certificate_key);
            server = https_1.default.createServer({ key, cert }, app);
        }
        catch (e) {
            console.error(chalk_1.default.red("Error loading ssl cert and key:"), chalk_1.default.yellow(e.message));
            return process.exit(1);
        }
    }
    else {
        server = http_1.default.createServer({}, app);
    }
    const sess = session_1.session(config);
    ws_1.ws(server, config, sess);
    dev && app.use(morgan_1.default("dev"));
    app.use(helmet_1.default());
    app.use(compression_1.default());
    app.use(i18n_1.i18n(config));
    const template = fs_1.readFileSync(path_1.default.resolve(__dirname, "../client/template.html"), "utf8");
    app.get("/", (req, res) => {
        res.header("content-type", "text/html");
        res.header("vary", "accept-language");
        const vars = {
            lang: req.lang,
            locale: req.locale,
        };
        const json = (vars) => `JSON.parse(${JSON.stringify(JSON.stringify(vars)).replace(/<\//g, "<\\/")})`;
        const scripts = `<script>__RAVEN__=${json(vars)};</script>`;
        const html = template
            .replace("%raven.scripts%", scripts)
            .replace("%raven.lang%", req.lang);
        res.end(html);
    });
    app.use(serve_static_1.default(path_1.default.resolve(__dirname, "../client/public")));
    app.use(body_parser_1.default.json());
    app.use(sess);
    app.use(auth_1.auth(config));
    app.post("/upload", await upload_1.upload(config));
    app.get("/download/:mailbox/:message/:attachment", await download_1.download(config));
    server.listen(config.port, () => {
        console.log(`> http${config.ssl ? "s" : ""} server listening on port ${chalk_1.default.yellow(config.port)}`);
    });
};
