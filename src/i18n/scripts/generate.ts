import {Locale} from "../types";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import {Agent} from "https";
import chalk from "chalk";

const override = false;

const key = process.env.GOOGLE_API_KEY ||
    fs.readFileSync(process.env.HOME + "/google_api_key.txt", "utf8").trim();


/*
export const translate = async ({src, to}: {src: string, to: string}): Promise<string> => src;

export const generate = (to: string, base: Locale): Locale => {

    const target = Object.create(null) as Locale;

    const map = async (source: Record<string, any>): Record<string, any> => {

        const target = Object.create(null) as Record<string, any>;

        for(const [key, value] of Object.entries(source)) {
            if (typeof value === "string") {
                target[key] = await translate({src: value, to});

            } else if(value instanceof Array) {
                const v = [];
                for(const item of value) {
                    v.push(await translate({src: item, to}));
                }

                target[key] = v;

            } else {

                target[key] = await map(target[key]);

            }
        }
    }

    map(dest, base);

    return target;
}
*/

const destDir = path.join(__dirname, "machineTranslated");
const srcLang = "en";
import base from "../src/en";

const translateString = async ({src, to}: {src: string, to: string}): Promise<string> => {
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

    return json.data.translations[0].translatedText;
}

const translateArray = async ({src, to}: {src: string[], to: string}): Promise<string[]> => {
    const ps: Promise<string>[] = [];
    for(const item of src) {
        ps.push(translateString({src: item, to}));
    }
    return Promise.all(ps);
}

const translateMap = async <T extends LocaleMap>({src, to}: {src: T, to: string}): Promise<T> => {
    const ps: Promise<void>[] = [];
    const target = Object.create(null) as LocaleMap;
    for(const [key, value] of Object.entries(src)) {
        ps.push(new Promise(async (resolve) => {
            target[key] = await translateAny({src: value, to});
            resolve()
        }))
    }

    await Promise.all(ps);

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

const render = (locale: Locale): string => {
    return `\
import { Locale } from "../../types";
 
const locale: Locale = ${JSON.stringify(locale, null, 2)};

export default locale;`;
}

async function main() {
    const res = await listLanguages();
    console.log(res.length, "languages");

    //fs.writeFileSync("./machineTranslatedList.json", JSON.stringify(res, null, 2));

    const langs = res.filter(code => code !== srcLang);

    const total = langs.length;
    let count = 0;

    for(const lang of langs) {
        const filename = `${lang}.ts`;
        const dest = path.join(destDir, filename);
        console.log(">" , ++count, "/", total, `translating ${chalk.yellow(lang)}`);
        if(fs.existsSync(dest) && !override) {
            console.log(" Skipping: file already exists ")
            continue;
        }
        const target = await translateMap({src: base, to: lang});
        fs.writeFileSync(dest, render(target));
        console.log("> Written to " + chalk.yellow(dest));
    }

    console.log("> Done!");
}

main();
