import type { Mailbox } from "$lib/types";

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const mailboxName = (mailbox: Mailbox) => {
  const l = get(locale);
  if(mailbox.path === "INBOX") return l.mailboxes.Inbox;
  if(mailbox.specialUse === "\\Junk") return l.mailboxes.Spam;
  if(mailbox.specialUse === "\\Sent") return l.mailboxes.Sent;
  if(mailbox.specialUse === "\\Drafts") return l.mailboxes.Drafts;
  if(mailbox.specialUse === "\\Trash") return l.mailboxes.Trash;
  return mailbox.name;
}

import Inbox from "svelte-material-icons/InboxOutline.svelte";
import Trash from "svelte-material-icons/DeleteOutline.svelte";
import Sent from "svelte-material-icons/SendOutline.svelte";
import Junk from "svelte-material-icons/AlertDecagramOutline.svelte";
import Drafts from "svelte-material-icons/FileDocumentEditOutline.svelte";
import Other from "svelte-material-icons/FolderOutline.svelte";

export const mailboxIcon = (mailbox: Mailbox) => {
  if(mailbox.path === "INBOX") return Inbox;
  if(mailbox.specialUse === "\\Junk") return Junk;
  if(mailbox.specialUse === "\\Sent") return Sent;
  if(mailbox.specialUse === "\\Drafts") return Drafts;
  if(mailbox.specialUse === "\\Trash") return Trash;
  return Other;
}

export const mailboxIsDeletable = (mailbox: Mailbox) => {
  if(mailbox.path === "INBOX") return false;
  if(mailbox.specialUse != null) return false;
  return true;
}

export const isInbox = (mailbox: Mailbox) => mailbox.path === "INBOX";
export const isJunk = (mailbox: Mailbox) => mailbox.specialUse === "\\Junk";
export const isSent = (mailbox: Mailbox) => mailbox.specialUse === "\\Sent";
export const isDrafts = (mailbox: Mailbox) => mailbox.specialUse === "\\Drafts";
export const isTrash = (mailbox: Mailbox) => mailbox.specialUse === "\\Trash";

export const sortMailboxes = (mailboxes: Mailbox[]): Mailbox[] => {
  const inbox = mailboxes.find(isInbox)!;
  const drafts = mailboxes.find(isDrafts)!; 
  const sent = mailboxes.find(isSent)!; 
  const junk = mailboxes.find(isJunk)!;
  const trash = mailboxes.find(isTrash)!;

  const folders = mailboxes.filter(item => !isInbox(item) && item.specialUse == null);
  
  const res: Mailbox[] = [
    inbox, ...folders, drafts, sent, junk, trash,
  ].filter(Boolean);

  for(const item of mailboxes) {
    if(!res.includes(item)) res.push(item);
  }

  return res;
}


import type { Load } from "@sveltejs/kit";
import { browser } from "$app/env";

export const getPage: Load = async ({page,  fetch, session}) => {
  
  let query = page.query?.toString() || "";
  query = query ? `?${query}` : "";

  const pathAndQuery = typeof page === "string" ? page : `/api/pages${page.path}${query}`;
  
  if(browser) {
    const res = await fetch(pathAndQuery);
    return await res.json();
  }
  
  const headers: HeaderInit = {};
  const url = `http://raven${pathAndQuery}`;

  const data = sessMap.get(session) || {};
  
  if(data.cookie) {
    headers.cookie = data.cookie;
  }

  if(data.userAgent) {
    headers["user-agent"] = data.userAgent;
  }
  
  const res = await fetch(url, { headers });
  const body: any = await res.json();
  
  const cookieStr = res.headers.get("set-cookie");
  if(!cookieStr) return body;
  
  const cookies = cookieStr.split(",").map(item => item.trim());
  if(cookies.length === 0) return body;
  
  return {
    ...(body || {}),
    headers: {
      ...(body?.headers || {}),
      "set-cookie": cookies,
    }
  }
}


export const action = <A extends any[], T>(fn: (...args: A) => T | Promise<T>) => {
  return async (...args: A) => {
    try {
      return await fn(...args)
    } catch(e: any) {
      // @ts-ignore
      _error(e?.message || "Error");
    }
  }
}

export const _get = async (url: string) => {
  const res = await fetch(url).catch(e => {
    throw new HttpError(500, "Cannot connect to server");
  })

  const json = await res.json().catch(e => {
    throw new HttpError(res.status, "Invalid JSON response from server");
  })

  if(json.error) {
    throw new HttpError(res.status, json.error.message);
  }

  return json;
}

