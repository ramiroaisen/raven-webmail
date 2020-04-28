import {assertType} from "typescript-is";
import toml from "toml"
import { readFileSync } from "fs";
import chalk from "chalk"; 

export type Config = {
  port: number
  base_url?: string
  secret_token: string
  wildduck_api_url: string
  wildduck_api_token: string
  mongodb_url: string
} & Ssl;

type Ssl = {
  ssl: false
} | {
  ssl: true,
  ssl_certificate: string,
  ssl_certificate_key: string
};

export const load = (filename: string): Config => {
  console.log("> loading config from", chalk.yellow(filename));
  try {
    const source = readFileSync(filename, "utf8");
    const config = assertType<Config>(toml.parse(source));
    return config;
  } catch(e) {
    console.error(chalk.red("Error loading config file: " + e.message))
    process.exit(1);
  }
}

