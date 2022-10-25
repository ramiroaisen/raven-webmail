import { Request, Response, NextFunction, Router } from "express"
import { assertType } from "typescript-is";
import { validate, handler, ApiError, pageHandler } from "./util";
import { authenticate, del, get, post, put, url, watch } from "./client";
import { json } from "body-parser";
import { Auth } from "./events";
import { StatusCodes } from "http-status-codes";
import fetch from "node-fetch";
import { DISPLAY_ERRORS } from "./env";
import qs from "qs";
import { Config } from "./config";
import * as i18n from "./i18n/i18n";
import { RAVEN_SIGNATURE_META_KEY } from "./metadata";

export const api = (config: Config) => {
  const api = Router();

  api.use(json());

  api.use(i18n.middleware(config));

  api.post("/login", handler(async (req, res) => {
    const { username, password } = validate(() => assertType<{ username: string, password: string }>(req.body));
    const v = await authenticate(username, password);
    req.session.authentication = v;
    req.session.save(() => {
      res.json({})
      Auth.dispatch({ sid: req.sessionID, username: v.username });
    })
  }))

  api.post("/logout", handler(async (req, res) => {
    req.session.authentication = null;
    req.session.save(() => {
      res.json({})
      Auth.dispatch({ sid: req.sessionID, username: null })
    })
  }))

  api.get("/auth", handler(async (req, res) => {

    res.type("text/event-stream");

    const send = (data: {username: string | null}) => {
      try {
        res.write("data: " + JSON.stringify(data) + "\n\n", () => {})
      } catch(e) {}
    }

    send({ username: req.session.authentication?.username || null })

    const off = Auth.on(event => {
      if(event.sid === req.sessionID) {
        send({ username: event.username });
      }
    })

    let keepalive = setInterval(() => {
      try {
        res.write(": keepalive\n\n", () => {})
      } catch(e) {}
    }, 5000)

    req.on("close", () => {
      clearInterval(keepalive);
      off();
    })
  }))

  api.get("/updates", handler(async (req, res) => {
    const stream = await watch(userId(req), token(req));
    res.type("text/event-stream");
    stream.pipe(res);
  }))

  api.put("/me", handler(async (req, res) => {
    const json = await put(`/users/${userId(req)}`, token(req), req.body);
    res.json(json);
  }))

  api.put("/signature", handler(async (req, res) => {
    const { html } = assertType<{ html: string }>(req.body);
    const body = { metaData: {[RAVEN_SIGNATURE_META_KEY]: html } };
    const json = await put(`/users/${userId(req)}`, token(req), body);
    res.json(json);
  }))

  api.get("/mailboxes", handler(async (req, res) => {
    const json = await get(`/users/${userId(req)}/mailboxes?counters=true`, token(req));
    res.json(json);
  }))

  api.post("/mailboxes", handler(async (req, res) => {
    const path = String(req.body?.path?.trim() || "");
    if(!path) throw new ApiError(StatusCodes.BAD_REQUEST, "'path' is required");
    const json = await post(`/users/${userId(req)}/mailboxes`, token(req), { path });
    res.json(json);
  }))

  api.delete("/mailboxes/:mailbox", handler(async (req, res) => {
    await del(`/users/${userId(req)}/mailboxes/${req.params.mailbox}`, token(req));
    res.json({});
  }))

  api.put("/mailboxes/:mailbox", handler(async (req, res) => {
    const json = await put(`/users/${userId(req)}/mailboxes/${req.params.mailbox}`, token(req), req.body);
    res.json(json);
  }))

  api.get("/mailboxes/:mailbox/messages", handler(async (req, res) => {
    const body = await get(`/users/${userId(req)}/mailboxes/${req.params.mailbox}/messages${query(req)}`, token(req));
    res.json(body);
  }))

  api.put("/mailboxes/:mailbox/messages", handler(async (req, res) => {
    const json = await put(`/users/${userId(req)}/mailboxes/${req.params.mailbox}/messages`, token(req), req.body);
    res.json(json);
  }))

  api.post("/mailboxes/:mailbox/messages", handler(async (req, res) => {
    const json = await post(`/users/${userId(req)}/mailboxes/${req.params.mailbox}/messages`, token(req), req.body);
    res.json(json);
  }))

  api.delete("/mailboxes/:mailbox/messages", handler(async (req, res) => {
    await del(`/users/${userId(req)}/mailboxes/${req.params.mailbox}/messages`, token(req));
    res.json({});
  }))

  api.get("/mailboxes/:mailbox/messages/:message", handler(async (req, res) => {
    const body = await get(`/users/${userId(req)}/mailboxes/${req.params.mailbox}/messages/${req.params.message}`, token(req));
    res.json(body);
  }))

  api.delete("/mailboxes/:mailbox/messages/:message", handler(async (req, res) => {
    const body = await del(`/users/${userId(req)}/mailboxes/${req.params.mailbox}/messages/${req.params.message}`, token(req));
    res.json(body);
  }))

  api.put("/mailboxes/:mailbox/messages/:message/flag", handler(async (req, res) => {
    const value = !!req.body.value;
    const body = await put(`/users/${userId(req)}/mailboxes/${req.params.mailbox}/messages`, token(req), {
      message: req.params.message,
      flagged: value,
    })

    res.json(body);
  }))

  api.post("/mailboxes/:mailbox/messages/:message/submit", handler(async (req, res) => {
    const body = await post(`/users/${userId(req)}/mailboxes/${req.params.mailbox}/messages/${req.params.message}/submit`, token(req), req.body);
    res.json(body);
  }))

  api.get("/mailboxes/:mailbox/messages/:message/attachments/:attachment", handler(async (req, res) => {
    const back = await fetch(url(`/users/${userId(req)}/mailboxes/${req.params.mailbox}/messages/${req.params.message}/attachments/${req.params.attachment}`), {
      headers: { "x-access-token": token(req) }
    }).catch(e => {
      throw new ApiError(502, DISPLAY_ERRORS ? String(e?.message) : "Bad Gateway");
    });

    if(back.ok) {
      const contentType = back.headers.get("content-type");
      const contentLength = back.headers.get("content-length");
      if(contentType) res.setHeader("content-type", contentType);
      if(contentLength) res.setHeader("content-length", contentLength);
      back.body.pipe(res)
    } else {
      res.status(back.status);
      res.end("Cannot GET attachment");
    }
  }));

  api.get("/search", pageHandler(async (req, res) => {
    const query = { ...req.query, limit: req.query.limit || "50" }; 
    const json = await get(`/users/${userId(req)}/search?${qs.stringify(query)}`, token(req));
    res.json(json)
  }))

  api.post("/storage", handler(async (req, res) => {
    const contentType = String(req.headers["content-type"] || "");
    const contentLength = String(req.headers["content-length"] || "");
    
    let headers: Record<string, string> = {
      "x-access-token": token(req),
    }

    contentType && (headers["content-type"] = contentType);
    contentLength && (headers["content-length"] = contentLength);

    const back = await fetch(url(`/users/${userId(req)}/storage${query(req)}`), {
      method: "POST",
      headers: headers,
      body: req,
    }).catch(e => {
      throw new ApiError(502, DISPLAY_ERRORS ? String(e?.message) : "Bad Gateway");
    })

    const json = await back.json().catch(e => {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Invalid JSON from backend");
    })

    if(json?.error) {
      throw new ApiError(back.ok ? 500 : back.status, String(json.error));
    }

    res.status(back.status).json(json);
  }))

  const pages = Router();
  
  api.use("/pages", pages);

  pages.get("/layout", pageHandler(async (req, res) => {
    const [user, boxes] = await Promise.all([
      get(`/users/${userId(req)}`, token(req)),
      get(`/users/${userId(req)}/mailboxes?counters=true`, token(req))
    ])

    return res.json({
      props: {
        user,
        mailboxes: boxes.results,
        username: req.session.authentication!.username
      },
      stuff: {
        user,
        mailboxes: boxes.results,
      }
    })
  }))

  pages.get("/me", pageHandler(async (req, res) => {
    const user = await get(`/users/${userId(req)}`, token(req));
    res.json({ props: { user }})
  }))

  pages.get("/signature", pageHandler(async (req, res) => {
    const user = await get(`/users/${userId(req)}`, token(req));
    res.json({ props: { user }})
  }))
  
  pages.get("/search", pageHandler(async (req, res) => {
    const query = { ...req.query, limit: req.query.limit || "50" }; 
    const props = await get(`/users/${userId(req)}/search?${qs.stringify(query)}`, token(req));
    res.json({ props })
  }))

  pages.get("/mailbox/:mailbox", pageHandler(async (req, res) => {
    
    const {limit = "50"} = req.query;

    const [ mailbox, messages ] = await Promise.all([
      get(`/users/${userId(req)}/mailboxes/${req.params.mailbox}`, token(req)),
      get(`/users/${userId(req)}/mailboxes/${req.params.mailbox}/messages?${qs.stringify({limit})}`, token(req))
    ])

    res.json({ props: { mailbox, messages }})
  }))

  pages.get("/mailbox/:mailbox/message/:message", pageHandler(async (req, res) => {
    
    const [ mailbox, message ] = await Promise.all([
      get(`/users/${userId(req)}/mailboxes/${req.params.mailbox}`, token(req)),
      get(`/users/${userId(req)}/mailboxes/${req.params.mailbox}/messages/${req.params.message}?markAsSeen=true`, token(req)) 
    ]);

    res.json({ props: { message, mailbox }})
  }))

  return api;
}

export const token = (req: Request): string => {
  if(req.session.authentication == null) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden");
  }

  return req.session.authentication.token;
}

export const userId = (req: Request): string => {
  if(req.session.authentication == null) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden");
  }

  return req.session.authentication.id;
}

export const query = (req: Request): string => {
  const i = req.url.indexOf("?");
  if(i === -1) {
    return "";
  } else {
    return req.url.slice(i);
  }
}

