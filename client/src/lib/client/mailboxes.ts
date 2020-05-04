import {get, post, put, del, watch} from "./client";
import {Writable, writable} from "../store";
import { Mailbox } from "../api";

export const inbox: Writable<Mailbox> = writable(null as unknown as Mailbox);
export const sent: Writable<Mailbox> = writable(null as unknown as Mailbox);
export const drafts: Writable<Mailbox> = writable(null as unknown as Mailbox);
export const trash: Writable<Mailbox> = writable(null as unknown as Mailbox);
export const junk: Writable<Mailbox> = writable(null as unknown as Mailbox);

export const all: Writable<Writable<Mailbox>[]> = writable([]as Writable<Mailbox>[]);
export const others: Writable<Writable<Mailbox>[]> = writable([] as Writable<Mailbox>[]);

let watching = false;

export const load = async () => {
  
  console.log("[WS] getting mailboxes");
  const res = await get<{results: Mailbox[]}>("/users/me/mailboxes?counters=true");
  
  console.log("[WS] mailboxes received");
  const mailboxes = res.results;

  const $all = [];
  const $others = [];

  for(const box of mailboxes) {
    //const store = writable(box);
    let store;
    switch(box.specialUse) {
      case "\\Sent":
        sent.set(box);
        store = sent;  
        break;
      case "\\Trash":
        trash.set(box);
        store = trash;
        break;
      case "\\Drafts":
        drafts.set(box);
        store = drafts;
        break;
      case "\\Junk":
        junk.set(box);
        store = junk;
        break;

      default: 
        if(box.path === "INBOX") {
          inbox.set(box);
          store = inbox;
        } else {
          store = writable(box);
          $others.push(store);
        }
    }

    $all.push(store as Writable<Mailbox>);
  }

  all.set($all);
  others.set($others);

  if(!watching) {
    watching = true;
    watch((event) => {
      if ( event.command === "COUNTERS" ) {
        const box = _get(event.mailbox);
        if ( box && box.get() ) {
          box.update(box => ({...box, total: event.total, unseen: event.unseen }) );
        }
      }
    })
  }
}

const _get = (id: string): Writable<Mailbox> | undefined => {
  return all.get().find(b => b.get().id === id)
}

export const createMailbox = async (path: string) => {
  await post("/users/me/mailboxes", {path});
  await load();
}

export {_get as get};