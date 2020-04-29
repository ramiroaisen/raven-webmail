import { Writable, writable, readonly } from "./store";
import { DePromise } from "./util";
import * as client from "./client/client";
import * as mailboxes from "./client/mailboxes";
import { createRouter } from "./router/router";
import { routes } from "./router/routes/routes";
import { Locale } from "../../../src/i18n/types";
import { Trans } from "../lib/i18n";

export type App = DePromise<ReturnType<typeof createApp>>;

let app: Promise<App> | null = null;

export const getApp = () => {
  if(app == null) {
    app = createApp();
  }
  return app;
}

const createApp = async () => {

  const $locale = (window as any).__RAVEN__.locale as Locale;

  const locale = writable($locale);
  const trans = writable(Trans($locale));

  locale.subscribe($locale => {
    trans.set(Trans($locale))
  }, false)

  const session = writable<Record<string, any>>({});

  await client.ready.then(() => {
    return mailboxes.load();
  }).catch(() => {
    location.replace("#!/login");
  })

  const router = createRouter(routes, session);
  await router.start();

  return {session, router, trans: readonly(trans), locale: readonly(locale)};
}
