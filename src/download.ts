import { Application, Request, Response } from "express";

import fetch from "node-fetch";
import * as http from "http";
import { Config } from "./config";

export const download = async (config: Config) => {
  const mod = (config.wildduck_api_url.startsWith("https") ? require("https") : require("http")) as typeof http;
  const agent = new mod.Agent({keepAlive: true});
  
  return async (req: Request, res: Response) => {
    const accessToken = req.session!.accessToken;
    if(!accessToken) {
      return res.send("You are not logged in :(") 
    }

    const url = config.wildduck_api_url + `/users/me/mailboxes/${req.params.mailbox}/messages/${req.params.message}/attachments/${req.params.attachment}`;

    fetch(url, {
      agent,
      headers: {
        "x-access-token": accessToken,
        "accept-encoding": ""
      }
    }).then(inc => {
      res.writeHead(inc.status, inc.statusText, {
        ...Object.fromEntries(inc.headers.entries() as any),
        "content-disposition": `attachment; filename="${encodeURIComponent(String(req.query.filename)) || "unnamed"}"`        
      })
      inc.body.pipe(res)      
    }).catch(err => {
      try {
        res.writeHead(500, {"content-type": "text/plain"})
        res.write("500 Internal server error\n" + err.message)
        res.end()
      } catch(e) {}
    })
  }
}