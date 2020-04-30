"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const https_1 = require("https");
const chalk_1 = __importDefault(require("chalk"));
const rimraf_1 = __importDefault(require("rimraf"));
const p_limit_1 = __importDefault(require("p-limit"));
const concurrency = 25;
const override = true;
const queue = p_limit_1.default(concurrency);
const cacheFile = path_1.default.join(__dirname, "./cache.json");
let cache = {};
try {
    cache = require(cacheFile);
}
catch (e) { }
const destCache = { ...cache };
const key = process.env.GOOGLE_API_KEY ||
    fs_1.default.readFileSync(process.env.HOME + "/google_api_key.txt", "utf8").trim();
const destDir = path_1.default.join(__dirname, "machineTranslated");
const srcLang = "en";
const en_1 = __importDefault(require("../src/en"));
let totalRequests = 0;
let doneRequests = 0;
let cachedRequests = 0;
const translateString = async ({ src, to }) => {
    totalRequests++;
    const cached = cache[to] && cache[to][src];
    if (cached != null) {
        doneRequests++;
        cachedRequests++;
        destCache[to] = destCache[to] || {};
        destCache[to][src] = cached;
        return cached;
    }
    return queue(async () => {
        const json = await node_fetch_1.default(`https://translation.googleapis.com/language/translate/v2?key=${key}`, {
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
        return value;
    });
};
const translateArray = async ({ src, to }) => {
    const ps = [];
    const dest = [];
    for (const item of src) {
        ps.push(translateString({ src: item, to }));
    }
    return Promise.all(ps);
};
const translateMap = async ({ src, to }) => {
    const target = Object.create(null);
    const ps = Object.create(null);
    for (const [key, value] of Object.entries(src)) {
        ps[key] = translateAny({ src: value, to });
    }
    await Promise.all(Object.values(ps));
    for (const [key, value] of Object.entries(ps)) {
        target[key] = await value;
    }
    return target;
};
const translateAny = async ({ src, to }) => {
    if (typeof src === "string") {
        return await translateString({ src, to });
    }
    else if (src instanceof Array) {
        return await translateArray({ src, to });
    }
    else {
        return await translateMap({ src: src, to });
    }
};
;
const agent = new https_1.Agent({ keepAlive: true });
const listLanguages = async () => {
    const json = await node_fetch_1.default(`https://translation.googleapis.com/language/translate/v2/languages?key=${key}`)
        .then(res => res.json());
    return json.data.languages.map((o) => o.language);
};
const renderLocale = (locale) => {
    return `\
import { Locale } from "../../types";
 
const locale: Locale = ${JSON.stringify(locale, null, 2)};

export default locale;`;
};
async function main() {
    const res = await listLanguages();
    console.log(res.length, "languages");
    //fs.writeFileSync("./machineTranslatedList.json", JSON.stringify(res, null, 2));
    if (override) {
        console.log("> Cleaning directory " + chalk_1.default.yellow(destDir));
        await new Promise((resolve, reject) => rimraf_1.default(destDir + "/*.ts", (err) => {
            if (err)
                reject(err);
            else
                resolve();
        }));
    }
    const doneLangs = [];
    const skippedLangs = [];
    const langs = res.filter(code => code !== srcLang);
    const render = () => {
        process.stdout.cursorTo(0, 0);
        process.stdout.clearScreenDown();
        console.log("=".repeat(process.stdout.getWindowSize()[1]));
        if (override) {
            console.log(`> Cleared directory ${chalk_1.default.yellow(destDir)}`);
        }
        console.log("> Translating locales: " + langs.map(lang => chalk_1.default.yellow(lang)).join(", "));
        console.log("=".repeat(process.stdout.getWindowSize()[0]));
        console.log(`> Concurrency: ${concurrency}`);
        console.log("=".repeat(process.stdout.getWindowSize()[0]));
        console.log(`> Total requests: ${chalk_1.default.yellow(totalRequests)}`);
        console.log(`> Active requests: ${chalk_1.default.yellow(queue.activeCount)}`);
        console.log(`> Cached responses: ${chalk_1.default.yellow(cachedRequests)}`);
        console.log(`> Done requests: ${chalk_1.default.yellow(doneRequests)}`);
        console.log(`> Pending requests: ${chalk_1.default.yellow(queue.pendingCount)}`);
        console.log("=".repeat(process.stdout.getWindowSize()[0]));
        console.log(`> Langs: ${chalk_1.default.yellow(doneLangs.length + skippedLangs.length)} / ${chalk_1.default.yellow(langs.length)}`);
        console.log(`> Skipped: ${skippedLangs.map(lang => chalk_1.default.yellow(lang)).join(", ")}`);
        console.log(`> Done: ${doneLangs.map(lang => chalk_1.default.yellow(lang)).join(", ")}`);
    };
    const ps = langs.map(async (lang) => {
        const filename = `${lang}.ts`;
        const dest = path_1.default.join(destDir, filename);
        if (fs_1.default.existsSync(dest) && !override) {
            skippedLangs.push(lang);
            return;
        }
        const target = await translateMap({ src: en_1.default, to: lang });
        fs_1.default.writeFileSync(dest, renderLocale(target));
        doneLangs.push(lang);
    });
    const renderInterval = setInterval(render, 250);
    await Promise.all(ps);
    render();
    clearInterval(renderInterval);
    fs_1.default.writeFileSync(cacheFile, JSON.stringify(destCache, null, 2));
    console.log("Cache written to " + chalk_1.default.yellow(cacheFile));
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
