import {Writable, writable} from "./store";
import {DePromise} from "./util";
import * as client from "./client/client";
import * as mailboxes from "./client/mailboxes";
import { createRouter } from "./router/router";
import { routes } from "./router/routes/routes";

export type App = DePromise<ReturnType<typeof createApp>>;

let app: Promise<App> | null = null;

export const getApp = () => {
  if(app == null) {
    app = createApp();
  }
  return app;
}

const createApp = async () => {
  
  const session = writable<Record<string, any>>({});

  await client.ready.then(() => {
    return mailboxes.load();
  }).catch(() => {
    location.hash = "#!/login"
  })

  const router = createRouter(routes, session);
  await router.start();

  return {session, router}
}
