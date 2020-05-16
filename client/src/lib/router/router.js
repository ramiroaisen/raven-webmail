import { writable } from "../../lib/store";
import { match as _match } from "path-to-regexp";
let preventers = new Set();
export const registerPreventer = (fn) => {
    preventers.add(fn);
    return () => {
        preventers.delete(fn);
    };
};
export const createRouter = (inp = {}, session = writable(null), { dev = true } = { dev: true }) => {
    //const log = dev ? console.log : () => {};
    const log = (...args) => { };
    const routes = [];
    const page = writable(null);
    const _render = writable(null);
    const hash = writable(location.hash);
    const preloading = writable(false);
    preloading.subscribe(v => console.log("preloading", v));
    const add = (url, get) => {
        routes.push({
            get,
            match: _match(url)
        });
    };
    for (const [path, component] of Object.entries(inp)) {
        add(path, component);
    }
    const match = (path) => {
        for (const route of routes) {
            const match = route.match(path);
            if (match) {
                return {
                    params: match.params,
                    get: route.get,
                };
            }
        }
        return null;
    };
    const start = () => new Promise(resolve => {
        hash.subscribe(async () => {
            console.log("[ROUTER] [HASHCHANGE]", location.hash);
            preloading.set(true);
            const h = location.hash;
            const hash = h.replace(/^#!?\//, "/") || "/";
            const url = new URL(hash, location.href);
            const path = url.pathname;
            const query = Object.create(null);
            const host = url.host;
            url.searchParams.forEach(([key, value]) => {
                if (query[key] == null) {
                    query[key] = value;
                }
                else if (query[key] instanceof Array) {
                    query[key].push(value);
                }
                else {
                    query[key] = [query[key], value];
                }
            });
            const m = match(path);
            for (const route of routes) {
                const m = route.match(path);
                if (!m)
                    continue;
                const { params } = m;
                const { get } = route;
                const { preload, default: component } = await get();
                let args = params;
                if (preload) {
                    let redirected = false;
                    let errored = false;
                    let errorArgs;
                    let nexted = false;
                    const redirect = (code, url) => {
                        redirected = true;
                        log("[ROUTER] [REDIRECT] ", code, url);
                        // if no url then code is string (url)
                        location.replace(url || String(code));
                    };
                    const error = (args) => {
                        errored = true;
                        log(["[ROUTER] [HTTP ERROR]", args]);
                        errorArgs = args || {};
                    };
                    const next = () => {
                        nexted = true;
                        log(["[ROUTER] [NEXT]"]);
                    };
                    log("[ROUTER] [PRELOADING]", { path, host, params, query });
                    args = await preload.call({ redirect, error, next, fetch }, { path, host, params, query }, session.get());
                    if (redirected) {
                        return;
                    }
                    else if (errored) {
                        return;
                    }
                    else if (nexted) {
                        continue;
                    }
                    log("[ROUTER] [PRELOADED]", args);
                }
                preloading.set(false);
                page.set({ path, query, host, params });
                _render.set({ component, args });
                return resolve();
            }
            page.set({ path, query, host, params: {} });
            _render.set(null);
            resolve();
        });
        window.onhashchange = (event) => {
            for (const fn of preventers) {
                if (fn(event) === false) {
                    return;
                }
            }
            hash.set(location.hash);
        };
    });
    const link = (node) => {
        node.onclick = (event) => {
            if (event.defaultPrevented)
                return;
            if (event.ctrlKey)
                return;
            if (node.host !== location.host)
                return;
            else {
                event.preventDefault();
            }
        };
    };
    return { start, add, match, page, hash, _render, link, preloading };
};
