import cmd from "commander";
const pkg = require("../package.json");

import chalk from "chalk";
import fs from "fs";
import path from "path";

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

cmd.version(pkg.version);

cmd.command("create-config")
  .description("create the default config.toml file")
  .option("-o --output <path>", "path to ouput file", "./config.toml")
  .action(createConfig)

cmd.command("start")
  .description("starts the webmail server")
  .option("-c --config <path>", "path to the config file", "./config.toml")
  .action(start);

cmd.parse(process.argv);