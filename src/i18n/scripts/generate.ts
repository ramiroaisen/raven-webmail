import {Locale} from "../types";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import {Agent} from "https";
import chalk from "chalk";

import rimraf from "rimraf";

import pLimit from "p-limit";

const concurrency = 25;
const override = false;
const queue = pLimit(concurrency);

const key = process.env.GOOGLE_API_KEY ||
    fs.readFileSync(process.env.HOME + "/google_api_key.txt", "utf8").trim();

const destDir = path.join(__dirname, "machineTranslated");
const srcLang = "en";
import base from "../src/en";

let totalRequests = 0;
let doneRequests = 0;

const translateString = async ({src, to}: {src: string, to: string}): Promise<string> => {

    totalRequests++;

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

        return json.data.translations[0].translatedText;

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

    setInterval(render, 250);

    await Promise.all(ps)

    render();
    console.log("> Done!");
}

main();
