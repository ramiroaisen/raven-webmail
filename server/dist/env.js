"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVELTEKIT_PORT = exports.SVELTEKIT_DEV = exports.DISPLAY_ERRORS = void 0;
const bool = (v) => {
    return v === "1" || (v === null || v === void 0 ? void 0 : v.toLowerCase()) === "true";
};
exports.DISPLAY_ERRORS = bool(process.env.RAVEN_DISPLAY_ERRORS);
exports.SVELTEKIT_DEV = bool(process.env.RAVEN_SVELTEKIT_DEV);
exports.SVELTEKIT_PORT = Number(process.env.RAVEN_SVELTEKIT_PORT) || 3000;
//# sourceMappingURL=env.js.map