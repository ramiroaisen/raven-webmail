"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = exports.getLocaleForAcceptLang = exports.loadLocales = void 0;
const express_1 = require("express");
const accept_language_parser_1 = require("accept-language-parser");
const fs_1 = require("fs");
const path_1 = require("path");
const en_1 = __importDefault(require("./src/en"));
const es_1 = __importDefault(require("./src/es"));
const it_1 = __importDefault(require("./src/it"));
const chalk_1 = __importDefault(require("chalk"));
const clone = (src) => {
    if (src instanceof Array) {
        // @ts-ignore
        return src.map(clone);
    }
    if (typeof src == "object" && src !== null) {
        // @ts-ignore
        const target = Object.create(null);
        for (const [key, value] of Object.entries(src)) {
            // @ts-ignore
            target[key] = clone(value);
        }
        return target;
    }
    return src;
};
const deepkeys = (src) => {
    const keys = [];
    const add = (src, path = []) => {
        if (typeof src === "string")
            keys.push(path.join("."));
        else {
            for (const [key, value] of Object.entries(src)) {
                add(value, [...path, key]);
            }
        }
    };
    add(src);
    return keys;
};
const baseKeys = deepkeys(en_1.default);
const normalize = (code, src) => {
    const keys = deepkeys(src);
    for (const key of keys) {
        if (!baseKeys.includes(key)) {
            console.warn(`> [WARN] Locale ${chalk_1.default.yellow(code)} unknown key ${chalk_1.default.yellow(key)} ignoring`);
        }
    }
    const merge = (src, base, path) => {
        if (typeof base === "string") {
            if (typeof src === "string") {
                // @ts-ignore
                return src;
            }
            else {
                console.warn(`> [WARN] Locale ${chalk_1.default.yellow(code)} key ${chalk_1.default.yellow(path.join("."))} is not a string, setting it to default`);
                return base;
            }
        }
        if (typeof base === "object") {
            if (typeof src !== "object" || src === null) {
                console.warn(`> [WARN] Locale ${chalk_1.default.yellow(code)} key ${chalk_1.default.yellow(path.join("."))} is not an object, setting it to default`);
                return clone(base);
            }
        }
        if (base instanceof Array) {
            // @ts-ignore
            const target = [];
            for (let i = 0; i < base.length; i++) {
                // @ts-ignore
                target[i] = merge(src[i], base[i], [...path, String(i)]);
            }
            return target;
        }
        else {
            const target = Object.create(null);
            for (const [key, value] of Object.entries(base)) {
                // @ts-ignore
                target[key] = merge(src[key], value, [...path, key]);
            }
            return target;
        }
    };
    return merge(src, en_1.default, []);
};
const loadLocales = (config) => {
    var _a;
    if (!((_a = config.extra_locales_dirs) === null || _a === void 0 ? void 0 : _a.length)) {
        return { en: en_1.default, es: es_1.default };
    }
    const locales = Object.create(null);
    try {
        for (const dir of config.extra_locales_dirs) {
            const names = (0, fs_1.readdirSync)(dir);
            for (const name of names) {
                if (!/\.json$/i.test(name))
                    continue;
                const code = name.replace(/\.json$/i, "");
                if (locales[code])
                    continue;
                const filepath = (0, path_1.join)(dir, name);
                console.log(`> loading locale ${chalk_1.default.yellow(code)} from ${chalk_1.default.yellow(filepath)}`);
                const source = (0, fs_1.readFileSync)(filepath, "utf-8");
                const locale = JSON.parse(source);
                if (typeof locale !== "object" || locale == null) {
                    throw new Error("Locale JSON is not an object");
                }
                locales[code] = normalize(code, locale);
            }
        }
    }
    catch (e) {
        console.warn(chalk_1.default.red(`Error loading custom locales: ${e.message}`));
        console.error(e);
        process.exit(1);
    }
    if (locales.en == null) {
        console.log(`> adding locale ${chalk_1.default.yellow("en")} from source`);
        locales.en = en_1.default;
    }
    if (locales.es == null) {
        console.log(`> adding locale ${chalk_1.default.yellow("es")} from source`);
        locales.es = es_1.default;
    }
    if (locales.it == null) {
        console.log(`> adding locale ${chalk_1.default.yellow("it")} from source`);
        locales.it = it_1.default;
    }
    console.log(`> locales loaded, available locales: ${Object.keys(locales).map(s => chalk_1.default.yellow(s)).join(", ")}`);
    return locales;
};
exports.loadLocales = loadLocales;
const getLocaleForAcceptLang = (acceptLang, locales) => {
    if (acceptLang == null)
        return { lang: "en", locale: locales.en };
    const langs = (0, accept_language_parser_1.parse)(acceptLang);
    for (const lang of langs) {
        if (lang.region) {
            const key = `${lang.code}-${lang.region}`;
            if (locales[key] != null)
                return { lang: key, locale: locales[key] };
        }
        if (locales[lang.code] != null)
            return { lang: lang.code, locale: locales[lang.code] };
    }
    return { lang: "en", locale: locales.en };
};
exports.getLocaleForAcceptLang = getLocaleForAcceptLang;
const middleware = (config) => {
    const locales = (0, exports.loadLocales)(config);
    const i18n = (0, express_1.Router)();
    i18n.use((req, res, next) => {
        let acceptLanguage = String(req.query["accept-language"] || "");
        if (!acceptLanguage) {
            acceptLanguage = req.headers["accept-language"] || "";
        }
        const { lang, locale } = (0, exports.getLocaleForAcceptLang)(acceptLanguage, locales);
        req.lang = lang;
        req.locale = locale;
        next();
    });
    i18n.get("/locale", async (req, res) => {
        const { lang, locale } = req;
        res.json({ lang, locale });
    });
    return i18n;
};
exports.middleware = middleware;
//# sourceMappingURL=i18n.js.map