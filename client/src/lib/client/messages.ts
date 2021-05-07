import {Message} from "../api"
import {get, post, put, del, user} from "./client";
import {junk, inbox, trash, drafts} from "./mailboxes";
import s from "html-escape";
import { regexpToFunction } from "path-to-regexp";
import { sanitize } from "../sanitize";
import { mailboxMeta } from "../util";

const _get = async (mailboxId: string, messageId: number, markAsSeen = true): Promise<Message> => {
  return await get(`/users/me/mailboxes/${mailboxId}/messages/${messageId}${markAsSeen ? `?markAsSeen=true` : ""}`);
}

export {_get as get}


export const list = async (from: string): Promise<any> => {
  console.log("[WS] listing messages", from);
  
  const {
    nextCursor, previousCursor, results
  } = await get(`/users/me/mailboxes/${from}/messages`);
  
  console.log("[WS] messages received");

  return {next: nextCursor, prev: previousCursor, messages: results};
}

 
export const flag = async (mailboxId: string, messages: number[], value: boolean): Promise<any> => {
  return await put(`/users/me/mailboxes/${mailboxId}/messages`, {
    message: messages.join(","),
    flagged: value
  })
}

export const markAsSpam = async (from: string, messages: number[], value: boolean): Promise<any> => {
  
  const junkId = junk.get().id;
  const inboxId = inbox.get().id;

  if ( value ) {
    if ( from === junkId ) { 
      throw new Error("The messages are already in Junk folder");
    }

    return await moveTo(from, messages, junkId)
  
  } else {
    if ( from !== junkId ) {
      throw new Error("To unmark as spam the must be in the Junk folder");
    }

    return await moveTo(from, messages, inboxId)
  }
}

export const updateSeen = async (from: string, messages: number[], value: boolean): Promise<any> => {
  return await put(`/users/me/mailboxes/${from}/messages`, {
    message: messages.join(","),
    seen: value
  })
}



export const moveTo = async (from: string, messages: number[], to: string): Promise<any> => {
  if(from === to) {
    throw new Error("messages.moveTo 'from' and 'to' are the same mailbox")
  }

  return await put(`/users/me/mailboxes/${from}/messages`, {
    message: messages.join(','),
    moveTo: to
  })
}


export const next = async (from: string, cursor: string): Promise<any> => {
  const {
    nextCursor, previousCursor, results
  } = await get(`/users/me/mailboxes/${from}/messages?next=${cursor}`);
  
  return {next: nextCursor, prev: previousCursor, messages: results};
}

const _del = async (from: string, messages: number[]): Promise<any> => {
  if ( from === trash.get().id || from === drafts.get().id ) {
    return await Promise.all(messages.map(m => del(`/users/me/mailboxes/${from}/messages/${m}`)))
  } else {
    return await moveTo(from, messages, trash.get().id);
  }
}

export {_del as del};

// html should be sanitized after passing to this function
export const createDraft = (src: Partial<Draft> = {}): Draft => {
  
  console.log("createDraft", src);

  const defs: Draft = {
    draft: true,
    flagged: false,
    text: "",
    html: "",
    subject: "",
    to: [],
    bcc: [],
    cc: [],
    files: [],
  }

  return Object.assign(defs, src);
  //const {message} = await post(`/users/me/mailboxes/${drafts.get().id}/messages`, draft)
  //return await get(`/users/me/mailboxes/${drafts.get().id}/messages/${message.id}`)
}

export const getDraft = async (id: number): Promise<Draft> => {
  const {flagged, text, html, subject, to, bcc, cc, files, attachments} = await _get(drafts.get().id, id);
  const d = {id} as Draft;
  flagged != null && (d.flagged = flagged);
  text != null && (d.text = text);
  html != null && (d.html = html.join(""));
  subject != null && (d.subject = subject);
  to != null && (d.to = to);
  bcc != null && (d.bcc = bcc);
  cc != null && (d.cc = cc);
  files != null && (d.files = files);

  return createDraft(d);
} 

