import Notify, { SvelteComponent } from "./Notify.svelte";

let notify: SvelteComponent = null;

export const getNotifier = () => {
  if(notify != null) 
    return notify;
  
  notify = new Notify({target: document.body});

  return notify;
}
