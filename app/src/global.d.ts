/// <reference types="@sveltejs/kit" />

import type { Locale } from "../../server/src/i18n/locale";

interface SessionData {
  lang: string
  locale: Locale
}
