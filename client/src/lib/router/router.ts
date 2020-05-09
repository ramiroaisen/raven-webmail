import { Writable, Readable, readable, writable, readonly } from "../../lib/store";
import { match as _match } from "path-to-regexp";
import {SvelteComponent} from "*.svelte";
import {once} from "../util";

export type Component = {
  preload?: (page: Page, session: any) => any, 
  default: SvelteComponent
}

type Route = {
  get: () => Promise<Component>,
  match: (path: string) => {params: Record<string, string>}
}

export type Page = {
  params: Record<string, string>
  query: Record<string, string | string[]>
  path: string
  host: string
}

export type Match = {
  params: Record<string, string>
  get: () => Promise<Component>
}

let preventers = new Set<((event: HashChangeEvent) => boolean)>();
export const registerPreventer = (fn: (event: HashChangeEvent) => boolean) => {
  preventers.add(fn);
  return () => {
    preventers.delete(fn);
  }
}


export const createRouter = (inp: Record<string, () => Promise<Component>> = {}, session: Writable<any> = writable(null), {dev = true} = {dev: true}) => {
  
  //const log = dev ? console.log : () => {};
  const log = (...args: any[]) => {}

  const routes: Route[] = [];

  const page = writable<Page>(null as unknown as Page);
  
  const _render = writable<{component: SvelteComponent, args: Record<string, any>} | null>(null);

  const hash = writable<string>(location.hash);

  const add = (url: string, get: () => Promise<Component>) => {
    routes.push({
      get, 
      match: _match(url) as any
    })
  }

  for(const [path, component] of Object.entries(inp)) {
    add(path, component);
  }

  const match = (path: string): Match | null => {
    for(const route of routes) {
      const match = route.match(path);
      if (match) {
        return {
          params: match.params,
          get: route.get,
        }
      }
    }

    return null;
  }

  const start = () => new Promise(resolve => {

    hash.subscribe(async () => {
      
      console.log("[ROUTER] [HASHCHANGE]", location.hash);

      const h = location.hash;
      const hash = h.replace(/^#!?\//, "/") || "/";
      const url = new URL(hash, location.href);
      
      const path = url.pathname;
      const query: Record<string, string | string[]> = Object.create(null);
      const host = url.host;
    
      url.searchParams.forEach(([key, value]) => {
        if ( query[key] == null ) {
          query[key] = value;
        } else if (query[key] instanceof Array) {
          (query[key] as string[]).push(value);
        } else {
          query[key] = [query[key] as string, value];
        }
      })

      const m = match(path);
    
      for (const route of routes) {
        const m = route.match(path);
        if (!m) continue;

        const {params} = m;
        const {get} = route;

        const {preload, default: component} = await get();
        let args = params;

        if (preload) {
          
          let redirected = false;
          let errored = false;
          let errorArgs;
          let nexted = false;

          const redirect = (code: number | string, url?: string) => {
            redirected = true;
            log("[ROUTER] [REDIRECT] ", code, url);
            // if no url then code is string (url)
            location.replace(url || String(code));
          };

          const error = (args: any) => {
            errored = true;
            log(["[ROUTER] [HTTP ERROR]", args]);
            errorArgs = args || {};
          };

          const next = () => {
            nexted = true;
            log(["[ROUTER] [NEXT]"]);
          }

          log("[ROUTER] [PRELOADING]", {path, host, params, query});
          args = await preload.call({redirect, error, next, fetch}, {path, host, params, query}, session.get());
          
          if (redirected) {
            return;
          } else if(errored) {
            return;
          } else if (nexted) {
            continue;
          }

          log("[ROUTER] [PRELOADED]", args)
        }

        page.set({ path, query, host, params })
        _render.set({component, args})
        return resolve();
      }
     
      page.set({ path, query, host, params: {} })
      _render.set(null);
    
      resolve();
    })

    window.onhashchange = (event: HashChangeEvent) => {
      for(const fn of preventers) {
        if(fn(event) === false) {
          return;
        }
      }
      hash.set(location.hash);
    }
  })

  const link = (node: HTMLAnchorElement) => {
    node.onclick = (event) =>  {
      if (event.defaultPrevented)
        return;
      if (event.ctrlKey)
        return;
      if (node.host !== location.host)
        return;
      
      else {
        event.preventDefault();

      }
    }
  }

  return {start, add, match, page, hash, _render, link}
}