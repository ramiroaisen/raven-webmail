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

export type AuthEvent = {
  sid: string
  username: string | null
}

export const Auth = Event<AuthEvent>();
