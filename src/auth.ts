import { Application, Request, Router } from "express";
import { Client } from "./client/client";
import { Config } from "./config";

export interface User {}

export const auth = (config: Config) => {

  const router = Router();

  router.get("/logout", (req: Request, res) => {
    req.session!.accessToken = null;
    res.redirect(302, "/");
  })

  router.post("/login", async (req: Request, res) => {
    const username = req.body.username || "";
    const password = req.body.password || "";
    const client = new Client({apiToken: config.wildduck_api_token, host: config.wildduck_api_url});

    try {
      const token = await client.login(username, password);
      req.session!.accessToken = token;
      res.json({success: true});

    } catch (e) {
      res.json({error: {message: e.message}});
    }
  })

  return router;

}