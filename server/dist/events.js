"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = exports.Event = void 0;
const Event = () => {
    let _id = 0;
    const map = new Map();
    const on = (handler) => {
        const id = ++_id;
        map.set(id, handler);
        return () => {
            map.delete(id);
        };
    };
    const dispatch = (v) => {
        for (const handler of map.values()) {
            handler(v);
        }
    };
    return { on, dispatch };
};
exports.Event = Event;
exports.Auth = (0, exports.Event)();
//# sourceMappingURL=events.js.map