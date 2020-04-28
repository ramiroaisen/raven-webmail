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

const inbox = {label: "Recibidos", icon: Inbox};

const map = {
  "\\Drafts": {label: "Borradores", icon: Drafts},
  "\\Junk": {label: "Spam", icon: Junk},
  "\\Sent": {label: "Enviados", icon: Sent},
  "\\Trash": {label: "Papelera", icon: Trash}
}

export type Meta = {label: string, icon: SvelteComponent};

export const mailboxMeta = (mailbox: Mailbox): Meta => {
  return mailbox.path === "INBOX" ? inbox :
    mailbox.specialUse && map[mailbox.specialUse as keyof typeof map] || {label: mailbox.name, icon: Other};
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const tick = () => sleep(0);