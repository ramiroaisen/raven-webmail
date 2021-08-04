import { writable } from "../store";
let _uid = 0;
const uid = () => ++_uid;
const callbacks = new Map();
const awaiters = new Map();
export const user = writable(null);
const ws = new Promise((resolve, reject) => {
    const url = new URL("/ws", location.href);
    url.protocol = location.protocol.replace("http", "ws");
    console.log("[WS] connecting");
    const ws = new WebSocket(url.href);
    ws.onerror = reject;
    ws.onopen = () => {
        console.log("[WS] open");
        setInterval(() => send({ id: uid(), type: "ping" }), 30000);
    };
    ws.onclose = () => window.location.reload();
    ws.onmessage = (m) => {
        console.log("[WS] first message received");
        const { user: $user } = JSON.parse(m.data);
        user.set($user);
        ws.onmessage = m => {
            const msg = JSON.parse(m.data);
            switch (msg.type) {
                case "resolve":
                    const awaiter = awaiters.get(msg.replyTo);
                    if (awaiter == null) {
                        console.warn("[WS] Call resolve to empty awaiter");
                    }
                    else {
                        const [resolve] = awaiter;
                        resolve(msg.arg);
                    }
                    awaiters.delete(msg.replyTo);
                    break;
                case "call":
                    const fn = callbacks.get(msg.callId);
                    if (fn == null) {
                        console.warn("[WS] Call call to empty callback");
                    }
                    else {
                        fn(msg.arg);
                    }
                    break;
                case "reject":
                    const aw = awaiters.get(msg.replyTo);
                    if (aw == null || aw[1] == null) {
                        console.warn("[WS] Call reject to empty awaiter");
                    }
                    else {
                        const [_, reject] = aw;
                        reject({ message: msg.message });
                    }
                    awaiters.delete(msg.replyTo);
                    break;
                case "error":
                    console.warn(`[WS] Error from backend: ${msg.message}`);
                    break;
                case "ping":
                    send({ id: uid(), type: "pong", replyTo: msg.id });
                    break;
                case "pong":
                    const aws = awaiters.get(msg.replyTo);
                    if (aws != null) {
                        const [resolve] = aws;
                        resolve(null);
                        awaiters.delete(msg.replyTo);
                    }
                    else {
                        console.warn("[Mailer] Call pong to empty receiver");
                    }
                    break;
            }
        };
        resolve(ws);
    };
});
export const ready = ws.then(() => void 0);
export const send = async (msg) => {
    (await ws).send(JSON.stringify(msg));
    return {
        then: (resolve, reject) => {
            awaiters.set(msg.id, [resolve, reject]);
        }
    };
};
export const login = async ({ username, password }, goto = "/") => {
    const json = await fetch("/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password })
    }).then(res => res.json());
    if (json.error) {
        throw new Error(json.error.message);
    }
    location.replace(goto);
    return json;
};
export const logout = async () => {
    location.assign("/logout");
};
export const get = async (path) => {
    return send({ id: uid(), type: "get", path });
};
export const post = async (path, body) => {
    return send({ id: uid(), type: "post", path, body });
};
export const put = async (path, body) => {
    return send({ id: uid(), type: "put", path, body });
};
export const del = async (path) => {
    return send({ id: uid(), type: "del", path });
};
const watchers = new Set();
let watching = false;
export const watch = async (fn) => {
    watchers.add(fn);
    if (!watching) {
        watching = true;
        const onChange = (change) => {
            console.log("[WS] Change", change);
            for (const fn of watchers) {
                fn(change);
            }
        };
        const callbackId = uid();
        callbacks.set(callbackId, onChange);
        send({ id: uid(), type: "watch", callbackId });
    }
    return () => {
        watchers.delete(fn);
    };
};
