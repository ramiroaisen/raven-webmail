import {Locale} from "../types";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import {Agent} from "https";
import chalk from "chalk";

import rimraf from "rimraf";

import pLimit from "p-limit";

const concurrency = 25;
const override = true;
const queue = pLimit(concurrency);

type Cache = Record<string, Record<string, string>>;
const cacheFile = path.join(__dirname, "./cache.json");
let cache: Cache = {};
try { cache = require(cacheFile); } catch(e) {}
const destCache: Cache = {...cache};

const key = process.env.GOOGLE_API_KEY ||
    fs.readFileSync(process.env.HOME + "/google_api_key.txt", "utf8").trim();

const destDir = path.join(__dirname, "machineTranslated");
const srcLang = "en";
import base from "../src/en";

let totalRequests = 0;
let doneRequests = 0;
let cachedRequests = 0;

const processKeys = () => {
    const keys: Record<number, string> = {};
    let i = 0;
    return {
        pre: (src: string) => {
            return src.replace(/\{(.+?)\}/g, (m, p1) => {
                i++;
                keys[i] = p1;
                return "{" + i + "}";
            })
        },

        pos: (out: string) => {
            return out.replace(/\{(.+?)\}/g, (m, i) => {
                return "{" + keys[+i] +  "}";
            })
        }
    }
}

const translateString = async (input: {src: string, to: string}): Promise<string> => {

    totalRequests++;

    const {to} = input;

    const {pre, pos} = processKeys();


    const src = pre(input.src)

    const cached = cache[to] && cache[to][src];

    if (cached != null) {
        doneRequests++;
        cachedRequests++;
        destCache[to] = destCache[to] || {};
        destCache[to][src] = cached;
        return pos(cached);
    }

    return queue(async () => {
        const json = await fetch(
            `https://translation.googleapis.com/language/translate/v2?key=${key}`,
            {
                method: "POST",
                body: JSON.stringify({
                    q: src,
                    source: srcLang,
                    target: to,
                    format: "text"
                })
            }).then(res => res.json());

        doneRequests++;

        const value = json.data.translations[0].translatedText;

        destCache[to] = destCache[to] || {};
        destCache[to][src] = value;

        return pos(value);

    })
}

const translateArray = async ({src, to}: {src: string[], to: string}): Promise<string[]> => {
    const ps: Promise<string>[] = [];
    const dest: string[] = []
    for(const item of src) {
        ps.push(translateString({src: item, to}));
    }
    return Promise.all(ps);
}

const translateMap = async <T extends LocaleMap>({src, to}: {src: T, to: string}): Promise<T> => {
    const target = Object.create(null) as LocaleMap;
    const ps = Object.create(null) as any;

    for(const [key, value] of Object.entries(src)) {
        ps[key] = translateAny({src: value, to});
    }

    await Promise.all(Object.values(ps));

    for(const [key, value] of Object.entries(ps)) {
        (target as any)[key] = await value;
    }

    return target as any;
}

const translateAny = async <T extends LocaleValue>({src, to}: {src: T, to: string}): Promise<T> => {
    if(typeof src === "string") {
        return await translateString({src, to}) as any;
    } else if (src instanceof Array) {
        return await translateArray({src, to}) as any;
    } else {
        return await translateMap({src: src as any, to});
    }
}

type LocaleValue = string | string[] | LocaleMap;
interface LocaleMap extends Record<string, string | string[] | LocaleMap> {};

const agent = new Agent({keepAlive: true});

const listLanguages = async (): Promise<string[]> => {
    const json = await fetch(`https://translation.googleapis.com/language/translate/v2/languages?key=${key}`)
        .then(res => res.json());

    return json.data.languages.map((o: any) => o.language);
}

const renderLocale = (locale: Locale): string => {
    return `\
import { Locale } from "../../types";
 
const locale: Locale = ${JSON.stringify(locale, null, 2)};

export default locale;`;
}

async function main() {
    const res = await listLanguages();
    console.log(res.length, "languages");

    //fs.writeFileSync("./machineTranslatedList.json", JSON.stringify(res, null, 2));
    if(override) {
        console.log("> Cleaning directory " + chalk.yellow(destDir));
        await new Promise((resolve, reject) => rimraf(destDir + "/*.ts", (err) => {
            if(err) reject(err);
            else resolve();
        }));
    }

    const doneLangs: string[] = [];
    const skippedLangs: string[] = [];

    const langs = res.filter(code => code !== srcLang);

    const render = () => {
        process.stdout.cursorTo(0, 0);
        process.stdout.clearScreenDown();
        console.log("=".repeat(process.stdout.getWindowSize()[1]))
        if(override) {
            console.log(`> Cleared directory ${chalk.yellow(destDir)}`);
        }
        console.log("> Translating locales: " + langs.map(lang => chalk.yellow(lang)).join(", "));
        console.log("=".repeat(process.stdout.getWindowSize()[0]))
        console.log(`> Concurrency: ${concurrency}`)
        console.log("=".repeat(process.stdout.getWindowSize()[0]))
        console.log(`> Total requests: ${chalk.yellow(totalRequests)}`)
        console.log(`> Active requests: ${chalk.yellow(queue.activeCount)}`)
        console.log(`> Cached responses: ${chalk.yellow(cachedRequests)}`)
        console.log(`> Done requests: ${chalk.yellow(doneRequests)}`)
        console.log(`> Pending requests: ${chalk.yellow(queue.pendingCount)}`)
        console.log("=".repeat(process.stdout.getWindowSize()[0]))
        console.log(`> Langs: ${chalk.yellow(doneLangs.length + skippedLangs.length)} / ${chalk.yellow(langs.length)}`);
        console.log(`> Skipped: ${skippedLangs.map(lang => chalk.yellow(lang)).join(", ")}`)
        console.log(`> Done: ${doneLangs.map(lang => chalk.yellow(lang)).join(", ")}`)
    }

    const ps = langs.map(async lang => {
        const filename = `${lang}.ts`;
        const dest = path.join(destDir, filename);
        if(fs.existsSync(dest) && !override) {
            skippedLangs.push(lang);
            return;
        }
        const target = await translateMap({src: base, to: lang});
        fs.writeFileSync(dest, renderLocale(target));
        doneLangs.push(lang);
    })

    const renderInterval = setInterval(render, 250);

    await Promise.all(ps)


    render();

    clearInterval(renderInterval);

    fs.writeFileSync(cacheFile, JSON.stringify(destCache, null, 2));
    console.log("Cache written to " + chalk.yellow(cacheFile));
    console.log("> Done!");
}

main();

/*
(() => {
    const cache = {} as any;
    const files = fs.readdirSync(destDir);
    for(const file of files) {
        const lang = file.replace(".ts", "");
        const locale = require(path.join(destDir, file)).default;
        cache[lang] = {};
        const add = (src: any, value: any) => {
            if(typeof src === "string") {
                cache[lang][src] = value;
            } else if(src instanceof Array) {
                for (let i = 0; i < src.length; i++){
                    cache[lang][src[i]] = value[i];
                }
            } else {
                for(const key in src) {
                    add(src[key], value[key]);
                }
            }
        }

        add(base, locale);

        fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
    }
})()
 */