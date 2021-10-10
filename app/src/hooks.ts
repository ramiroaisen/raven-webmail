const port = String(process.env.RAVEN_API_PORT || global.__RAVEN__?.config?.port || "8635");
const proto = process.env.RAVEN_API_PROTO || (global.__RAVEN__?.config?.ssl ? "https" : "http");

import { HttpError } from "$lib/util";
import type { ExternalFetch, GetSession, Handle } from "@sveltejs/kit";
import { sessMap } from "./sessMap";

import { prerendering } from "$app/env";

export const getSession: GetSession = async ({ locals })  => {
  
  // sveltekit crash if it cannot get session but we do not prerender anything
  if(prerendering) {
    return {};
  }

  const data = { cookie: locals.cookie, userAgent: locals.userAgent };
  
  const { lang, locale } = await fetch(`${proto}://localhost:${port}/api/locale`, {
    headers: { "accept-language": locals.acceptLanguage || "" }
  }).catch(e => { 
    throw new HttpError(502, "Cannot connect to backend") 
  }).then(res => {
    if(!res.ok) throw new HttpError(502, "Cannot get session, invalid response status code");
    return res.json()
  }).catch(e => { 
    throw new HttpError(502, "Cannot get session, invalid JSON from backend") 
  })

  const session = { lang, locale };
  sessMap.set(session, data);
  return session;
}

export const handle: Handle = async ({ request, resolve }) => {
  request.locals.cookie = request.headers.cookie;
  request.locals.userAgent = request.headers["user-agent"];
  request.locals.acceptLanguage = request.headers["accept-language"];
  return resolve(request);
}

export const externalFetch: ExternalFetch = async (request): Promise<Response> => {
  const url = new URL(request.url);
  if(url.hostname === "raven") {
    url.protocol = proto;
    url.hostname = "localhost";
    url.port = port;
    request = new Request(
      url.href,
      request,
    )
  }

  return await fetch(request);
}