const createBody = (action: "Re" | "Fwd", ref: Message) => {
  return "<br/>".repeat(5) +
    [
      "-".repeat(10) + " " + 
        (action === "Re" ? "Reply message" : "Forwarded message") + 
      " " + "-".repeat(10) + "<br/>",

      ref.from && (`From: <b>${s(ref.from.name) || ""}</b> ${s("<\u200B" + ref.from.address + "\u200B>")}` + "<br/>"),
      
      ref.to && ref.to.length && (`To: ${ref.to.map(to => s(to.address)).join(", ")}` + "<br/>"),
      
      "Subject: " + s(ref.subject) + "<br/>",
      
      "Date: " + s(new Date(ref.date).toUTCString()) + "<br/>",
    
    ].filter(Boolean).join("") + "<br/><br/>" +

    (ref.html && sanitize(ref.html.join("")) || "");
}

export const createReply = async (mailbox: string, message: number): Promise<Draft> => {
  const ref = await _get(mailbox, message, false);
  const html = createBody("Re", ref)

  return createDraft({
    subject: "Re: " + (ref.subject || ""),
    to: [ref.from],
    html,
    reference: {
      mailbox,
      id: message,
      action: "reply",
      attachments: false
    }
  })
}

export const createReplyAll = async (mailbox: string, message: number): Promise<Draft> => {
  const ref = await _get(mailbox, message, false);
  const html = createBody("Re", ref)

  return createDraft({
    html,
    reference: {
      mailbox,
      id: message,
      action: "replyAll",
      attachments: false
    }
  })
}

export const createForward = async (mailbox: string, message: number): Promise<Draft> => {
  const ref = await _get(mailbox, message, false);
  const html = createBody("Fwd", ref)

  const to = ref.from ? [ref.from] : [];
  ref.to?.forEach(addr => addr.address !== user.get()?.address && to.push(addr));

  const files: Draft["files"] = [];

  if (ref.attachments?.length) {
    for(const attachment of ref.attachments) {
      const {id, sizeKb, filename, contentType} = attachment;
      const file = {id, filename, contentType, size: Math.round(sizeKb * 1024)}
      files.push(file);
    }
  }

  return createDraft({
    html,
    subject: "Fwd: " + (ref.subject || ""),
    to,
    files,
    reference: {
      mailbox,
      id: message,
      action: "forward",
      attachments: true
    }
  })
}

export const createPostableDraft = (draft: Draft): PostableDraft => {

  const {
    flagged, to, cc, bcc, subject,
    text, html, files, metadata, reference
  } = draft;
  
  return {
    draft: true, flagged, to, cc, bcc, subject, text, html, metadata, reference,
    files: files.map(f => f.id).filter(Boolean)
  }
}

export const saveDraft = async (draft: Draft): Promise<SaveDraftResult> => {
  
  const toPost = createPostableDraft(draft)
  
  const {message: {id}} = await post(`/users/me/mailboxes/${drafts.get().id}/messages`, toPost);
  
  if ( draft.id != null ) {
    del(`/users/me/mailboxes/${drafts.get().id}/messages/${draft.id}`)
  }

  return id;
}

export const submitDraft = async (id: number, {deleteFiles = false} = {}): Promise<SubmitDraftResult> => {
  return post(`/users/me/mailboxes/${drafts.get().id}/messages/${id}/submit`, {deleteFiles});
}


export type SaveDraftResult = number;

export type SubmitDraftResult = {
  success: true
  queueId: string
  message?: {
    mailbox: string
    id: number
  }
}

export type Draft = {
  id?: number
  draft: true
  flagged: boolean
  to: Addr[]
  cc: Addr[]
  bcc: Addr[]
  subject: string
  text: string
  html: string
  headers?: {
    ket: string
    value: string
  }[]
  files: {
    id: string
    filename: string
    contentType: string
    size: number
  }[]
  /*
  attachments?: {
    content: string // base64
    filename: string
    contentType: string // mime
    cid: string // content id value to use in html
  }[]
  */
  metadata?: Record<string, any>
  reference?: Reference
}

export type Reference = {
  mailbox: string
  id: number
  action: "reply" | "replyAll" | "forward"
  attachments?: string[] | boolean // default false
}

export type Addr = {
  name?: string
  address: string
}

export type PostableDraft = Omit<Draft, "id" | "files"> & {
  files: string[]
}