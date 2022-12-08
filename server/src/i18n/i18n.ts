import { NextFunction, Request, Response, Router } from "express";
import { Config } from "../config";
import type { Locale } from "./locale";

import { parse } from "accept-language-parser"

import { readdirSync, readFileSync } from "fs";
import { join } from "path";

export type Locales = Record<string, Locale>;

import { get } from "object-path";

import en from "./src/en";
import es from "./src/es";
import it from "./src/it";
import chalk from "chalk";

declare module "express" {
  interface Request {
    lang?: string
    locale?: Locale
  }
}

const clone = <T>(src: T): T => {
  if(src instanceof Array) {
    // @ts-ignore
    return src.map(clone);
  } 

  if(typeof src == "object" && src !== null) {
    // @ts-ignore
    const target: T = Object.create(null);
    for(const [key, value] of Object.entries(src)) {
      // @ts-ignore
      target[key] = clone(value);
    }
    return target;
  }

  return src;
}

const deepkeys = (src: any): string[] => {
  
  const keys: string[] = [];

  const add = (src: any, path: string[] = []) => {
    if(typeof src === "string") keys.push(path.join("."))
    else {
      for(const [key, value] of Object.entries(src)) {
        add(value, [...path, key]);
      }
    }
  }

  add(src);

  return keys;
}

const baseKeys = deepkeys(en);

const normalize = (code: string, src: Record<string, any>): Locale => {
  const keys = deepkeys(src);
  for(const key of keys) {
    if(!baseKeys.includes(key)) {
      console.warn(`> [WARN] Locale ${chalk.yellow(code)} unknown key ${chalk.yellow(key)} ignoring`)
    }
  }

  const merge = <T>(src: any, base: T, path: string[]): T  => {

    if(typeof base === "string") {
      if(typeof src === "string") {
        // @ts-ignore
        return src;
      } else {
        console.warn(`> [WARN] Locale ${chalk.yellow(code)} key ${chalk.yellow(path.join("."))} is not a string, setting it to default`)
        return base;
      }
    }

    if(typeof base === "object") {
      if(typeof src !== "object" || src === null) {
        console.warn(`> [WARN] Locale ${chalk.yellow(code)} key ${chalk.yellow(path.join("."))} is not an object, setting it to default`)
        return clone(base);
      }
    }

    if(base instanceof Array) {
      // @ts-ignore
      const target: T = [];
      for(let i = 0; i < base.length; i++) {
        // @ts-ignore
        target[i] = merge(src[i], base[i], [...path, String(i)])
      }
      return target;

    } else {
      const target: T = Object.create(null);
      for(const [key, value] of Object.entries(base)) {
        // @ts-ignore
        target[key] = merge(src[key], value, [...path, key])
      }

      return target;
    }
  }

  return merge(src, en, []);
}

export const loadLocales = (config: Config): Locales => {
  
  if(!config.extra_locales_dirs?.length) {
    return { en, es };
  }

  const locales: Locales = Object.create(null);
  
  try {
    for(const dir of config.extra_locales_dirs) {
      const names = readdirSync(dir);
      for(const name of names) {
        if(!/\.json$/i.test(name)) continue;
        const code = name.replace(/\.json$/i, "");
        if(locales[code]) continue;
        const filepath = join(dir, name);
        console.log(`> loading locale ${chalk.yellow(code)} from ${chalk.yellow(filepath)}`)
        const source = readFileSync(filepath, "utf-8");
        const locale = JSON.parse(source);
        if(typeof locale !== "object" || locale == null) {
          throw new Error("Locale JSON is not an object");
        }

        locales[code] = normalize(code, locale);
      }
    }
  } catch(e: any) {
    console.warn(chalk.red(`Error loading custom locales: ${e.message}`))
    console.error(e);
    process.exit(1);
  }

  if(locales.en == null) {
    console.log(`> adding locale ${chalk.yellow("en")} from source`);
    locales.en = en;
  }

  if(locales.es == null) {
    console.log(`> adding locale ${chalk.yellow("es")} from source`);
    locales.es = es;
  }

  if(locales.it == null) {
    console.log(`> adding locale ${chalk.yellow("it")} from source`);
    locales.it = it;  
  }

  console.log(`> locales loaded, available locales: ${Object.keys(locales).map(s => chalk.yellow(s)).join(", ")}`);

  return locales
}

export const getLocaleForAcceptLang = (acceptLang: string | null | undefined, locales: Locales): { lang: string, locale: Locale } => {
  if(acceptLang == null) return { lang: "en", locale: locales.en };
  const langs = parse(acceptLang);
  for(const lang of langs) {
    if(lang.region) {
      const key = `${lang.code}-${lang.region}`;
      if(locales[key] != null) return { lang: key, locale: locales[key] };
    }

    if(locales[lang.code] != null) return { lang: lang.code, locale: locales[lang.code] };
  }
  
  return { lang: "en", locale: locales.en }
}

export const middleware = (config: Config) => {

  const locales = loadLocales(config);
  
  const i18n = Router();

  i18n.use((req: Request, res: Response, next: NextFunction) => {
    let acceptLanguage = String(req.query["accept-language"] || "");
    if(!acceptLanguage) {
      acceptLanguage = req.headers["accept-language"] || "";
    }
    const { lang, locale } = getLocaleForAcceptLang(acceptLanguage, locales);  
    req.lang = lang;
    req.locale = locale;
    next();
  })

  i18n.get("/locale", async (req: Request, res: Response) => {
    const { lang, locale } = req;
    res.json({ lang, locale });
  })

  return i18n;
}