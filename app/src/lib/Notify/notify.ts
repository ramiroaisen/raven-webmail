import Notifier from "./Notifier.svelte";

let instance: Notifier | null;

export const getNotifier = (): Notifier => {
  
  if(instance == null){
    instance = new Notifier({target: document.body});
  }
  
  return instance;
}

export const _error = (message: string) => {
  getNotifier().error(message)
}

export const _message = (message: string) => {
  getNotifier().message(message);
}

export default getNotifier;