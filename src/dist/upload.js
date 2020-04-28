"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = async (config) => {
    const mod = (config.wildduck_api_url.startsWith("https") ? require("https") : require("http"));
    const agent = new mod.Agent({ keepAlive: true });
    return async (req, res) => {
        const accessToken = req.session.accessToken;
        if (!accessToken) {
            return res.json({ error: { message: "You are not logged in :(" } });
        }
        const filename = String(req.query.filename || "unnamed");
        const contentType = String(req.query.contentType || "application/octet-stream");
        const e = encodeURIComponent;
        const url = config.wildduck_api_url + "/users/me/storage?filename=" + e(filename) + "&contentType=" + e(contentType);
        const out = mod.request(url, {
            agent,
            method: "POST",
            headers: {
                "content-type": "application/binary",
                "x-access-token": accessToken,
            },
        });
        req.pipe(out);
        out.on("response", (inc) => {
            res.writeHead(inc.statusCode || 200, {
                "content-type": inc.headers["content-type"],
                "content-length": inc.headers["content-length"]
            });
            inc.pipe(res);
        });
        out.on("error", (err) => {
            try {
                res.writeHead(500, { "content-type": "application/json" });
                res.write(JSON.stringify({ error: err.message }));
                res.end();
            }
            catch (e) { }
        });
    };
};
