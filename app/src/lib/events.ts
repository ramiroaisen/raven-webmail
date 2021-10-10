export const Event = <T>() => {

  type Handler = (evnet: T) => void;

  let _id = 0;

  const map = new Map<number, Handler>();

  const on = (handler: Handler) => {
    const id = ++_id;
    map.set(id, handler);
    return () => {
      map.delete(id)
    }
  }

  const dispatch = (v: T) => {
    for(const handler of map.values()) {
      handler(v);
    }
  }

  return { on, dispatch };
}

export type CounterEvent = {
  command: "COUNTERS",
  mailbox: string
  total: number
  unseen: number
}

export type ExistsEvent = {
  command: "EXISTS",
  mailbox: string
  message?: string
  uid?: number
}

export type ExpungeEvent = {
  command: "EXPUNGE",
  mailbox: string
  message?: string
  uid?: number
}

export const Counters = Event<CounterEvent>();
export const Exists = Event<ExistsEvent>();
export const Expunge = Event<ExpungeEvent>();
