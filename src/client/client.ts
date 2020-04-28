import { Agent } from "http";
import fetch from "node-fetch";
import EventSource from "eventsource";

import http from "http";
import https from "https";

export type Error = {
  success: false
  code: string
  error: string
}

export type Response<T> = T | Error;

export type ClientOptions = {
  host: string
  agent?: Agent
  accessToken?: string
  apiToken: string
}

const agentOpts = {keepAlive: true};

const local = true;

const httpAgent = new http.Agent({keepAlive: true});
const httpsAgent = new https.Agent({keepAlive: true});

export type FetchOptions = {
  method: "GET" | "POST" | "DELETE" | "PUT"
  body: string
  headers: Record<string, string> 
}

export class Client {
  
  opts: ClientOptions

  constructor(opts: ClientOptions) {
    this.opts = Object.assign({}, opts) as Required<ClientOptions>;
    if(this.opts.agent == null) {
      this.opts.agent = opts.host.startsWith("https") ? httpsAgent : httpAgent;
    }
  }

  async fetch<T=any>(path: string, opts: Partial<FetchOptions> = {}): Promise<T> {
    const url = this.opts.host + path;

    opts.method = opts.method || "GET";

    opts.headers = opts.headers || {};
    opts.headers["Content-Type"] = "application/json";

    if (path === "/authenticate") {
      opts.headers!["x-access-token"] = this.opts.apiToken;
    } else if (this.opts.accessToken) {
      opts.headers!["x-access-token"] = this.opts.accessToken || "";
    }

    const json = await fetch(url, {...opts, agent: this.opts.agent}).then(res => res.json());
 
    if(!json.success){
      throw new Error(json.error || json.message);
    } else {
      return json;
    }
  }

  async login(username: string, password: string, scope?: string): Promise<any> {
    const json = await this.post("/authenticate", {
      username,
      password,
      token: true,
      scope
    });

    this.opts.accessToken = json.token;

    return json.token;
  }

  async get<T=any>(path: string): Promise<T> {
    return await this.fetch(path);
  }

  async post<T=any>(path: string, body: any): Promise<T> {
    return await this.fetch(path, {method: "POST", body: JSON.stringify(body)})
  }

  // (update)
  async put<T=any>(path: string, body: any): Promise<T> {
    return await this.fetch(path, {method: "PUT", body: JSON.stringify(body)})
  }

  async del<T=any>(path: string): Promise<T> {
    return await this.fetch(path, {method: "DELETE"})
  }

  watch(fn: (change: any) => void): () => void {
    const headers = this.opts.accessToken ? {"x-access-token": this.opts.accessToken} : {};
    const source = new EventSource(this.opts.host + "/users/me/updates", {headers});
    source.onmessage = (e) => fn(JSON.parse(e.data));
    return () => source.close();
  } 
}