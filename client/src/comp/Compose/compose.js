import { writable } from "../../lib/store";
import { fade, crossfade } from "svelte/transition";
import { createDraft } from "../../lib/client/messages";
export const [send, receive] = crossfade({
    duration: 300,
    fallback: (node) => fade(node, { duration: 150 })
});
export const current = writable(null);
export const wins = writable([]);
export const create = async (draft) => {
    let push = false;
    if (draft == null) {
        const $draft = await createDraft();
        draft = writable($draft);
        push = true;
    }
    else if (draft.get().id != null) {
        const d = wins.get().find(d => d.get().id === draft.get().id);
        if (d) {
            draft = d;
            push = false;
        }
        else {
            push = true;
        }
    }
    else {
        push = true;
    }
    push && wins.update(w => [draft, ...w]);
    current.set(draft);
};
