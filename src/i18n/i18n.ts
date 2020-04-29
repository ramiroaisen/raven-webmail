import path from "path";
import fs from "fs";

import { assertType } from "typescript-is";
import chalk from "chalk";
import {Request, Response, NextFunction, Router} from "express";

import parser from "accept-language-parser";

import {Locale} from "./types";

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

export const load = (): Record<string, {locale: Locale, meta: LocaleMeta}> => {
    
    let locales: Record<string, {locale: Locale, meta: LocaleMeta}> = Object.create(null);

    const srcDir = path.join(__dirname, "src");

    const filenames = fs.readdirSync(srcDir);
    
    for(const filename of filenames) {
        
        if(path.extname(filename) !== ".js") {
            continue;
        }

        const key = filename.split(".")[0];
        const locale = require(path.join(srcDir, key)).default as Locale;
        const {code, region, script} = parser.parse(key)[0];
        const meta = {key, code, region, script};

        try {
            //assertType<Locale>(locale);
            locales[key] = {locale, meta};
        } catch(e) {
            console.error(chalk.red(`Type error in locale ${chalk.yellow(code)}:` + e.message));
            console.log("Ignoring locale " + chalk.yellow(code));
        }
    }
    
    return locales;
}

const checkLocale = (locale: Locale) => {

}

export const i18n = ({byDefault = "en"} = {}) => {
    
    const locales = load();

    const router = Router();

    router.use((req: Request, res: Response, next: NextFunction) => {
        
        const accept = req.headers["accept-language"];
        
        if (accept == null) {
            req.lang = byDefault;
            req.locale = locales[byDefault].locale;
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

        req.lang = byDefault;
        req.locale = locales[byDefault].locale;
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