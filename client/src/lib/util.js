import Inbox from "svelte-material-icons/InboxOutline.svelte";
import Trash from "svelte-material-icons/DeleteOutline.svelte";
import Sent from "svelte-material-icons/SendOutline.svelte";
import Junk from "svelte-material-icons/AlertDecagramOutline.svelte";
import Drafts from "svelte-material-icons/FileDocumentEditOutline.svelte";
import Other from "svelte-material-icons/FolderOutline.svelte";
const inbox = ["inbox", Inbox];
const map = {
    "\\Drafts": ["drafts", Drafts],
    "\\Junk": ["junk", Junk],
    "\\Sent": ["sent", Sent],
    "\\Trash": ["trash", Trash]
};
export const mailboxMeta = (mailbox, labels) => {
    if (mailbox.path === "INBOX") {
        const [id, icon] = inbox;
        return { label: labels[id], icon };
    }
    else if (mailbox.specialUse && map[mailbox.specialUse] !== null) {
        const [id, icon] = map[mailbox.specialUse];
        return { label: labels[id], icon };
    }
    else {
        return { label: mailbox.name, icon: Other };
    }
};
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const tick = () => sleep(0);
