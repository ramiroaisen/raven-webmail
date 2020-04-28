"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const pkg = require("../package.json");
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config = __importStar(require("./config"));
const createConfig = (opts) => {
    console.log("> Creating config file in " + chalk_1.default.yellow(opts.output));
    const sample = path_1.default.join(__dirname, "../config.sample.toml");
    const dest = path_1.default.resolve(process.cwd(), opts.output);
    if (fs_1.default.existsSync(dest)) {
        console.error(chalk_1.default.red(`> Aborting: file ${dest} already exists`));
        return process.exit(1);
    }
    fs_1.default.copyFileSync(sample, dest);
    console.log("> Config file created in " + chalk_1.default.yellow(dest));
    console.log("> Before start edit the settings as needed");
    console.log("> Then run " + chalk_1.default.yellow("raven start") + " in the conf directory");
};
const start = (opts) => {
    const conf = config.load(path_1.default.resolve(process.cwd(), opts.config));
    require("./server").start(conf);
};
commander_1.default.version(pkg.version);
commander_1.default.command("create-config")
    .description("create the default config.toml file")
    .option("-o --output <path>", "path to ouput file", "./config.toml")
    .action(createConfig);
commander_1.default.command("start")
    .description("starts the webmail server")
    .option("-c --config <path>", "path to the config file", "./config.toml")
    .action(start);
commander_1.default.parse(process.argv);
