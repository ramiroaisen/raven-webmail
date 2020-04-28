"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const eventsource_1 = __importDefault(require("eventsource"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const root = "45887645c2ce2d1d7230b6c75bd953a64fd3f221";
const agentOpts = { keepAlive: true };
const local = true;
const httpAgent = new http_1.default.Agent({ keepAlive: true });
const httpsAgent = new https_1.default.Agent({ keepAlive: true });
/*
type Sub = Pick<Client, "get" | "post" | "put" | "del">
const sub = (client: Client, base: string): Sub => {
  const get = (path: string) => client.get(base);
  const post = (path: string, body: any) => client.post(base + path, body);
  const put = (path: string, body: any) => client.put(base + path, body);
  const del = (path: string) => client.del(base + path)
  return {get, post, put, del};
}
*/
class Client {
    constructor(opts) {
        this.opts = Object.assign({}, opts);
        if (this.opts.agent == null) {
            this.opts.agent = opts.host.startsWith("https") ? httpsAgent : httpAgent;
        }
    }
    async fetch(path, opts = {}) {
        const url = this.opts.host + path;
        opts.method = opts.method || "GET";
        opts.headers = opts.headers || {};
        opts.headers["Content-Type"] = "application/json";
        if (path === "/authenticate") {
            opts.headers["x-access-token"] = "QE9yaW1hcjEyMw==";
        }
        else if (this.opts.accessToken) {
            opts.headers["x-access-token"] = this.opts.accessToken;
        }
        const json = await node_fetch_1.default(url, { ...opts, agent: this.opts.agent }).then(res => res.json());
        if (!json.success) {
            throw new Error(json.error || json.message);
        }
        else {
            return json;
        }
    }
    async login(username, password, scope) {
        const json = await this.post("/authenticate", {
            username,
            password,
            token: true,
            scope
        });
        this.opts.accessToken = json.token;
        return json.token;
    }
    async get(path) {
        return await this.fetch(path);
    }
    async post(path, body) {
        return await this.fetch(path, { method: "POST", body: JSON.stringify(body) });
    }
    // (update)
    async put(path, body) {
        return await this.fetch(path, { method: "PUT", body: JSON.stringify(body) });
    }
    async del(path) {
        return await this.fetch(path, { method: "DELETE" });
    }
    watch(fn) {
        const headers = this.opts.accessToken ? { "x-access-token": this.opts.accessToken } : {};
        const source = new eventsource_1.default(this.opts.host + "/users/me/updates", { headers });
        source.onmessage = (e) => fn(JSON.parse(e.data));
        return () => source.close();
    }
}
exports.Client = Client;
