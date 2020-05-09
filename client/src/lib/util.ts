import { Mailbox } from "./api";

export type DePromise<T> = T extends PromiseLike<infer U> ? U : T;

// Icons and labels
import {SvelteComponent} from "*.svelte";

import Inbox from "svelte-material-icons/InboxOutline.svelte";
import Trash from "svelte-material-icons/DeleteOutline.svelte";
import Sent from "svelte-material-icons/SendOutline.svelte";
import Junk from "svelte-material-icons/AlertDecagramOutline.svelte";
import Drafts from "svelte-material-icons/FileDocumentEditOutline.svelte";
import Other from "svelte-material-icons/FolderOutline.svelte";

type id = "inbox" | "drafts" | "junk" | "sent" | "trash";
const inbox = ["inbox", Inbox] as [id, SvelteComponent];

const map: Record<string, [id, SvelteComponent]> = {
  "\\Drafts": ["drafts", Drafts],
  "\\Junk": ["junk", Junk],
  "\\Sent": ["sent", Sent],
  "\\Trash": ["trash", Trash]
}

export type Meta = {label: string, icon: SvelteComponent};

export const mailboxMeta = (mailbox: Mailbox, labels: Record<id, string>): Meta => {

  if (mailbox.path === "INBOX") {
    const [id, icon] = inbox;
    return {label: labels[id], icon};

  } else if (mailbox.specialUse && map[mailbox.specialUse] !== null) {
    const [id, icon] = map[mailbox.specialUse];
    return {label: labels[id], icon}

  } else {
    return {label: mailbox.name, icon: Other};
  }
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const tick = () => sleep(0);

export const once = <T extends (this: any, ...args: any[]) => any>(fn: T): T => {
    let called = false;
    return (function(this: any, ...args: any[]): any {
        if(called)
            return;
        called = true;
        return fn.call(this, ...args);
    }) as T;
}