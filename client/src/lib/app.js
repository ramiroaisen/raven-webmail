import { writable } from "./store";
import * as client from "./client/client";
import * as mailboxes from "./client/mailboxes";
import { createRouter } from "./router/router";
import { routes } from "./router/routes/routes";
let app = null;
export const getApp = () => {
    if (app == null) {
        app = createApp();
    }
    return app;
};
const createApp = async () => {
    const session = writable({});
    await client.ready.then(() => {
        return mailboxes.load();
    }).catch(() => {
        location.hash = "#!/login";
    });
    const router = createRouter(routes, session);
    await router.start();
    return { session, router };
};
