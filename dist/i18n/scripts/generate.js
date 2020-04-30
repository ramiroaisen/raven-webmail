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
const override = false;
const key = process.env.GOOGLE_API_KEY ||
    fs_1.default.readFileSync(process.env.HOME + "/google_api_key.txt", "utf8").trim();
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
const destDir = path_1.default.join(__dirname, "machineTranslated");
const srcLang = "en";
const en_1 = __importDefault(require("../src/en"));
const translateString = async ({ src, to }) => {
    const json = await node_fetch_1.default(`https://translation.googleapis.com/language/translate/v2?key=${key}`, {
        method: "POST",
        body: JSON.stringify({
            q: src,
            source: srcLang,
            target: to,
            format: "text"
        })
    }).then(res => res.json());
    return json.data.translations[0].translatedText;
};
const translateArray = async ({ src, to }) => {
    const ps = [];
    for (const item of src) {
        ps.push(translateString({ src: item, to }));
    }
    return Promise.all(ps);
};
const translateMap = async ({ src, to }) => {
    const ps = [];
    const target = Object.create(null);
    for (const [key, value] of Object.entries(src)) {
        ps.push(new Promise(async (resolve) => {
            target[key] = await translateAny({ src: value, to });
            resolve();
        }));
    }
    await Promise.all(ps);
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
const render = (locale) => {
    return `\
import { Locale } from "../../types";
 
const locale: Locale = ${JSON.stringify(locale, null, 2)};

export default locale;`;
};
async function main() {
    const res = await listLanguages();
    console.log(res.length, "languages");
    //fs.writeFileSync("./machineTranslatedList.json", JSON.stringify(res, null, 2));
    const langs = res.filter(code => code !== srcLang);
    const total = langs.length;
    let count = 0;
    for (const lang of langs) {
        const filename = `${lang}.ts`;
        const dest = path_1.default.join(destDir, filename);
        console.log(">", ++count, "/", total, `translating ${chalk_1.default.yellow(lang)}`);
        if (fs_1.default.existsSync(dest) && !override) {
            console.log(" Skipping: file already exists ");
            continue;
        }
        const target = await translateMap({ src: en_1.default, to: lang });
        fs_1.default.writeFileSync(dest, render(target));
        console.log("> Written to " + chalk_1.default.yellow(dest));
    }
    console.log("> Done!");
}
main();
