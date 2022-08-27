import { Router } from "express"
import fetch, { Headers, Response } from "node-fetch";

export const sveltekitDevProxy = (port: number) => {
  
  const proxy = Router();
  
  proxy.use(async (req, res, next) => {

    try {

      const reqHeaders = new Headers();
  
      for(const [key, value] of Object.entries(req.headers)) {
        if(typeof value === "string") {
          reqHeaders.append(key, value);
        } else if (value) {
          for(const item of value) {
            reqHeaders.append(key, item);
          }
        }
      }

      let back: Response;
      const url = `http://127.0.0.1:${port}${req.url}`;
      if(req.method === "GET" || req.method === "HEAD" || req.method === "DELETE") {
        back = await fetch(url, {
          method: req.method,
          headers: reqHeaders
        })
      } else {
        back = await fetch(url, {
          method: req.method,
          headers: reqHeaders,
          body: req
        })
      }

      const resHeaders: Record<string, string | string[]> = {};
      for(const [key, value] of back.headers) {
        if(value.includes(",")) {
          resHeaders[key] = value.split(",");
        } else {
          resHeaders[key] = value;
        }
      }

      res.writeHead(back.status, resHeaders);
      back.body.pipe(res);

    } catch(e) {
      next(e);
    }
  })

  return proxy;
}