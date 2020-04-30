import path from "path";
import http from "http";
import https from "https";

import chalk from "chalk";

import express, { Request, Response, NextFunction } from "express";

import serve from "serve-static";

import morgan from "morgan";
import helmet from "helmet";

import body from "body-parser";

import { ws } from "./client/ws";
import { auth } from "./auth";
import { i18n } from "./i18n/i18n";
import { session } from "./session";
import { upload } from "./upload";
import { readFileSync } from "fs";
import compression from "compression";

import {Config} from "./config";
import { download } from "./download";

export const start = async (config: Config) => {
  const dev = process.env.NODE_ENV === 'development';
  const app = express();

  let server: http.Server | https.Server;
  if(config.ssl) {
    try {
      const cert = readFileSync(config.ssl_certificate)
      const key = readFileSync(config.ssl_certificate_key);
      server = https.createServer({key, cert}, app);
    } catch(e) {
      console.error(chalk.red("Error loading ssl cert and key:"), chalk.yellow(e.message));
      return process.exit(1);
    }
  } else {
    server = http.createServer({}, app);
  }

  const sess = session(config);
  ws(server, config, sess);

  dev && app.use(morgan("dev"));
  
  app.use(helmet());
  app.use(compression())

  app.use(i18n(config));

  const template = readFileSync(path.resolve(__dirname, "../client/template.html"), "utf8");

  app.get("/", (req: Request, res: Response) => {
    res.header("content-type", "text/html");
    res.header("vary", "accept-language");

    const vars = {
      lang: req.lang,
      locale: req.locale,
    };

    const json = (vars: any) => `JSON.parse(${JSON.stringify(JSON.stringify(vars)).replace(/<\//g, "<\\/")})`;
    const scripts = `<script>__RAVEN__=${json(vars)};</script>`;


    res.end(template.replace("%raven.scripts%", scripts));
  })

  app.use(serve(path.resolve(__dirname, "../client/public")));

  app.use(body.json());
  app.use(sess);
  app.use(auth(config));

  app.post("/upload", await upload(config));
  app.get("/download/:mailbox/:message/:attachment", await download(config));

  server.listen(config.port, () => {
    console.log(`> http${config.ssl ? "s" : ""} server listening on port ${chalk.yellow(config.port)}`);
  });
}