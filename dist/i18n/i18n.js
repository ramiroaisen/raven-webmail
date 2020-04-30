"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.defaultLang = "en";
exports.base = require("./src/en").default;
const chalk_1 = __importDefault(require("chalk"));
const express_1 = require("express");
const accept_language_parser_1 = __importDefault(require("accept-language-parser"));
const localeDirs = [
    [path_1.default.join(__dirname, "src"), ".js", "human generated locales"],
    [path_1.default.join(__dirname, "scripts/machineTranslated"), ".js", "machine generated locales"],
];
const imp = (path) => {
    const helper = require(path);
    return helper.__esModule ? helper.default : helper;
};
const flat = (locale) => {
    const target = {};
    const add = (parent, map) => {
        for (const [key, value] of Object.entries(map)) {
            const k = parent ? `${parent}.${key}` : key;
            if (typeof value === "string" || value instanceof Array) {
                target[k] = value;
            }
            else {
                add(k, value);
            }
        }
    };
    add(null, locale);
    return target;
};
const clone = (locale) => {
    const clone = (value) => {
        if (typeof value === "string") {
            return value;
        }
        else if (value instanceof Array) {
            return [...value];
        }
        else {
            return Object.fromEntries(Object.entries(value).map(([key, value]) => {
                return [key, clone(value)];
            }));
        }
    };
    return clone(locale);
};
const flattedBase = flat(exports.base);
const merge = (locale, meta) => {
    const flatted = flat(locale);
    for (const [k, v1] of Object.entries(flattedBase)) {
        const v2 = flatted[k];
        if (v2 == null) {
            console.warn(`> ${chalk_1.default.red("[WARN]")}: locale ${chalk_1.default.yellow(meta.key)} => missing key ${chalk_1.default.yellow(`"${k}"`)}: filling from default (${chalk_1.default.yellow(exports.defaultLang)})`);
        }
        else if (typeof v1 === "string" && typeof v2 !== "string") {
            console.warn(`> ${chalk_1.default.red("[WARN]")}: locale ${chalk_1.default.yellow(meta.key)} => key ${chalk_1.default.yellow(`"${k}"`)} should be a string: replacing with value from default (${chalk_1.default.yellow(exports.defaultLang)})`);
        }
        else if (v1 instanceof Array && !(v2 instanceof Array)) {
            console.warn(`> ${chalk_1.default.red("[WARN]")}: locale ${chalk_1.default.yellow(meta.key)} => key ${chalk_1.default.yellow(`"${k}"`)} should be an array: replacing with value from default (${chalk_1.default.yellow(exports.defaultLang)})`);
        }
    }
    for (const [k, v2] of Object.entries(flatted)) {
        const v1 = flattedBase[k];
        if (v1 == null) {
            console.warn(`> ${chalk_1.default.red("[WARN]")}: locale ${chalk_1.default.yellow(meta.key)} => unrecognized key ${chalk_1.default.yellow(`"${k}"`)}: removing`);
        }
    }
    const cloned = clone(exports.base);
    const merge = (target, parents) => {
        for (const [key, value] of Object.entries(target)) {
            const k = [...parents, key].join(".");
            const v = flatted[k];
            if (typeof value === "string") {
                if (typeof v === "string") {
                    target[key] = v;
                }
            }
            else if (value instanceof Array) {
                if (v instanceof Array) {
                    target[key] = v;
                }
            }
            else {
                merge(target[key], [...parents, key]);
            }
        }
    };
    merge(cloned, []);
    return cloned;
};
exports.load = (config) => {
    let locales = Object.create(null);
    const dirs = [];
    if (config.extra_locales_dirs != null) {
        for (const dir of config.extra_locales_dirs) {
            dirs.push([dir, ".json", "custom locales"]);
        }
    }
    dirs.push(...localeDirs);
    for (const [dir, ext, title] of dirs) {
        console.log(`> Loading ${chalk_1.default.yellow(title)} from ${chalk_1.default.yellow(dir)}`);
        const filenames = fs_1.default.readdirSync(dir);
        for (const filename of filenames) {
            if (!filename.endsWith(ext)) {
                continue;
            }
            const key = filename.split(".")[0];
            if (key in locales) {
                continue;
            }
            const src = imp(path_1.default.join(dir, key));
            const { code, region, script } = accept_language_parser_1.default.parse(key)[0];
            const meta = { key, code, region, script };
            const locale = merge(src, meta);
            locales[key] = { locale, meta };
        }
    }
    return locales;
};
exports.i18n = (config) => {
    const locales = exports.load(config);
    console.log(">", Object.keys(locales).length, "locales loaded, default: " + chalk_1.default.yellow(exports.defaultLang));
    const router = express_1.Router();
    router.use((req, res, next) => {
        const accept = req.headers["accept-language"];
        if (accept == null) {
            req.lang = exports.defaultLang;
            req.locale = locales[exports.defaultLang].locale;
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
        req.lang = exports.defaultLang;
        req.locale = locales[exports.defaultLang].locale;
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
