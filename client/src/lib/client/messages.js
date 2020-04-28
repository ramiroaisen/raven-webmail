import { get, post, put, del, user } from "./client";
import { junk, inbox, trash, drafts } from "./mailboxes";
import s from "html-escape";
import { sanitize } from "../sanitize";
const _get = async (mailboxId, messageId, markAsSeen = true) => {
    return await get(`/users/me/mailboxes/${mailboxId}/messages/${messageId}${markAsSeen ? `?markAsSeen=true` : ""}`);
};
export { _get as get };
export const list = async (from) => {
    console.log("[WS] listing messages", from);
    const { nextCursor, previousCursor, results } = await get(`/users/me/mailboxes/${from}/messages`);
    console.log("[WS] messages received");
    return { next: nextCursor, prev: previousCursor, messages: results };
};
export const flag = async (mailboxId, messages, value) => {
    return await put(`/users/me/mailboxes/${mailboxId}/messages`, {
        message: messages.join(","),
        flagged: value
    });
};
export const markAsSpam = async (from, messages, value) => {
    const junkId = junk.get().id;
    const inboxId = inbox.get().id;
    if (value) {
        if (from === junkId) {
            throw new Error("The messages are already in Junk folder");
        }
        return await moveTo(from, messages, junkId);
    }
    else {
        if (from !== junkId) {
            throw new Error("To unmark as spam the must be in the Junk folder");
        }
        return await moveTo(from, messages, inboxId);
    }
};
export const updateSeen = async (from, messages, value) => {
    return await put(`/users/me/mailboxes/${from}/messages`, {
        message: messages.join(","),
        seen: value
    });
};
export const moveTo = async (from, messages, to) => {
    if (from === to) {
        throw new Error("messages.moveTo 'from' and 'to' are the same mailbox");
    }
    return await put(`/users/me/mailboxes/${from}/messages`, {
        message: messages.join(','),
        moveTo: to
    });
};
export const next = async (from, cursor) => {
    const { nextCursor, previousCursor, results } = await get(`/users/me/mailboxes/${from}/messages?next=${cursor}`);
    return { next: nextCursor, prev: previousCursor, messages: results };
};
const _del = async (from, messages) => {
    if (from === trash.get().id || from === drafts.get().id) {
        return await Promise.all(messages.map(m => del(`/users/me/mailboxes/${from}/messages/${m}`)));
    }
    else {
        return await moveTo(from, messages, trash.get().id);
    }
};
export { _del as del };
// html should be sanitized after passing to this function
export const createDraft = (src = {}) => {
    console.log("createDraft", src);
    const defs = {
        draft: true,
        flagged: false,
        text: "",
        html: "",
        subject: "",
        to: [],
        bcc: [],
        cc: [],
        files: [],
    };
    return Object.assign(defs, src);
    //const {message} = await post(`/users/me/mailboxes/${drafts.get().id}/messages`, draft)
    //return await get(`/users/me/mailboxes/${drafts.get().id}/messages/${message.id}`)
};
export const getDraft = async (id) => {
    const { flagged, text, html, subject, to, bcc, cc, files, attachments } = await _get(drafts.get().id, id);
    const d = { id };
    flagged != null && (d.flagged = flagged);
    text != null && (d.text = text);
    html != null && (d.html = html.join(""));
    subject != null && (d.subject = subject);
    to != null && (d.to = to);
    bcc != null && (d.bcc = bcc);
    cc != null && (d.cc = cc);
    files != null && (d.files = files);
    return createDraft(d);
};
const createBody = (action, ref) => {
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
};
export const createReply = async (mailbox, message) => {
    const ref = await _get(mailbox, message, false);
    const html = createBody("Re", ref);
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
    });
};
export const createReplyAll = async (mailbox, message) => {
    const ref = await _get(mailbox, message, false);
    const html = createBody("Re", ref);
    return createDraft({
        html,
        reference: {
            mailbox,
            id: message,
            action: "replyAll",
            attachments: false
        }
    });
};
export const createForward = async (mailbox, message) => {
    var _a, _b;
    const ref = await _get(mailbox, message, false);
    const html = createBody("Fwd", ref);
    const to = ref.from ? [ref.from] : [];
    (_a = ref.to) === null || _a === void 0 ? void 0 : _a.forEach(addr => { var _a; return addr.address !== ((_a = user.get()) === null || _a === void 0 ? void 0 : _a.address) && to.push(addr); });
    const files = [];
    if ((_b = ref.attachments) === null || _b === void 0 ? void 0 : _b.length) {
        for (const attachment of ref.attachments) {
            const { id, sizeKb, filename, contentType } = attachment;
            const file = { id, filename, contentType, size: Math.round(sizeKb * 1024) };
            files.push(file);
        }
    }
    return createDraft({
        html,
        subject: "Re: " + (ref.subject || ""),
        to,
        files,
        reference: {
            mailbox,
            id: message,
            action: "forward",
            attachments: true
        }
    });
};
export const createPostableDraft = (draft) => {
    const { flagged, to, cc, bcc, subject, text, html, files, metadata, reference } = draft;
    return {
        draft: true, flagged, to, cc, bcc, subject, text, html, metadata, reference,
        files: files.map(f => f.id).filter(Boolean)
    };
};
export const saveDraft = async (draft) => {
    const toPost = createPostableDraft(draft);
    const { message: { id } } = await post(`/users/me/mailboxes/${drafts.get().id}/messages`, toPost);
    if (draft.id != null) {
        del(`/users/me/mailboxes/${drafts.get().id}/messages/${draft.id}`);
    }
    return id;
};
export const submitDraft = async (id, { deleteFiles = false } = {}) => {
    return post(`/users/me/mailboxes/${drafts.get().id}/messages/${id}/submit`, { deleteFiles });
};
