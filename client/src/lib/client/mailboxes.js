import { get, post, watch } from "./client";
import { writable } from "../store";
export const inbox = writable(null);
export const sent = writable(null);
export const drafts = writable(null);
export const trash = writable(null);
export const junk = writable(null);
export const all = writable([]);
export const others = writable([]);
let watching = false;
export const load = async () => {
    console.log("[WS] getting mailboxes");
    const res = await get("/users/me/mailboxes?counters=true");
    console.log("[WS] mailboxes received");
    const mailboxes = res.results;
    const $all = [];
    const $others = [];
    for (const box of mailboxes) {
        //const store = writable(box);
        let store;
        switch (box.specialUse) {
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
                if (box.path === "INBOX") {
                    inbox.set(box);
                    store = inbox;
                }
                else {
                    store = writable(box);
                    $others.push(store);
                }
        }
        $all.push(store);
    }
    all.set($all);
    others.set($others);
    if (!watching) {
        watching = true;
        watch((event) => {
            if (event.command === "COUNTERS") {
                const box = _get(event.mailbox);
                if (box && box.get()) {
                    box.update(box => ({ ...box, total: event.total, unseen: event.unseen }));
                }
            }
        });
    }
};
const _get = (id) => {
    return all.get().find(b => b.get().id === id);
};
export const createMailbox = async (path) => {
    await post("/users/me/mailboxes", { path });
    await load();
};
export { _get as get };
