"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("./client/client");
exports.auth = (config) => {
    const router = express_1.Router();
    router.get("/logout", (req, res) => {
        req.session.accessToken = null;
        res.redirect(302, "/");
    });
    router.post("/login", async (req, res) => {
        const username = req.body.username || "";
        const password = req.body.password || "";
        const client = new client_1.Client({ host: config.wildduck_api_url });
        try {
            const token = await client.login(username, password);
            req.session.accessToken = token;
            res.json({ success: true });
        }
        catch (e) {
            res.json({ error: { message: e.message } });
        }
    });
    return router;
};
