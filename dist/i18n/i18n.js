"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
const express_1 = require("express");
const accept_language_parser_1 = __importDefault(require("accept-language-parser"));
exports.load = () => {
    let locales = Object.create(null);
    const srcDir = path_1.default.join(__dirname, "src");
    const filenames = fs_1.default.readdirSync(srcDir);
    for (const filename of filenames) {
        if (path_1.default.extname(filename) !== ".js") {
            continue;
        }
        const key = filename.split(".")[0];
        const locale = require(path_1.default.join(srcDir, key)).default;
        const { code, region, script } = accept_language_parser_1.default.parse(key)[0];
        const meta = { key, code, region, script };
        try {
            //assertType<Locale>(locale);
            locales[key] = { locale, meta };
        }
        catch (e) {
            console.error(chalk_1.default.red(`Type error in locale ${chalk_1.default.yellow(code)}:` + e.message));
            console.log("Ignoring locale " + chalk_1.default.yellow(code));
        }
    }
    return locales;
};
const checkLocale = (locale) => {
};
exports.i18n = ({ byDefault = "en" } = {}) => {
    const locales = exports.load();
    const router = express_1.Router();
    router.use((req, res, next) => {
        const accept = req.headers["accept-language"];
        if (accept == null) {
            req.lang = byDefault;
            req.locale = locales[byDefault].locale;
            return next();
        }
        const accs = accept_language_parser_1.default.parse(accept);
        for (const acc of accs) {
            // All match
            for (const [key, { locale, meta }] of Object.entries(locales)) {
                if (acc.code == meta.code && acc.region && meta.region && acc.script == meta.script) {
                    req.lang = key;
                    req.locale = locale;
                    return next();
                }
            }
            // code and region match
            for (const [key, { locale, meta }] of Object.entries(locales)) {
                if (acc.code == meta.code && acc.region == meta.region) {
                    req.lang = key;
                    req.locale = locale;
                    return next();
                }
            }
            // code and script match
            for (const [key, { locale, meta }] of Object.entries(locales)) {
                if (acc.code == meta.code && acc.script == meta.script) {
                    req.lang = key;
                    req.locale = locale;
                    return next();
                }
            }
            // code match
            for (const [key, { locale, meta }] of Object.entries(locales)) {
                if (acc.code == meta.code) {
                    req.lang = key;
                    req.locale = locale;
                    return next();
                }
            }
        }
        req.lang = byDefault;
        req.locale = locales[byDefault].locale;
        return next();
    });
    router.get("/i18n/locales/auto-detect", (req, res) => {
        res.json(req.locale);
    });
    router.get("/i18n/locales/:key.json", (req, res) => {
        const key = req.params.key;
        const locale = locales[key];
        if (locale == null) {
            res.writeHead(404, { "content-type": "application/json" });
            return res.json({ error: { code: 404, message: `locale ${key} does not exist` } });
        }
        res.json(locale.locale);
    });
    return router;
};
