import { writable, readonly, Writable } from "../../lib/store";
import { fade, crossfade } from "svelte/transition";

import { createDraft, Draft } from "../../lib/client/messages";

export const [send, receive] = crossfade({
  duration: 300,
  fallback: (node: Element) => fade(node, { duration: 150 } as any)
} as any);

export const current = writable<Writable<Draft> | null>(null);
export const wins = writable<Writable<Draft>[]>([]);

export const create = async (draft?: Writable<Draft>) => {

  let push = false;

  if (draft == null) {
    const $draft = await createDraft();
    draft = writable($draft);
    push = true;
  } else if (draft.get().id != null) {
    const d = wins.get().find(d => d.get().id === draft!.get().id);
    if (d) {
      draft = d;
      push = false;
    } else {
      push = true;
    }
  } else {
    push = true;
  }

  push && wins.update(w => [draft!, ...w])
  current.set(draft!);
}