import {Incomming as Outgoing, Outgoing as Incomming} from "../../../../server/src/client/io";
import {User, Message, Mailbox} from "../api";
import { writable, Writable } from "../store";
import * as mailboxes from "./mailboxes";

export type Resolver = (arg: Incomming.Resolve["arg"]) => void;
export type Rejecter = (error: {message: string}) => void; 
export type Callback = (arg: any) => void

let _uid = 0;
const uid = () => ++_uid;

const callbacks = new Map<number, Callback>();
const awaiters = new Map<number, [Resolver, Rejecter | null | undefined]>();

export const user = writable<User | null>(null);

const ws = new Promise<WebSocket>((resolve, reject) => {
  const url = new URL("/ws", location.href);
  url.protocol = location.protocol.replace("http", "ws");
  
  console.log("[WS] connecting")
  const ws = new WebSocket(url.href);
  
  ws.onerror = reject;
  
  ws.onopen = () => {
    console.log("[WS] open");
    setInterval(() => send({id: uid(), type: "ping"}), 30_000) 
  }
  
  ws.onmessage = (m) => {
    
    console.log("[WS] first message received");
    
    const {user: $user} = JSON.parse(m.data);
    
    user.set($user);
    
    ws.onmessage = m => {
      const msg = JSON.parse(m.data) as Incomming.Message;
      switch(msg.type){
        case "resolve":
          const awaiter = awaiters.get(msg.replyTo);
          if(awaiter == null){
            console.warn("[Mailer] Call resolve to empty awaiter");
          } else {
            const [resolve] = awaiter;
            resolve(msg.arg);
          }
          awaiters.delete(msg.replyTo);
          break;
        
        case "call":
          const fn = callbacks.get(msg.callId);
          if(fn == null) {
            console.warn("[Mailer] Call call to empty callback");
          } else {
            fn(msg.arg);
          }
          break;

        case "reject":
          const aw = awaiters.get(msg.replyTo);
          if(aw == null || aw[1] == null){
            console.warn("[Mailer] Call reject to empty awaiter");
          } else {
            const [_, reject] = aw;
            reject({message: msg.message})
          }
          awaiters.delete(msg.replyTo);
          break;

        case "error":
          console.warn(`[Mailer] Error from backend: ${msg.message}`);
          break;

        case "ping":
          send({id: uid(), type: "pong", replyTo: msg.id});
          break;

        case "pong":
          const aws = awaiters.get(msg.replyTo);
          if(aws != null){
            const [resolve] = aws;
            resolve(null)
            awaiters.delete(msg.replyTo);
          } else {
            console.warn("[Mailer] Call pong to empty receiver");
          }
          break;
      }
    }

    resolve(ws);
  }
})

export const ready = ws.then(() =>  void 0);

export const send = async <T>(msg: Outgoing.Message) => {

  switch (msg.type) {
    case "get":
    case "post":
    case "put":
    case "del":
      console.log(`[${msg.type.toUpperCase()}] ${msg.path}`, (msg as any).body || "");
  }

  const log = (resolve: Resolver) => {
    return (reply: any) => {
      console.log("[RESOLVE]", reply);
      resolve(reply);
    }
  } 

  (await ws).send(JSON.stringify(msg))
  return {
    then: (resolve: Resolver, reject?: Rejecter | null) => {
      awaiters.set(msg.id, [log(resolve), reject])
    }
  } as Promise<T>
}

export const login = async ({username, password}: {username: string, password: string}, goto = "/"): Promise<User> => {
  const json = await fetch("/login", {
    method: "POST",
    headers: {"content-type": "application/json"},
    body: JSON.stringify({username, password})
  }).then(res => res.json());

  if (json.error) {
    throw new Error(json.error.message);
  }

  location.assign(goto);

  return json;
}

export const logout = async () => {
  location.assign("/logout");
}

export const get = async <T>(path: string): Promise<T> => {
  return send({id: uid(), type: "get", path}) 
}
      
export const post = async <T>(path: string, body: Record<string, any>): Promise<T> => {
  return send({id: uid(), type: "post", path, body}) 
}

export const put = async <T>(path: string, body: Record<string, any>): Promise<T> => {
  return send({id: uid(), type: "put", path, body}) 
}

export const del = async <T>(path: string): Promise<T> => {
  return send({id: uid(), type: "del", path}) 
}

const watchers = new Set<(change: any) => void>();
let watching = false;

export const watch = async (fn: (change: any) => void) => {
  watchers.add(fn);
  
  if(!watching) {
    watching = true;
    
    const onChange = (change: any) => {
      console.log("[CHANGE]", change);
      for(const fn of watchers){
        fn(change);
      }
    }

    const callbackId = uid();
    callbacks.set(callbackId, onChange);
    send({id: uid(), type: "watch", callbackId})
  }

  return () => {
    watchers.delete(fn);
  }
}