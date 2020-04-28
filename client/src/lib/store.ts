export const tick = () => new Promise(resolve => setTimeout(resolve, 0))

export type Sub<T> = (value: T) => void;
export type Unsub = () => void;
export type Upd<T> = (value: T) => T;
export type SetFn<T> = (value: T) => void; 

export interface Writable<T> {
  get: () => T
  set: (value: T) => void
  update: (fn: Upd<T>, onstart?: boolean) => void
  subscribe: (fn: Sub<T>, onstart?: boolean) => Unsub;
  invalidate: () => void;
  clone: () => Writable<T>
  readonly value: T
}

export interface Readable<T> {
  get: () => T;
  subscribe: (fn: Sub<T>, onstart?: boolean) => Unsub;
  clone: () => Readable<T>
  invalidate: () => void
  readonly value: T
}


export const writable = <T>(value: T): Writable<T> => {
  
  const subs: Sub<T>[] = []; 
  
  let valid = true;

  let timer: ReturnType<typeof setTimeout> | null = null;

  const invalidate = async () => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      for(const sub of subs){
          sub(value);
        }
      }, 1)
  }

  const get = () => value;
  
  const set = (n: T) => {
    if(value !== n || (typeof value === "object" && value !== null)){
      value = n;
      invalidate()
    }
  }

  const update = (fn: Upd<T>) => {
    set(fn(value));
  }

  const subscribe = (fn: Sub<T>, onstart = true) => {
    subs.push(fn);
    onstart && fn(value);
    return () => {
      subs.splice(subs.indexOf(fn), 1);
    }
  }

  const clone = () => writable(value);

  return {
    get, set, update, subscribe, clone, invalidate,
    get value(){return value}
  }
}

export const readonly = <T>(store: Writable<T>): Readable<T> => {
  
  const {get, subscribe, clone, invalidate} = store;

  return {
    get,
    subscribe,
    clone: () => readonly(clone()),
    invalidate,
    get value(){return store.value}
  }
}

export const readable = <T>(value: T): [Writable<T>["set"], Readable<T>] => {
  const store = writable(value);
  const {set} = store;
  return [set, readonly(store)];
}