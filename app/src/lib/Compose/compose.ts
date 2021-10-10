import Compose from "./Compose.svelte";

export type Draft = {
  key: number
  id: number
  mailbox: string,
  to: Address[]
  cc: Address[]
  bcc: Address[]
  subject: string
  text: string
  html: string
  files: MessageFile[]
  reference?: Reference
  [kShowBcc]: boolean,
  [kShowCc]: boolean
  [kSent]?: boolean
}

export type MessageFile<T = string | void> = {
  id: T
  filename: string
  contentType: string
  size: number
  [fileError]?: string
  [fileFile]?: File
  [fileState]?: "error" | "uploading" | "complete"
  [fileLoaded]?: number
}

export const fileFile = Symbol("draft-file-file");
export const fileState = Symbol("draft-file-state");
export const fileError = Symbol("draft-file-error");
export const fileLoaded = Symbol("draft-file-loaded");

export type Reference = {
  mailbox: string
  id: number
  action: "reply" | "replyAll" | "forward"
  attachments: boolean
}

export type Address = {
  name?: string
  address: string
};

export const baseDraft = {
  draft: true,
  to: [] as Address[],
  cc: [] as Address[],
  bcc: [] as Address[],
  subject: "",
  html: "",
  text: "",
  reference: void 0 as (Reference | void),
  files: void 0 as (string[] | void),
}

export const createMessageBody = (target: Partial<typeof baseDraft>) => {
  return Object.assign({}, baseDraft, target);
}


export const kShowBcc = Symbol("draft-show-cc");
export const kShowCc = Symbol("draft-show-cc");
export const kSent = Symbol("draft-sent");

import { crossfade, fly } from "svelte/transition";
import { _delete, _post } from "$lib/util";
import type { Mailbox, User } from "$lib/types";

export const [crossin, crossout] = crossfade({
  duration: 300,
  fallback: (node) => fly(node, { duration: 300, y: 20 }),
});

let compose: Compose | null = null;

export const getComposer = () => {
  if(compose == null) compose = new Compose({ target: document.body });
  return compose
} 

export const destroyComposer = () => {
  if(compose != null) {
    compose.$destroy();
    compose = null;
  }
}

export const save = async (draft: Draft) => {
  
  const { id, mailbox, key, files, ...json } = draft;
  
  const { message } = await _post(`/api/mailboxes/${draft.mailbox}/messages`, createMessageBody({ 
    ...json,
    files: files?.map(file => file.id).filter(Boolean) as string[],
  }));
  
  _delete(`/api/mailboxes/${mailbox}/messages/${id}`).catch(() => {})

  return message.id;
}

export const send = async (draft: Draft) => {
  const id = await save(draft);
  draft.id = id;
  await _post(`/api/mailboxes/${draft.mailbox}/messages/${draft.id}/submit`, {});
}

export const _blank = async (drafts: Mailbox) => {
  await getComposer().blank(drafts);
}

export const _reply = async (drafts: Mailbox, mailbox: Mailbox, id: number) => {
  await getComposer().reply(drafts, mailbox, id);
}

export const _replyAll = async (user: User, drafts: Mailbox, mailbox: Mailbox, id: number) => {
  await getComposer().replyAll(user, drafts, mailbox, id);
}

export const _forward = async (drafts: Mailbox, mailbox: Mailbox, id: number) => {
  await getComposer().forward(drafts, mailbox, id);
}

export const _open = async (mailbox: Mailbox, id: number) => {
  await getComposer().open(mailbox, id);
}