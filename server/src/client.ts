import fetch, { RequestInit } from "node-fetch";
import { ApiError } from "./util";
import { StatusCodes } from "http-status-codes";
import { DISPLAY_ERRORS } from "./env";

export const url = (u: string) => {
  return __RAVEN__.config.wildduck_api_url.replace(/\/$/, "") + u;
}

const Requester = <Body>(method: string) => {
  return async (u: string, accessToken: string, body?: Body) => {
    
    const init: RequestInit = { method }

    if(body != null) {
      init.headers = {
        "x-access-token": accessToken,
        "content-type": "application/json",
      }

      init.body = JSON.stringify(body);
    } else {
      init.headers = { "x-access-token": accessToken }
    }

    const res = await fetch(url(u), init).catch(e => {
      throw new ApiError(StatusCodes.BAD_GATEWAY, DISPLAY_ERRORS ? String(e?.message) : "Bad Gateway");
    })

    if(res.status === StatusCodes.FORBIDDEN) {
      throw new ApiError(StatusCodes.FORBIDDEN, "The session has expired");
    }

    const json = await res.json().catch(e => {
      throw new ApiError(StatusCodes.BAD_GATEWAY, "Invalid JSON from backend");
    })

    if(json?.error) {
      throw new ApiError(res.ok ? StatusCodes.INTERNAL_SERVER_ERROR : res.status, String(json.error))
    }

    return json;
  }
}

export const get = Requester<void>("GET");
export const del = Requester<void>("DELETE");
export const post = Requester<any>("POST");
export const put = Requester<any>("PUT");

export type Authentication = {
  success: boolean
  id: string
  username: string
  scope: string
  require2fa: string[]
  requirePasswordChange: boolean
  token: string
}

export const authenticate = async (username: string, password: string): Promise<Authentication> => {
  const res = await fetch(url("/authenticate"), {
    method: "POST",
    headers: { 
      "content-type": "application/json",
      "x-access-token": __RAVEN__.config.wildduck_api_token,
    },
    body: JSON.stringify({
      token: true,
      scope: "master",
      username,
      password,
    })
  }).catch(e => {
    throw new ApiError(StatusCodes.BAD_GATEWAY, DISPLAY_ERRORS ? String(e?.message) : "Bad Gateway");
  })

  const json: any = await res.json().catch(e => {
    throw new ApiError(StatusCodes.BAD_GATEWAY, "Invalid JSON body from backend")
  });

  if(json?.error) {
    throw new ApiError(res.ok ? StatusCodes.INTERNAL_SERVER_ERROR : res.status, String(json.error));
  }

  return json;
}

export const watch = async (userId: string, accessToken: string): Promise<NodeJS.ReadableStream> => {
  const res = await fetch(url(`/users/${userId}/updates`), {
    headers: { "x-access-token": accessToken },
  }).catch(e => {
    throw new ApiError(502, DISPLAY_ERRORS ? String(e?.message) : "Bad Gateway");
  })

  if(res.ok) {
    return res.body;
  }

  if(res.status === StatusCodes.FORBIDDEN) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Session has expired");
  }

  const json = await res.json().catch(() => {
    throw new ApiError(502, "Invalid JSON body from backend");
  })

  throw new ApiError(res.status, String(json?.error || "JSON error without message"));
}