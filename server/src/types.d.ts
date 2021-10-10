import { RequestHandler } from "express";
import { Authentication } from "./client";
import { Config } from "./config";
import { Locales } from "./i18n/i18n";

declare module "express-session" {
  interface SessionData {
    authentication?: Authentication | null 
  }
}

export type Kit = {
  assetsMiddleware: RequestHandler,
  kitMiddleware: RequestHandler,
  prerenderedMiddleware: RequestHandler
}

declare global {
  const __RAVEN__: { config: Config }
  const __RAVEN_IMPORT_SVELTEKIT__: () => Promise<Kit>
}