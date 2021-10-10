import { session } from "$app/stores";
import { derived } from "svelte/store";
import type { Readable } from "svelte/store";
import type { Locale } from "../../../server/src/i18n/locale";

export const locale: Readable<Locale> = derived(session, $session => $session.locale);