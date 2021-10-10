"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const pkg = require("../../package.json");
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const en_1 = __importDefault(require("./i18n/src/en"));
const fs_2 = require("fs");
const { mkdir } = fs_2.promises;
const config = __importStar(require("./config"));
const createConfig = (opts) => {
    console.log("> Creating config file in " + chalk_1.default.yellow(opts.output));
    const sample = path_1.default.resolve(__dirname, "../../config.sample.toml");
    const dest = path_1.default.resolve(process.cwd(), opts.output);
    if (fs_1.default.existsSync(dest)) {
        console.error(chalk_1.default.red(`> Aborting: file ${dest} already exists`));
        return process.exit(1);
    }
    fs_1.default.copyFileSync(sample, dest);
    console.log("> Config file created in " + chalk_1.default.yellow(dest));
    console.log("> Before start edit the settings as needed");
    console.log("> Then run " + chalk_1.default.yellow("raven start") + " in the config directory");
};
const start = async (opts) => {
    const conf = config.load(path_1.default.resolve(process.cwd(), opts.config));
    (await Promise.resolve().then(() => __importStar(require("./server")))).start(conf);
};
const createLocale = async (opts) => {
    if (opts.code == null) {
        console.error('--code="ISO_CODE" is required');
        process.exit(1);
    }
    const conf = config.load(path_1.default.resolve(process.cwd(), opts.config));
    if (conf.extra_locales_dirs == null || conf.extra_locales_dirs.length === 0) {
        console.error(chalk_1.default.red(`> You must add a directory to ${chalk_1.default.yellow("config.extra_locale_dirs")} before running this`));
        return process.exit(1);
    }
    const dir = conf.extra_locales_dirs[0];
    await mkdir(dir, { recursive: true });
    const file = path_1.default.join(dir, opts.code + ".json");
    if (fs_1.default.existsSync(file)) {
        console.error(chalk_1.default.red(`> Aborting: file ${chalk_1.default.yellow(file)} already exists`));
        return process.exit(1);
    }
    fs_1.default.writeFileSync(file, JSON.stringify(en_1.default, null, 2));
    console.log("> locale file created into " + chalk_1.default.yellow(file));
};
commander_1.program.version(pkg.version);
commander_1.program.command("create-config")
    .description("create the default config.toml file")
    .option("-o --output <path>", "path to ouput file", "./config.toml")
    .action(createConfig);
commander_1.program.command("start")
    .description("starts the webmail server")
    .option("-c --config <path>", "path to the config file", "./config.toml")
    .action(start);
commander_1.program.command("create-locale")
    .description("creates a default locale file into `config.extra_locale_dirs.0/code.json`")
    .option("-c --config <path>", "path to the config file", "./config.toml")
    .option("--code <code>", "locale ISO code")
    .action(createLocale);
commander_1.program.parse(process.argv);
//# sourceMappingURL=cli.js.map