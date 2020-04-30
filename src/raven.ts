import cmd from "commander";
const pkg = require("../package.json");

import chalk from "chalk";
import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";
import {base} from "./i18n/i18n";

import * as config from "./config";

const createConfig = (opts: {output: string}) => {
  console.log("> Creating config file in " + chalk.yellow(opts.output));
  const sample = path.join(__dirname, "../config.sample.toml");
  const dest = path.resolve(process.cwd(), opts.output);
  if(fs.existsSync(dest)) {
    console.error(chalk.red(`> Aborting: file ${dest} already exists`))
    return process.exit(1);
  }

  fs.copyFileSync(sample, dest);
  console.log("> Config file created in " + chalk.yellow(dest));

  console.log("> Before start edit the settings as needed")
  console.log("> Then run " + chalk.yellow("raven start") + " in the conf directory")
}

const start = (opts: {config: string}) => {
  const conf = config.load(path.resolve(process.cwd(), opts.config));
  require("./server").start(conf);
}

const createLocale = async (opts: {config: string, code: string}) => {
  const conf = config.load(path.resolve(process.cwd(), opts.config));
  if(conf.extra_locales_dirs == null || conf.extra_locales_dirs.length === 0) {
    console.error(chalk.red(`> You must add a directory to ${chalk.yellow("config.extra_locale_dirs")} before running this`))
    return process.exit(1);
  }

  const dir = conf.extra_locales_dirs[0];
  await mkdirp(dir);
  const file = path.join(dir, opts.code + ".json");
  if(fs.existsSync(file)) {
    console.log(chalk.red(`> Aborting: file ${chalk.yellow(file)} already exists`))
    return process.exit(1);
  }

  fs.writeFileSync(file, JSON.stringify(base, null, 2));
  console.log("> locale file created into " + chalk.yellow(file));
}

cmd.version(pkg.version);

cmd.command("create-config")
  .description("create the default config.toml file")
  .option("-o --output <path>", "path to ouput file", "./config.toml")
  .action(createConfig)

cmd.command("start")
  .description("starts the webmail server")
  .option("-c --config <path>", "path to the config file", "./config.toml")
  .action(start);

cmd.command("create-locale")
    .description("creates a default locale file into `config.extra_locale_dirs.0/code.json`")
    .option("-c --config <path>", "path to the config file", "./config.toml")
    .option("--code <code>", "locale ISO code")
    .action(createLocale)

cmd.parse(process.argv);