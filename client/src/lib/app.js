import { writable, readonly } from "./store";
import * as client from "./client/client";
import * as mailboxes from "./client/mailboxes";
import { createRouter } from "./router/router";
import { routes } from "./router/routes/routes";
import { Trans } from "../lib/i18n";
let app = null;
export const getApp = () => {
    if (app == null) {
        app = createApp();
    }
    return app;
};
const createApp = async () => {
    const $locale = window.__RAVEN__.locale;
    const locale = writable($locale);
    const trans = writable(Trans($locale));
    locale.subscribe($locale => {
        trans.set(Trans($locale));
    }, false);
    const session = writable({});
    await client.ready.then(() => {
        return mailboxes.load();
    }).catch(() => {
        location.replace("#!/login");
    });
    const router = createRouter(routes, session);
    await router.start();
    return { session, router, trans: readonly(trans), locale: readonly(locale) };
};