export const _delete = async (url: string) => {
  const res = await fetch(url, {
    method: "DELETE",
  }).catch(e => {
    throw new HttpError(500, "Cannot connect to server");
  })

  const json = await res.json().catch(e => {
    throw new HttpError(res.status, "Invalid JSON response from server");
  })

  if(json.error) {
    throw new HttpError(res.status, json.error.message);
  }

  return json;
}

export const _post = async (url: string, body: any) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  }).catch(e => {
    throw new HttpError(500, "Cannot connect to server");
  })

  const json = await res.json().catch(e => {
    throw new HttpError(res.status, "Invalid JSON response from server");
  })

  if(json.error) {
    throw new HttpError(res.status, json.error.message);
  }

  return json;
}

export const _put = async (url: string, body: any) => {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  }).catch(e => {
    throw new HttpError(500, "Cannot connect to server");
  })

  const json = await res.json().catch(e => {
    throw new HttpError(res.status, "Invalid JSON response from server");
  })

  if(json.error) {
    throw new HttpError(res.status, json.error.message);
  }

  return json;
}

export const isMail = (str: string): boolean => /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i.test(str);

import { add } from "./actions";

const currentUid = () => `${Number(history.state?.id) || 0}-${location.pathname}${location.search}`;

export const ScrollRestoration = () => {
  
  const map = new Map<string, {x: number, y: number}>();

  return (node: HTMLElement) => {
    const key = currentUid();
    const scroll = map.get(key);
    if(scroll) {
      node.scrollTop = scroll.y;
      node.scrollLeft = scroll.x;
    }
    
    let x = node.scrollLeft;
    let y = node.scrollTop;
  
    const remove = add(node, "scroll", () => {
      x = node.scrollLeft;
      y = node.scrollTop;
      map.set(currentUid(), { x, y });
    }, { passive: true })

    return {
      destroy() {
        remove();
      }
    }
  }
}

export const isNarrow = () => {
  return window.matchMedia("(max-width: 800px)").matches;
}

export const isWide = () => {
  return window.matchMedia("not all and (max-width: 800px)").matches;
}

import { goto } from "$app/navigation";
import type { HeaderInit } from "node-fetch";
import { sessMap } from  "../sessMap";
import { _error } from "./Notify/notify";
import { get } from "svelte/store";
import { locale } from "./locale";

export const watchAuth = (username: string | null) => {
  const stream = new EventSource("/api/auth");
  stream.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if(data.username !== username) {
      username = data.username;
      if(username == null) {
        goto("/login");
      } else {
        goto("/");
      }
    }
  }

  return () => stream.close();
}

const p = (n: number) => n.toString().padStart(2, "0");

export const messageDate = (d: Date | string) => {
  
  const l = get(locale);

  const now = new Date();
  const date = new Date(d);

  if(now.getFullYear() !== date.getFullYear())
    return `${l.month[date.getMonth()]} ${date.getFullYear()}`
  
  if(now.getMonth() !== date.getMonth())
    return `${date.getDate()} ${l.month[date.getMonth()]}`;

  if(now.getDate() !== date.getDate()){
    return `${l.week[date.getDay()]} ${date.getDate()}`;
  }

  return `${date.getHours()}:${p(date.getMinutes())}`;
}


export const clone = <T>(src: T): T => {
  
  // @ts-ignore
  if(src instanceof Date) return new Date(src); 

  if(src instanceof Array) {
    // @ts-ignore
    return src.map(clone);
  }

  if(typeof src === "object" && src !== null) {
    const target = {};
    for(const key of Object.keys(src)) {
      // @ts-ignore
      target[key] = clone(src[key]);
    }

    // @ts-ignore
    return target;
  }

  return src;
}


export const equals = (src: any, target: any): boolean => {
  
  if(src instanceof Date && target instanceof Date) {
    return +src === +target;
  }

  if(src instanceof Array) {
    
    if(!(target instanceof Array)) return false;
    
    if(src.length !== target.length) return false;
    
    for(let i = 0; i < src.length; i++) {
      if(!equals(src[i], target[i])) return false;
    }
    
    return true;
  }

  if(typeof src === "object" && src !== null) {
    
    if(!(typeof target === "object" && target !== null)) return false;
    
    if(Object.keys(src).length !== Object.keys(target).length) return false;
    
    for(const key of Object.keys(src)) {
      if(!equals(src[key], target[key])) return false;
    }
    
    return true;
  }

  return src === target;
}