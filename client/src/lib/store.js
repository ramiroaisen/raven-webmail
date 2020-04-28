export const tick = () => new Promise(resolve => setTimeout(resolve, 0));
export const writable = (value) => {
    const subs = [];
    let valid = true;
    let timer = null;
    const invalidate = async () => {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            for (const sub of subs) {
                sub(value);
            }
        }, 1);
    };
    const get = () => value;
    const set = (n) => {
        if (value !== n || (typeof value === "object" && value !== null)) {
            value = n;
            invalidate();
        }
    };
    const update = (fn) => {
        set(fn(value));
    };
    const subscribe = (fn, onstart = true) => {
        subs.push(fn);
        onstart && fn(value);
        return () => {
            subs.splice(subs.indexOf(fn), 1);
        };
    };
    const clone = () => writable(value);
    return {
        get, set, update, subscribe, clone, invalidate,
        get value() { return value; }
    };
};
export const readonly = (store) => {
    const { get, subscribe, clone, invalidate } = store;
    return {
        get,
        subscribe,
        clone: () => readonly(clone()),
        invalidate,
        get value() { return store.value; }
    };
};
export const readable = (value) => {
    const store = writable(value);
    const { set } = store;
    return [set, readonly(store)];
};
