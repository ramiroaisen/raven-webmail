import path from "path";
import fs from "fs";

export const defaultLang = "en";
export const base = require("./src/en").default as Locale;

import { assertType } from "typescript-is";
import chalk from "chalk";
import {Request, Response, NextFunction, Router} from "express";

import parser from "accept-language-parser";

import {Locale} from "./types";
import {Config} from "../config";

declare module "express" {
    interface Request {
        lang?: string
        locale?: Locale
    }
}

export type LocaleMeta = {
    key: string
    code: string
    region?: string | null
    script?: string | null
}

const localeDirs = [
    [path.join(__dirname, "src"), ".js", "human generated locales"],
    [path.join(__dirname, "scripts/machineTranslated"), ".js", "machine generated locales"],
]

const imp = (path: string): Locale => {
    const helper = require(path);
    return helper.__esModule ? helper.default : helper;
}

interface Value extends Record<string, string | string[] | Value> {}

const flat = (locale: Locale): Record<string, string | string[]> => {

    const target: Record<string, string | string[]> = {};

    const add = (parent: string | null, map: Value) => {
        for (const [key, value] of Object.entries(map)) {
            const k = parent ? `${parent}.${key}` : key;
            if (typeof value === "string" || value instanceof Array) {
                target[k] = value;
            } else {
                add(k, value);
            }
        }
    }

    add(null, locale);

    return target;
}

const clone = (locale: Locale): Locale => {
    const clone = <T extends Value>(value: T): T => {
        if(typeof value === "string") {
            return value;
        } else if (value instanceof Array) {
            return [...value] as any;
        } else {
            return Object.fromEntries(Object.entries(value).map(([key, value]) => {
                return [key, clone(value as any)];
            }))
        }
    }

    return clone(locale);
}

const flattedBase = flat(base);

const merge = (locale: Locale, meta: LocaleMeta): Locale => {

    const flatted = flat(locale);

    for(const [k, v1] of Object.entries(flattedBase)) {
        const v2 = flatted[k as any];
        if (v2 == null) {
            console.warn(`> ${chalk.red("[WARN]")}: locale ${chalk.yellow(meta.key)} => missing key ${chalk.yellow(`"${k}"`)}: filling from default (${chalk.yellow(defaultLang)})`)

        } else if (typeof v1 === "string" && typeof v2 !== "string") {
            console.warn(`> ${chalk.red("[WARN]")}: locale ${chalk.yellow(meta.key)} => key ${chalk.yellow(`"${k}"`)} should be a string: replacing with value from default (${chalk.yellow(defaultLang)})`)

        } else if(v1 instanceof Array && !(v2 instanceof Array)) {
            console.warn(`> ${chalk.red("[WARN]")}: locale ${chalk.yellow(meta.key)} => key ${chalk.yellow(`"${k}"`)} should be an array: replacing with value from default (${chalk.yellow(defaultLang)})`)
        }

    }

    for(const [k, v2] of Object.entries(flatted)) {
        const v1 = flattedBase[k as any];
        if (v1 == null) {
            console.warn(`> ${chalk.red("[WARN]")}: locale ${chalk.yellow(meta.key)} => unrecognized key ${chalk.yellow(`"${k}"`)}: removing`);
        }
    }

    const cloned = clone(base);

    const merge = (target: Record<string, Value>, parents: string[]) => {
        for(const [key, value] of Object.entries(target)) {
            const k = [...parents, key].join(".");
            const v = flatted[k];
            if (typeof value === "string") {
                if(typeof v === "string"){
                    (target[key] as any) = v;
                }
            } else if (value instanceof Array){
                if(v instanceof Array) {
                    (target[key] as any) = v;
                }
            } else {
               merge(target[key] as any, [...parents, key]);
            }
        }
    }

    merge(cloned, []);

    return cloned;
}

export const load = (config: Config): Record<string, {locale: Locale, meta: LocaleMeta}> => {
    
    let locales: Record<string, {locale: Locale, meta: LocaleMeta}> = Object.create(null);

    const dirs = [];

    if(config.extra_locales_dirs != null) {
        for(const dir of config.extra_locales_dirs) {
            dirs.push([dir, ".json", "custom locales"]);
        }
    }

    dirs.push(...localeDirs);

    for (const [dir, ext, title] of dirs) {

        console.log(`> Loading ${chalk.yellow(title)} from ${chalk.yellow(dir)}`);

        const filenames = fs.readdirSync(dir);

        for(const filename of filenames) {

            if (!filename.endsWith(ext)) {
                continue;
            }

            const key = filename.split(".")[0];

            if(key in locales) {
                continue;
            }

            const src = imp(path.join(dir, key));
            const {code, region, script} = parser.parse(key)[0];
            const meta = {key, code, region, script};
            const locale = merge(src, meta);

            locales[key] = {locale, meta};
        }
    }

    return locales;
}

export const i18n = (config: Config) => {
    
    const locales = load(config);

    console.log(">", Object.keys(locales).length, "locales loaded, default: " + chalk.yellow(defaultLang));

    const router = Router();

    router.use((req: Request, res: Response, next: NextFunction) => {
        
        const accept = req.headers["accept-language"];
        
        if (accept == null) {
            req.lang = defaultLang;
            req.locale = locales[defaultLang].locale;
            return next();
        } 

        const accs = parser.parse(accept);

        for(const acc of accs) {

            // All match
            for(const [key, {locale, meta}] of Object.entries(locales)) {
                if(acc.code == meta.code && acc.region && meta.region && acc.script == meta.script) {
                    req.lang = key;
                    req.locale = locale;    
                    return next();
                }
            }

            // code and region match
            for(const [key, {locale, meta}] of Object.entries(locales)) {
                if(acc.code == meta.code && acc.region == meta.region) {
                    req.lang = key;
                    req.locale = locale;
                    return next();
                }
            }

            // code and script match
            for(const [key, {locale, meta}] of Object.entries(locales)) {
                if(acc.code == meta.code && acc.script == meta.script) {
                    req.lang = key;
                    req.locale = locale;
                    return next();
                }
            }

            // code match
            for(const [key, {locale, meta}] of Object.entries(locales)) {
                if(acc.code == meta.code) {
                    req.lang = key;
                    req.locale = locale;
                    return next();
                }
            }
        }

        req.lang = defaultLang;
        req.locale = locales[defaultLang].locale;
        return next();
    })

    router.get("/i18n/locales/auto-detect", (req: Request, res: Response) => {
        res.json(req.locale);
    })

    router.get("/i18n/locales/:key.json", (req: Request, res: Response) => {
        const key = req.params.key;
        const locale = locales[key];
        if(locale == null) {
            res.writeHead(404, {"content-type": "application/json"});
            return res.json({ error: { code: 404, message: `locale ${key} does not exist`}});
        }
        res.json(locale.locale);
    })

    return router;
}