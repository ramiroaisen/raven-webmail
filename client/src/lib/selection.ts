import { writable, Writable } from "./store";
import { Message } from "./api";

export type Item = Writable<Message>;

export const createSelection = (items: Item[] = []) => {

  const selection = writable(items);

  const clear = () => selection.set([]);

  const add = (...args: Item[]) => {
    const helper = selection.get().slice();
    for (const item of args) {
      if ( !helper.includes(item) ) {
        helper.push(item)
      }
      selection.set(helper);
    }
  }

  const remove = (...args: Item[]) => selection.update($selection => $selection.filter(i => !args.includes(i)));

  const has = (item: Item) => selection.get().includes(item);

  const toggle = (item: Item) => {
    has(item) ? remove(item) : add(item);
  }

  const isSelected = writable(has);
  selection.subscribe(isSelected.invalidate)

  return {...selection, clear, add, remove, toggle, isSelected}
}